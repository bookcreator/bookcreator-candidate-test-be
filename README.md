# Basic express app

This is a simple express app with tests, babel(for jest), eslint and prettier configured

## Local Development

To run a local app which refeshes whenever you change the code run: `npm run dev`

Run tests with: `npm run test`

Run linting with: `npm run lint`

Run formatting with: `npm run format`


## Deploying to cloud run from the cli 

### Prerequisites: 
- gcloud cli 
- gcloud cli authenticated to your account 

### Steps to deploy
1. Create gcloud project on the Console - `photo-color-selector-project`

2. Set gcloud CLI to the current project 
```bash
gcloud config set project photo-color-selector-project
```
> May have to authenticate again using `gcloud auth application-default login`

3. Enable the Cloud Run Admin API and the Cloud Build API
```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com 
```

4.  Grant Cloud Build Service account role to the compute engine using
> You can get the PROJECT_NUMBER using `gcloud projects list`
```bash
gcloud projects add-iam-policy-binding photo-color-selector-project \
    --member=serviceAccount:<PROJECT_NUMBER>-compute@developer.gserviceaccount.com \
    --role=roles/cloudbuild.builds.builder
```

gcloud projects add-iam-policy-binding photo-color-selector-project \
    --member=serviceAccount:619325840178-compute@developer.gserviceaccount.com \
    --role=roles/cloudbuild.builds.builder


### Deploy: 
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