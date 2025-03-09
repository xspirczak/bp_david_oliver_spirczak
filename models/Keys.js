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
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
});

const Key = mongoose.model("Key", KeySchema);
export default Key;