const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');


 // const mongoURL= process.env.MONGO_URI_LOCAL //rEPLACE my database with ur db name
// Use the environment variable `MONGO_URI` if provided (recommended),
// otherwise fall back to a local MongoDB instance for development.
// const localURL = 'mongodb://127.0.0.1:27017/node_tutorial';
const mongoURL = process.env.MONGO_URI || localURL;

const connOptions = (uri) => ({
   serverSelectionTimeoutMS: 5000,
});

async function connectWithFallback() {
   try {
      await mongoose.connect(mongoURL, connOptions(mongoURL));
      console.log('MongoDB Connected to DB:', mongoose.connection.name);
   } catch (err) {
      console.error('MongoDB connection error:', err);
      const isSrvDnsError = /querySrv|ECONNREFUSED|ENOTFOUND/.test(err.message || err.code || '');
      if (mongoURL !== localURL && isSrvDnsError) {
         console.log('Detected SRV/DNS error; falling back to local MongoDB at', localURL);
         try {
            await mongoose.connect(localURL, connOptions(localURL));
            console.log('MongoDB Connected to local DB:', mongoose.connection.name);
         } catch (err2) {
            console.error('Fallback connection failed:', err2);
         }
      }
   }
}

connectWithFallback();

const db = mongoose.connection;

// Event listeners for connection state
db.on('connected', () => {
   console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
   console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
   console.log('MongoDB disconnected');
});

module.exports = db;