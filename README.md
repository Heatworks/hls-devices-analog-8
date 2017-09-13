# HLS Devices - Analog8
Code and setup instructions for the HSL Analog8 Board.

## Base Image
The following are the instructions for creating the base image for the Analog8 board, using a copy of this image will contain all the following edits. Begin with the default raspbian lite image.

- Ethernet: Add `dtoverlay=enc28j60,int_pin=25,speed=12000000` to `/boot/config.txt` as per [this](http://raspi.tv/2015/ethernet-on-pi-zero-how-to-put-an-ethernet-port-on-your-pi) tutorial. 
- Set Hostname to `hls-device-analog-8-unknown`.
- Enable `serial` (USART) hardware.

General updates, node, and npm.

```
sudo apt-get update
sudo apt-get install node npm git

sudo npm cache clean -f
sudo npm install -g n
sudo n 6.* 
sudo npm install -g node-red

```

### Node-Red

Edit `~/.node-red/settings.js` and change the `flowFile` option to `flows_default.json`.

Begin by running node red, this generates the flow files. Copy the new flows from this file.

### Add Code for Maxim MAX1270

```bash
cd ~/.node-red
sudo npm install @heatworks/node-red-contrib-maxim-max1270

cd ~/
sudo apt-get install python-dev
mkdir python-spi
cd python-spi
wget https://raw.github.com/doceme/py-spidev/master/setup.py
wget https://raw.github.com/doceme/py-spidev/master/spidev_module.c
wget https://raw.github.com/doceme/py-spidev/master/README.md
wget https://raw.github.com/doceme/py-spidev/master/CHANGELOG.md
sudo python setup.py install
```

Optional add some sample code into the node red flow.

```js
// Parse out the output code from the ADC
var parts = msg.payload.split(",")
parts.splice(1,1)
var outputCode = parts[1];

// Convert ADC value to mA
var ADC12BitRange = 4096;
var ADCVoltage = 5000;
var ADCResistorValue = 220;
var mV = outputCode * (ADCVoltage / ADC12BitRange )
var mA = (mV / ADCResistorValue);

// Convert mA to desired range.
var mARange = [4.0, 20.0];
var range = [0.0, 120.0]
var m = (range[1] - range[0]) / (mARange[1] - mARange[0]);
var b = range[0] - m*mARange[0];
var y = m*mA + b;

// Round value to 2 decimal places.
parts[1] = Math.round(y*100)/100;

// Join timestamp back with converted value.
msg.payload = parts.join(",")
return msg;
```

### Add this Repo

Clone this repo and setup environment variables in `/home/pi/profile`.

```
export NODE_RED_CRED_FILE=/home/pi/.node-red/flows_default_cred.json
export NODE_RED_FLOW_FILE=/home/pi/.node-red/flows_default.json
export NODE_RED_SETTINGS_FILE=/home/pi/.node-red/settings.js
```

### CronTab

Open crontab `crontab -e` and add this line `@reboot bash /home/pi/hls-devices-analog-8/startup.sh > /home/pi/startup.log 2>&1`.

### Create Log File

```
sudo touch node-red.log
sudo chown pi:pi /var/log/node-red.log 
```

## Setup

1. Connect via UART with username `pi` and password `raspberry`.
2. Change default password from `raspberry` to whatever you want. This can be done using `sudo raspi-config` and pressing enter.
3. Change host name from `hls-device-analog-8-unknown` to whatever you want. This can be done by running `sudo su && echo "hls-device-analog-8-a" > /etc/hostname` echoing your desired hostname.
4. (optional) Enable SSH either through `raspi-config` or running `systemctl enable ssh.socket`.
5. Reboot to see changes. (`reboot`)
6. Get latest setup script `cd /home/pi/hls-devices-analog-8/ && git pull`.
7. Run setup script `cd /home/pi/hls-devices-analog-8/ && bash setup.sh` and answer prompts.
8. Reboot to see changes. (`reboot`)

## Future

- Don't use default password. Consider using raspberry pi's default which leaves a reminder to change it each time one signs in.
- Include password and host name changes in the prompt setup script.
- Run setup through UART.