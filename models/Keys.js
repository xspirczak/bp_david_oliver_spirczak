import mongoose from 'mongoose';

// Define the schema for your 'keys' collection
const KeySchema = new mongoose.Schema({
  key: { type: String, required: true },   // 'key' field is a string
  values: { type: [String], required: true }  // 'values' field is an array of strings
});

// Create and export the model
const Key = mongoose.model('Key', KeySchema);
export default Key;