# Voice Activated Dog Feeder

Created by Sophy, Yan Lin, Dorothy, Cindy & Arnav at the Mobility Dogs Hackathon.

Consists of 2 parts:

1. Voice activator web app `/web-app`
   When someone says the trigger phrase (e.g. 'Good job'), a message will be sent via bluetooth to the treat releaser.
2. Treat releaser `/treat-releaser`
   Made with a raspberry pi pico w that recieves the bluetooth message and triggers a servo that pushes a dog treat from a storage column onto the tray below for consumption 🐶😀
