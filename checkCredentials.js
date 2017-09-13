var crypto = require("crypto");
var fs = require("fs")

var getNodeREDSecurityKey = require("./basics.js").getNodeREDSecurityKey
var updateFlowFile = require("./basics.js").updateFlowFile

function decryptNodeRED() {
    var key = getNodeREDSecurityKey();
    var data = JSON.parse(fs.readFileSync(process.env.NODE_RED_CRED_FILE, 'utf8'));    
    var encryptedCredentials = data["$"];
    var encryptionAlgorithm = "aes-256-ctr";
    var encryptionKey = crypto.createHash('sha256').update(key).digest();
    var initVector = new Buffer(encryptedCredentials.substring(0, 32),'hex');
    encryptedCredentials = encryptedCredentials.substring(32);
    var decipher = crypto.createDecipheriv(encryptionAlgorithm, encryptionKey, initVector);
    var decrypted = decipher.update(encryptedCredentials, 'base64', 'utf8') + decipher.final('utf8');
    return JSON.parse(decrypted)
}

//console.log(JSON.stringify(decryptNodeRED()));

//console.log(updateFlowFile('heatworks', 'analog8/unknown2'));