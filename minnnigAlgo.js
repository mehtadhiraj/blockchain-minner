const CryptoJs = require("crypto-js");
const crypto          = require('crypto');

// const stringify = require('json-stable-stringify');

// function hashData(block){
//     return CryptoJs.SHA256(stringify(block)).toString(CryptoJs.enc.Hex);
// }


function isValidProof(last_proof,proof){
    let hash = CryptoJs.SHA256(`${last_proof}${proof}`).toString(CryptoJs.enc.Hex);
    return hash.substr(0,4) == "0000";
}

function proofOfWork(last_proof){
    /**
     * 
     * Simple Proof of Work Algorithm:
     * - Find a number p' such that hash(pp') contains leading 4 zeroes, where p is the previous p'
     * - p is the previous proof, and p' is the new proof
     * @param last_proof :  <int>
     * :return: <int>
    */
    let proof = 0;
    while (!isValidProof(last_proof,proof))
        proof+=1;
    
    return proof;
    
}

function encrypt(nonce, hash){
    // console.log({hash});
    nonce = nonce.toString();
    let key = crypto.createCipher('aes-128-cbc', nonce);
    // hash = JSON.stringify(hash);
    let hashValue = key.update(hash, 'utf8', 'hex');
    hashValue = hashValue + key.final('hex');
    // console.log({hash});
    return hash;
}

module.exports = {
    proofOfWork,
    encrypt
}
