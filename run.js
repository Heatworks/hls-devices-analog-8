'use strict';

const { spawnSync } = require( 'child_process' );

var config = require('./config.json');

const ls = spawnSync( 'spi_read/read', [ config.spi.CLK, config.spi.MISO, config.spi.MOSI, config.spi.CS ] );

console.log( `stderr: ${ls.stderr.toString()}` );
console.log( `stdout: ${ls.stdout.toString()}` );