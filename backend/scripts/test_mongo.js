console.log("TEST START");
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test';
// Mask password for safety in logs
const safeUri = uri.replace(/:([^:@]+)@/, ':****@');
console.log("ATTEMPTING TO CONNECT TO:", safeUri);

mongoose.connect(uri)
  .then(() => { 
      console.log("✅ CONNECTED SUCCESSFULLY"); 
      process.exit(0); 
  })
  .catch(e => { 
      console.error("❌ CONNECTION FAILED:", e); 
      process.exit(1); 
  });
