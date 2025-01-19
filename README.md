# Photo Color Selector

This is a simple express app which allows users to send in an image and recieve information about what colours were most common in the image.

It uses google cloud's vision API to detect dominant colour in the image and returns them in an human readable format.

# Try it yourself

It is currently deployed at https://photo-color-selector-619325840178.europe-west1.run.app/ using google cloud run. 

To send an image and recieve a color wheel send a `POST` request following the below format: 

```bash
curl --location 'https://photo-color-selector-619325840178.europe-west1.run.app/imageUrl?colorWheel=true' \
--header 'Content-Type: application/json' \
--data '{
    "imageUrl": "<SOME-IAMGE-URL>"
}' --output "<SOME_OUTPUT_FILEPATH>
```

To recieve a list of dominant colours with thier percentages, remove the `colorWheel` query parameter or set it to `false`. 

```bash
curl --location 'https://photo-color-selector-619325840178.europe-west1.run.app/imageUrl' \
--header 'Content-Type: application/json' \
--data '{
    "imageUrl": "<SOME-IAMGE-URL>"
}'
```

### Example request

```bash
curl --location 'https://photo-color-selector-619325840178.europe-west1.run.app/imageUrl?colorWheel=true' \
--header 'Content-Type: application/json' \
--data '{
    "imageUrl": "https://www.arohatours.co.nz/media/1645/banner_queenstown-g.jpg?mode=crop&height=550&width=1050&quality=80"
}' \
--output colour-wheel.png
```


# Local Development

You can run this app locally and access the vision API using the cloud CLI. 

To run the app locally there are two setup stages you need to do: 
1. Setup the service by installing dependencies and environment variables 
2. Setup your google cloud project and give it the required access 

Once you've completed the above you should be able to run the app and hit it from a rest client on your computer!

## Service Setup

**Prerequisites**

- `node` v20 - if you use nvm can run `nvm use` to set this to the current version
- `npm`

### Steps to setup:
1. Install dependencies with `npm`
    ```bash
    npm install
    ```
2. create an `.env` file - you can copy the `.env.sample` file to get started

## Local gcloud setup

**Prerequisites**

- `gcloud` cli
- `gcloud` cli authenticated to your account via `gcloud auth application-default login`

### Set up vision API from your local machine

1. Create gcloud project in the Console - `photo-color-selector-project`
2. Set gcloud CLI to the current project

    ```bash
    gcloud config set project photo-color-selector-project
    ```

> NOTE: you may have to authenticate again using `gcloud auth application-default login`

3. Enable the Vision API for the project

    ```bash
    gcloud services enable vision.googleapis.com
    ```

## Running the app


### Development  server
You can run a development server for the app which refreshes every time you run the code with:

```bash
npm run dev
```

To run the app as its run in cloud run use: `node src/index.js`


### Testing/Linting/Formatting 

Run tests with: `npm run test`

Run linting with: `npm run lint`

Run formatting with: `npm run format`

# Deploying to cloud run from the cli


## Deployment pipeline setup:
1. If you haven't already done it, run steps 1 and 2 from [Set up vision API from your local machine](#set-up-vision-api-from-your-local-machine)

2. Enable the Cloud Run Admin API, the Cloud Build API and the Vision API

    ```bash
    gcloud services enable run.googleapis.com cloudbuild.googleapis.com
    ```

3.  Grant Cloud Build Service account role to the compute engine using
    > You can get the PROJECT_NUMBER using `gcloud projects list`

    ```bash
    gcloud projects add-iam-policy-binding photo-color-selector-project \
        --member=serviceAccount:<PROJECT_NUMBER>-compute@developer.gserviceaccount.com \
        --role=roles/cloudbuild.builds.builder
    ```

## Deploy:

Deploy to gcloud using the following command which will output a url when successful.

```bash
gcloud run deploy photo-color-selector --region europe-west1  --source .
```



# Endpoint Spec

### `POST /imageUrl`

body:

```json
{ "imageUrl": "<SOME IMAGE URL>" }
```

Returns a human readable list of the top 5 colors in the image

### Query params:

- **`colorWheel`** (OPTIONAL) - boolean - when `true`, instead of the list of colours, a proportional color wheel is returned.

### Example curl request:

**No color wheel**

```bash
curl --location 'localhost:8080/imageUrl' \
--header 'Content-Type: application/json' \
--data '{
    "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThM5eW3eQPlMNgZYECgp5gxDviNXtGBj_yxA&s"
}'
```

returns:

```json
{
  "colors": [
    {
      "r": 99,
      "g": 88,
      "b": 92,
      "percentage": 28.62029700679065
    },
    {
      "r": 127,
      "g": 119,
      "b": 127,
      "percentage": 26.871911400404986
    },
    {
      "r": 114,
      "g": 121,
      "b": 143,
      "percentage": 17.027745277579093
    },
    {
      "r": 73,
      "g": 87,
      "b": 111,
      "percentage": 16.685671282761565
    },
    {
      "r": 152,
      "g": 145,
      "b": 154,
      "percentage": 10.794375032463707
    }
  ]
}
```

**With color wheel**

```bash
curl --location 'localhost:8080/imageUrl?colorWheel=false' \
--header 'Content-Type: application/json' \
--data '{
    "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThM5eW3eQPlMNgZYECgp5gxDviNXtGBj_yxA&s"
}'
```

Returns: colour wheel PNG image to be downloaded
