let admin = require("firebase-admin");
let { proofOfWork } = require('./minnnigAlgo');
let serviceAccount = require("./blockchain-banking.json");
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URL
});

let db = admin.database();
let ref = db.ref("/transactions");

ref.on("child_added", function(snapshot) {
  console.info("New Transaction Added.");
  let data = snapshot.key;   //Data is in JSON format.
  let keyRef = db.ref('/transactions/'+data);
  keyRef.once('value', function(snap){
    // console.log(snap.val());
    let hash = snap.val().hash;
    console.info("Calculating Nonce...");
    let nonce = proofOfWork(hash);
    // console.log(nonce);
    keyRef.child('nonce').push(nonce);
    console.info("Nonce Added.");
  });
});