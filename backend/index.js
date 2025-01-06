require('dotenv').config();
const express = require('express');

// const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');


var admin = require('firebase-admin');

var serviceAccount = {
  'type': 'service_account',
  'project_id': process.env.FIREBASE_PROJECT_ID,
  'private_key_id': process.env.FIREBASE_PRIVATE_KEY_ID,
  'private_key': process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  'client_email': process.env.FIREBASE_CLIENT_EMAIL,
  'client_id': process.env.FIREBASE_CLIENT_ID,
  'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
  'token_uri': 'https://oauth2.googleapis.com/token',
  'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
  'client_x509_cert_url': `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
   'universe_domain': 'googleapis.com',
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/send-Notification', async (req, res) => {
    console.log('Received request:', req.body);
    const { payload, token } = req.body;
    const message = {
        notification: {
            title: payload.text, // Extract title and body
            body: `${payload.user.name}`,
        },
        token,
    };
   try {
    const response =   await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    res.status(200).send('Successfully sent message');
   } catch (error) {
     console.log('Error sending message:', error);
     res.send('Error sending message', error);

   }
}
);


app.listen(3000, () => {
    console.log('Server started! on port 3000');
    }
);
