
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

exports.chatReceivedFromBuyerListener = functions
    .region('asia-east2')
    .firestore
    .document('chats/{chat}')
    .onUpdate((snap, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const message = snap.after.data();
        const newMessage = message.latestMessage;
        const user = message.senderName;
        const time = message.timeStamp;
        const receiver = message.receiverId;
        //const order = context.params.order;

       
        // access a particular field as you would any JS property
        //const name = newValue.orderAmount;
        console.log('Push notification event triggered for topic  ' + receiver + "   " + newMessage);
        var registrationToken = 'YOUR_REGISTRATION_TOKEN';
        
        // Create a notification
        const payload = {            
            "data": {
                title: user,
                message: newMessage,
                time: time,
                notificationType: "chat"
                //"image": "https://i.postimg.cc/XqNSCWK2/qwiklytemplogo.png"
                //location: newValue.currentLocation.map("mapAddress")
            },
            "notification": {
                "body": newMessage,
                "title": "New message from " + user + "        " + time
                
                //"image": "https://i.postimg.cc/XqNSCWK2/qwiklytemplogo.png"
                
            },
            android: {
                notification: {
                    sound: 'default',
                    click_action: '.MainActivity',
                    "priority": 'max'
                    
                },
            },
            topic: receiver
        };

        //Create an options object that contains the time to live for the notification and the priority
        const options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };


        return admin.messaging().send(payload);    
        
        });
    