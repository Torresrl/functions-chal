const admin = require('firebase-admin');
const functions = require('firebase-functions');
const serviceAccount = require('./service_account.json');
const uploadImage = require('./uploadImage');
const challengeDone = require('./challengeDone');
const updateChallenge = require('./updateChallenge');
const express = require('express');


 // Create and Deploy Your First Cloud Functions
 // https://firebase.google.com/docs/functions/write-firebase-functions


//forklare express
//https://codeburst.io/express-js-on-cloud-functions-for-firebase-86ed26f9144c
//du må ha slah på slutten når du kaller en express funksjon

//forklare bilde upload
//https://medium.com/@wcandillon/uploading-images-to-firebase-with-expo-a913c9f8e98d


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://challenges-840a4.firebaseio.com",
    storageBucket: "gs://challenges-840a4.appspot.com"
});



/* Express */


exports.chal_done_api = functions.database
    .ref('/challenges/{challengesId}/challenges/{challengeId}/timeline')
    .onCreate(challengeDone.handler);


module.exports.upload_image_api = functions.https.onRequest(uploadImage);
exports.update_chal_api = functions.https.onRequest(updateChallenge);


