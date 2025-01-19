# Book Creator Backend Engineer Candidate Technical Assessment

The purpose of this test is mainly for us to get an idea of your technical capability. It will also serve as a starting point for discussions about how you think about and communicate the decisions you make when you write code, should you get through to the next stage.

## What is the task?

Your task is to write and deploy a minimal but interesting service using [Google Cloud's free tier](https://cloud.google.com/free). The only requirements are that you must:

1. deploy this service to [Cloud Run](https://cloud.google.com/run/docs); and
2. use one other Google Cloud service from the [free tier list](https://cloud.google.com/free/docs/free-cloud-features#free-tier-usage-limits).

The easiest way to get going on this task will be to sign up for a Google Cloud free trial. This will require you to enter some billing details to confirm your identity. If you would rather not enter your billing details, or you have already used the Google Cloud free trial and your usage is beyond the free tier limits, then please email the person who sent you this test with details of a Google account that you control so that we can provision a project for you.

This is an intentionally vague requirement - we're excited to see what you come up with. To kick start your thinking, here are some ideas. Feel free to pick one of these if your creative juices aren't flowing today.

Make an API that can:

1. Use the [Cloud Vision API face detection](https://cloud.google.com/vision/docs/detecting-faces) to overlay an emoji on a picture containing a face.
2. Use the [Cloud Natural Language API](https://cloud.google.com/natural-language/docs/analyzing-sentiment) to perform sentiment analysis to encourage us to be more positive in our writing.
3. Use [Cloud Firestore](https://cloud.google.com/firestore/docs) to make a URL shortener.
4. Use [Speech-to-text](https://cloud.google.com/speech-to-text/docs) to read a document or book.

## What are we looking for?

We'll use the following rubric to evaluate your submission.

1. Does the README contain instructions about what the API does, how to use it and what URL to find it at?
2. Is the API simple and easy-to-use?
3. Does the deployed service work as described in the README?
4. Can I build and run the code locally within seconds or minutes of initial checkout?
5. Did they use Cloud Build to build and deploy to the cloud? (Optional)
6. Is the code clean, readable and well structured?
7. Have they thought about testing? (Comprehensive tests are not expected but some consideration of testability would be nice to see.)

## Are there any restrictions?

Not really, go wild!
Feel free to add any dependencies you need (although we might ask you to justify your decisions at the interview stage).
Use AI coding tools (but be prepared to stand by the code you submit).
Spend as much or as little time as you want (we think that you should be able to achieve something cool in an hour or two and you might get penalised if we feel you've over engineered things.)

## How do I submit the test?

Make a PR against this repo.

Feel free to contact the person who sent you this test if you have any questions at all. Good luck!
