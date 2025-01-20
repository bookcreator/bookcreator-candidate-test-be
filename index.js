const { Firestore } = require("@google-cloud/firestore");
const functions = require("@google-cloud/functions-framework");
const { createHash } = require("crypto");
require("dotenv").config();

/**
 * @type {Firestore}
 */
let firestore;

/**
 * @type {FirebaseFirestore.CollectionReference<{url: string}>}
 */
let fireStoreCollection;

/**
 * Returns the relevant firestore collection, used for lazy init of firestore
 * @returns {FirebaseFirestore.CollectionReference<{url: string}>} Firestore link collection
 */
const getFireStoreCollection = () => {
  firestore =
    firestore ||
    new Firestore({
      databaseId: process.env.FIREBASE_DATABASE ?? "(database)",
    });

  return firestore.collection("littleLinks");
};

/**
 * Generate a Base62-encoded short hash from a string.
 * @param {string} url - The input string to hash.
 * @param {number} rehashCount - Number of rehashes to apply in case of conflict (default: 0).
 * @returns {string} - A Base62 encoded short hash.
 */
function generateShortHash(url, rehashCount = 0) {
  const base62Chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  // Generate the hash and apply rehashing if needed
  let hash = createHash("md5").update(url).digest("hex");
  for (let i = 0; i < rehashCount; ++i) {
    hash = createHash("md5").update(hash).digest("hex");
  }

  // Take the first 12 characters of the hash
  const shortHashHex = hash.substring(0, 12);

  // Convert the hexadecimal value to a BigInt
  const decimalValue = BigInt(`0x${shortHashHex}`);

  // Encode the BigInt as a Base62 string
  const encodeBase62 = (value) => {
    let result = "";
    const base = BigInt(base62Chars.length);
    while (value > 0) {
      const remainder = value % base;
      result = base62Chars[Number(remainder)] + result;
      value = value / base;
    }
    return result || "0";
  };

  return encodeBase62(decimalValue);
}

function isValidURL(url) {
  const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return regex.test(url);
}

const createLittleLink = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    if (!isValidURL(url)) {
      return res
        .status(400)
        .json({ error: "URL must be a valid url including protocol" });
    }

    fireStoreCollection = fireStoreCollection || getFireStoreCollection();

    let shortId = generateShortHash(url);
    let docRef = fireStoreCollection.doc(shortId);
    let doc = await docRef.get();
    let hashAttempts = 0;

    while (doc.exists && doc.data().url !== url) {
      hashAttempts++;
      shortId = generateShortHash(url, hashAttempts);
      docRef = fireStoreCollection.doc(shortId);
      doc = await docRef.get();
    }

    await docRef.set({ url });

    res.json({
      shortLink: `${req.protocol}://${req.get("host")}/retrieveLittleLink/${shortId}`,
    });
  } catch (error) {
    console.error("Error creating little link:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const retrieveLittleLink = async (req, res) => {
  try {
    if (req.method !== "GET") {
      return res.status(405).send("Method Not Allowed");
    }

    // Get the param from the url naively
    const urlParts = req.url.split("/").filter(Boolean);
    const shortId = urlParts[urlParts.length - 1];

    if (!shortId) {
      return res.status(400).send("Short link ID is required");
    }

    fireStoreCollection = fireStoreCollection || getFireStoreCollection();

    const document = await fireStoreCollection.doc(shortId).get();
    if (!document.exists) {
      return res.status(404).send("Short link not found");
    }

    res.redirect(document.data().url);
  } catch (error) {
    console.error("Error retrieving little link:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

functions.http("createLittleLink", createLittleLink);
functions.http("retrieveLittleLink", retrieveLittleLink);

// Some pain points modelling production as per: https://github.com/GoogleCloudPlatform/functions-framework/issues/59
// Little bit of a workaround
functions.http("local", async (req, res) => {
  const extractBasePath = (path) => {
    return path.split("/").filter(Boolean)[0];
  };
  switch (extractBasePath(req.path)) {
    case "createLittleLink":
      return createLittleLink(req, res);
    case "retrieveLittleLink":
      return retrieveLittleLink(req, res);
    default:
      res.send("function not defined");
  }
});

// Export functions at the bottom as requested
module.exports = {
  createLittleLink,
  retrieveLittleLink,
  generateShortHash,
  isValidURL
};
