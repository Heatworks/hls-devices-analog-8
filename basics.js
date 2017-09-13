var crypto = require("crypto");
var fs = require("fs")

module.exports = {
    encryptNodeRED: function (key, credentials) {
        var encryptionAlgorithm = "aes-256-ctr";   
        var encryptionKey = crypto.createHash('sha256').update(key).digest(); 
        var initVector = crypto.randomBytes(16);
        var cipher = crypto.createCipheriv(encryptionAlgorithm, encryptionKey, initVector);
        result = {"$":initVector.toString('hex') + cipher.update(JSON.stringify(credentials), 'utf8', 'base64') + cipher.final('base64')};
        fs.writeFileSync(process.env.NODE_RED_CRED_FILE, JSON.stringify(result), 'utf-8');
        return result;
    },
    getNodeREDSecurityKey: function() {
        // Note this will only work once and will not get updated values.
        // This delete attempts to clear the cache each time but I do not believe it is working.
        delete require.cache[require.resolve(process.env.NODE_RED_SETTINGS_FILE)]
        var settings = require(process.env.NODE_RED_SETTINGS_FILE);
        if ("credentialSecret" in settings) {
            return settings["credentialSecret"];
        } else {
            return "";
        }
    },
    setNodeREDSecurityKey: function(key) {
        var data = fs.readFileSync(process.env.NODE_RED_SETTINGS_FILE, 'utf-8');
        var newValue = data.replace(/^    credentialSecret.*\n?/gim, `    credentialSecret: "${key}",\n`);    
        newValue = newValue.replace(/^    \/\/credentialSecret.*\n?/gim, `    credentialSecret: "${key}",\n`);
        fs.writeFileSync(process.env.NODE_RED_SETTINGS_FILE, newValue, 'utf-8');
    },
    updateFlowFile: function(organization, deviceName) {
        var data = fs.readFileSync('flow.json', 'utf-8');
        var newValue = data.replace(/\/organizations\/heatworks\/devices\/analog8\/unknown/gim, `/organizations/${organization}/devices/${deviceName}` ); 
        var newValue = newValue.replace(/\"analog8\/unknown\"/gim, `"${deviceName}"` );                    
        fs.writeFileSync(process.env.NODE_RED_FLOW_FILE, newValue, 'utf-8');
    }
}