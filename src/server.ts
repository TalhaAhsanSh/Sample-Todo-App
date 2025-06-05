import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';
import path from 'path';
import { sendEmail } from './utils/emailsender'; 


dotenv.config() 

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    app.listen(PORT, async () => { 
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });