import mongoose from 'mongoose';

// Define the schema for your 'keys' collection
const KeySchema = new mongoose.Schema({
   key: [
    {
      // The key itself will be of type String, and the value is an array of strings
      keyName: { type: String, required: true },
      values: { type: [String], required: true }
    },
  ],
});

// Create and export the model
const Key = mongoose.model('Key', KeySchema);
export default Key;