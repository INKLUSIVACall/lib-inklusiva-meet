#!/bin/bash

source ~/.zshrc

nvm use v16
npm run build
cd ../jitsi-meet
make deploy-lib-jitsi-meet
