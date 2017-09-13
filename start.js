var randomstring = require("randomstring");

console.log(`Using credential file: ${process.env.NODE_RED_CRED_FILE}`);
console.log(`Using flow file: ${process.env.NODE_RED_FLOW_FILE}`);
console.log(`Using settings file: ${process.env.NODE_RED_SETTINGS_FILE}`);

// Neccessary environment variables:
if (!("NODE_RED_CRED_FILE" in process.env)) {
    throw new Error("Credential file (NODE_RED_CRED_FILE) must be set in the environment variables.");
}
if (!("NODE_RED_FLOW_FILE" in process.env)) {
    throw new Error("Flow file (NODE_RED_FLOW_FILE) must be set in the environment variables.");
}
if (!("NODE_RED_SETTINGS_FILE" in process.env)) {
    throw new Error("Settings file (NODE_RED_SETTINGS_FILE) must be set in the environment variables.");
}

var prompt = require('prompt');

prompt.message = "hls";
prompt.start();

var schema = {
    properties: {
      organization: {
        pattern: /^[a-zA-Z\-0-9]+$/,
        message: 'Name must be only letters, numbers, or dashes',
        required: true,
        description: 'Enter the name of your organization as used on HLS',
        default: 'hls'
      },
      deviceName: {
        pattern: /^[a-zA-Z\-0-9\/]+$/,
        message: 'Name must be only letters, numbers, dashes, or slashes',
        description: 'Enter a name for the device (i.e. "analog8/B", "analog8/Station1")', 
        default: 'analog8/unknown',       
        required: true
      },
      accessToken: {
        description: 'Enter Access Token for the device',                
        hidden: true
      }
    }
  };


prompt.get(schema, function (err, result) {
    
    var organization = result.organization// "heatworks"
    var deviceName = result.deviceName // "analog8/unknown"
    var accessToken = result.accessToken // "defaultAccessToken"

    var setNodeREDSecurityKey = require("./basics.js").setNodeREDSecurityKey;
    var encryptNodeRED = require("./basics.js").encryptNodeRED;
    var updateFlowFile = require("./basics.js").updateFlowFile;
    
    var randomUserKey = randomstring.generate();
    
    setNodeREDSecurityKey(randomUserKey);
    
    encryptNodeRED(randomUserKey, { 'd88144d2.de1c88': { user: 'HLS:AccessToken', password: accessToken } } )
    
    updateFlowFile(organization, deviceName)
});


