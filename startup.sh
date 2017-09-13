#!/bin/bash
export PATH=$PATH:/home/pi/.nvm/versions/node/v7.2.1/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/games:/usr/games
echo "Cron tab @reboot starting up..."
sudo chown root.gpio /dev/gpiomem
echo "Set /dev/gpiomem group owner."
sudo chmod g+rw /dev/gpiomem
echo "Set /dev/piomem permissions."
node-red >> /var/log/node-red.log &
echo "Started node red."