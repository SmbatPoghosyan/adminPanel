## LED Admin API

An application used to create new branches and playlists for multiple LED screens, built with Node.js, Express.js, MongoDB, JavaScript.

## Installation and Setup Instructions

You will need `node` and `npm` installed globally on your machine.  

###Database Setup (Linux)

1. Download and install MongoDB http://www.mongodb.org/downloads
2. Start the MongoDb service sudo service mongodb restart

###Database Setup (Windows)

1. Download and install MongoDB http://www.mongodb.org/downloads
2. Create the following folder C:\data\db
3. If MongoDb has not been installed as a service run the MonogoDB demon mongod.exe

###Installation:

`npm install`  

###Create environment:

Open .env file and change environment variables to your settings.

#### Example:
MONGODB_URI= mongodb://localhost:27017/led
SUPERADMIN_TOKEN=123123123

###Entry file:
server/public/server.js 
