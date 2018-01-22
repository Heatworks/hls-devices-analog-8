'use strict';

const { spawnSync } = require( 'child_process' );

var config = require('./config.json');

for (channel in config.channels) {
    var response = spawnSync( 'spi_read/read', [ config.spi.CLK, config.spi.MISO, config.spi.MOSI, config.spi.CS, channel.channel ] );
    console.log( `${ls.stdout.toString()}` );
}

console.log( `stderr: ${ls.stderr.toString()}` );
console.log( `stdout: ${ls.stdout.toString()}` );