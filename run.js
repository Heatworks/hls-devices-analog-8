'use strict';

const { spawnSync } = require( 'child_process' );

var config = require('./config.json');

function readADCChannel(channel) {
    var response = spawnSync( 'spi_read/read', [ config.spi.CLK, config.spi.MISO, config.spi.MOSI, config.spi.CS, channel ] );
    var responseString = response.stdout.toString();
    //var elements = responseString.split(",");
    console.log(responseString);
}

var channels = [];

function cycle(delay) {
    for (const index in channels) {
        if (channels[index].timeout <= 0) {
            readADCChannel(channels[index].channel);
            channels[index].timeout = channels[index].datarate;
        } else {
            channels[index].timeout -= delay;
        }
    }
    setTimeout(() => {
        cycle(delay);
    }, delay)
}

for (var index in config.channels) {
    var channel = config.channels[index];
    channel.timeout = 0;
    channels.push(channel);
}

cycle(100);