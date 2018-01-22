# HLS Devices - Analog8
Setup instructions for the HSL Analog8 Board.

## Setup

1. Connect via UART with username `pi` and password `raspberry`.
2. Change default password from `raspberry` to whatever you want. This can be done using `sudo raspi-config` and pressing enter or running `passwd`.
3. Change host name from `hls-device-analog-8-unknown` to whatever you want. This can be done by running `sudo su && echo "hls-device-analog-8-a" > /etc/hostname` echoing your desired hostname.
4. (optional) Enable SSH either through `raspi-config` or running `sudo systemctl enable ssh.socket`.
5. Reboot to see changes. (`sudo reboot`)
6. Get latest setup script `cd /home/pi/hls-devices-analog-8/ && git pull`.
7. Run setup script `cd /home/pi/hls-devices-analog-8/ && bash setup.sh` and answer prompts.
8. Edit `config.json` file to capture channel data at specific data rates.
9. Reboot to see changes. (`sudo reboot`)
10. Process data in node red by going to `{hostname}.local:1880` and creating conversion function nodes and MQTT nodes.

Model: Analog8
Rev: 3.0
Unit: ______________
Date: ______________
