
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

exports.orderCreatedListener = functions
    .region('asia-east2')
    .firestore
    .document('orders/{order}')
    .onCreate((snap, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const newValue = snap.data();

        // access a particular field as you would any JS property
        const name = newValue.orderAmount;
        console.log('Push notification event triggered for topic  ' + newValue.shop);
        var registrationToken = 'YOUR_REGISTRATION_TOKEN';

        // Create a notification
        const payload = {
            "data": {
                title: "QWIKLY New Order: ",
                orderAmount: "Rs." + newValue.orderAmount,
                notificationType: "order"
                //"image": "https://i.postimg.cc/XqNSCWK2/qwiklytemplogo.png"
                //location: newValue.currentLocation.map("mapAddress")
            },
            "notification": {
                "body": "Rs." + newValue.orderAmount,
                "title": "QWIKLY New Order"

                //"image": "https://i.postimg.cc/XqNSCWK2/qwiklytemplogo.png"

            },
            android: {
                notification: {
                    sound: 'default',
                    click_action: '.MainActivity',
                    "priority": 'max'

                },
            },

            topic: newValue.shop
        };

        //Create an options object that contains the time to live for the notification and the priority
        const options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };


        return admin.messaging().send(payload);
    });
