import admin from 'firebase-admin'
const firebaseCredentials = process.env.FIREBASE_CREDENTIALS as string;

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(firebaseCredentials)),
      databaseURL: 'https://dshop-ea0bf.firebaseio.com',
    });
  }
  
  export const fcm = admin.messaging();