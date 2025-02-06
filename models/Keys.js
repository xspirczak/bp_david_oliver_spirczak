/*import mongoose from 'mongoose';

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
export default Key;*/

import mongoose from "mongoose";

const KeySchema = new mongoose.Schema({
    key: {
        type: Map,
        of: [Number], // Each key will have an array of numbers
        required: true
    },
    name: { type: String },
    description: { type: String },
    country: { type: String },
    year: { type: Number},
});

const Key = mongoose.model("Key", KeySchema);
export default Key;