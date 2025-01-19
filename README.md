# Basic express app

This is a simple express app which allows users to send in an images and recieve information about what colours were most common in the image. 

It uses google cloud's vision API to detect dominant colour in the image and returns them in an human readable format. 

# Local Development

You can run this app locally and access the vision api using the cloud CLI. 

### Prerequisites: 
- gcloud cli 
- gcloud cli authenticated to your account 

## Set up vision API from your local machine
1. Create gcloud project on the Console - `photo-color-selector-project`
2. Set gcloud CLI to the current project 
```bash
gcloud config set project photo-color-selector-project
```
> May have to authenticate again using `gcloud auth application-default login`

3. Enable the Vision API for the project
```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com vision.googleapis.com
```

## Running and testing
To run a local app which refeshes whenever you change the code run: `npm run dev`

Run tests with: `npm run test`

Run linting with: `npm run lint`

Run formatting with: `npm run format`


# Deploying to cloud run from the cli 

⚠️ If you haven't already re-run steps 1 and 2 from [Local Development](#local-development)

## Deployment pipeline setup: 
1. Enable the Cloud Run Admin API, the Cloud Build API and the Vision API 
```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
```

2.  Grant Cloud Build Service account role to the compute engine using
> You can get the PROJECT_NUMBER using `gcloud projects list`
```bash
gcloud projects add-iam-policy-binding photo-color-selector-project \
    --member=serviceAccount:<PROJECT_NUMBER>-compute@developer.gserviceaccount.com \
    --role=roles/cloudbuild.builds.builder
```

## Deploy: 
```bash 
gcloud run deploy photo-color-selector --region europe-west1  --source .
```

# Endpoints 

### `POST /imageUrl` 

example curl request: 
```bash
curl --location 'localhost:3000/imageUrl' \
--header 'Content-Type: application/json' \
--data '{
    "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThM5eW3eQPlMNgZYECgp5gxDviNXtGBj_yxA&s"
}'
```