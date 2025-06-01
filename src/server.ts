import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

// Load environment variables
dotenv.config();

// Read environment variables
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Start server after successful DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
});
