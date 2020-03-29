const admin = require("firebase-admin");
const { proofOfWork } = require('./minnnigAlgo');
const serviceAccount = require("./blockchain-banking.json");
let chainData = {};
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URL
});

let db = admin.database();
let ref = db.ref("/transactions");
let broadCastRef = db.ref("/broadcast");

ref.on("child_added", function(snapshot) {
  console.log(chainData);
  
  console.info("New Transaction Added.");
  let data = snapshot.key;   //Data is in JSON format.
  let keyRef = db.ref('/transactions/'+data);
  console.log({ data: data.split('-'), len: data.split('-').length });
  
  if(data.split('-').length == 3){
    keyRef.once('value', function(snap){
      // console.log(snap.val());
      let hash = snap.val().hash;
      console.info("Calculating Nonce...");
      let nonce = proofOfWork(hash);
      // console.log(nonce);
      keyRef.child('nonce').push(nonce);
      console.info("Nonce Added.");
    });
  }else{
    keyRef.once('value', function(snap){
      let encryptedChain = snap.val().encryptedChain;
      let hash = chainData[data.split('-')[0]];
      if(hash){
        keyRef.child('hash').push(hash);
      }else{
        chainData[data.split('-')[0]] = encryptedChain;
        keyRef.child('hash').push(encryptedChain);
      }
      console.log({ encryptedChain, hash, chainData });
      console.info("Chain hash added.");
    })
  }
});

broadCastRef.on("child_added", function(snapshot){
  let broadData = snapshot.key;
  let broadKeyRef = db.ref('broadcast/'+broadData);
  broadKeyRef.once('value', function(snap){
    let chain = snap.val().chain;
    chainData[broadData.split('-')[0]] = chain;
  })
  console.log(chainData);
})

console.log("Minner Started.");