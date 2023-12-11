const admin = require("firebase-admin");
const FIREBASE_STORAGE_BUCKET = "dating-luiforelle-66a8b.appspot.com"; // replace with your bucket name
const FIREBASE_DATABASE_URL =
  "https://dating-luiforelle-66a8b-default-rtdb.firebaseio.com"; // replace with your database URL
const firebaseKey = require("./metisse-key.json");


if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseKey),
      storageBucket: FIREBASE_STORAGE_BUCKET,
      databaseURL: FIREBASE_DATABASE_URL,
    });
  } catch (error) {
    console.log("Firebase admin initialization error", error.stack);
  }
}
module.exports = {
  admin,
  FIREBASE_STORAGE_BUCKET
};
