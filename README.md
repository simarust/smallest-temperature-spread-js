# Weather analyses

## Description
This is a full stack web application for uploading and analyzing weather data.\
A demo of this app can be found at https://weather-analyses.firebaseapp.com.

## Frontend
The frontend is a single-page react application.\
It uses the UI framework [material-ui](https://material-ui-next.com/) which provides react components that implement Google's Material Design.\
The frontend communicates with the backend using a REST interface.

## Backend
The [firebase](https://firebase.google.com/) backend consists of a real-time database and several cloud functions.

### Cloud functions
The cloud functions provide a REST interface to the frontend. Data is written to and read from the real-time database.
- [analyze data](functions/analyzedata.js)
- [upload data](functions/dataupload.js)
- [request available data](functions/availabledata.js)

## Used technologies
- react with react-router
- material-ui
- axios
- chart.js
- firebase
  - realtime database
  - cloud functions
  - hosting