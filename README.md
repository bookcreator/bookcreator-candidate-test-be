# Book Creator Backend Engineer Candidate Technical Assessment

Using the Cloud Vision API face detection to overlay an emoji on a picture containing a face. (Looked the most fun of all the options!)

## Prerequisites

Install gcloud CLI (https://cloud.google.com/sdk/docs/install-sdk)
Install Postman

# Installation Instructions

npm install

# How to use

There is an example postman export within the solution to get you started.

Call the API using postman or your preferred method;

POST http://localhost:8080/overlay-emoji
POST https://cloudrun1-195296148861.europe-west1.run.app/overlay-emoji

The request format should be in this format:

{
"imageUrl": "https://example.com/path/to/image.jpg"
}

When running locally, ensure that you have set the GOOGLE_APPLICATION_CREDENTIALS in terminal as follows:
set GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\service-account-file.json"

# Details

Google Cloud Build has been installed into the fork repo to allow CICD.

Cloud Run Details:
Name: cloudrun1
Region: europe-west1
Endpoint URL: https://cloudrun1-195296148861.europe-west1.run.app

## Packages

Dependencies:

- @google-cloud/vision (^4.3.2): Provides the Google Cloud Vision API client for detecting and analyzing images.
- express (^4.21.2): A minimalist web framework for Node.js.
- axios (^1.7.9)
- path (^0.12.7): Allow us to work with file/directory paths
- sharp (^0.33.5): A image processing library. It allows you to resize, crop, convert, and manipulate images efficiently.

DevDependencies:

- nodemon (^3.1.9): Development tool that automatically restarts your Node.js application when file changes are detected.

# To do

- Extend postman testing suite
- Automated testing with supertest
- Error handling
- Swagger documentation

# Potential future features

- Allow the user to choose the emoji
