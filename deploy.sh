#!/bin/sh
cd ~/phaser-game
git reset --hard
git clean -xdf
git pull
npm install
gulp build
node server.js
