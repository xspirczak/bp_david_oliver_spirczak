import mongoose from "mongoose";

const KeySchema = new mongoose.Schema({
    key: {
        type: Map,
        of: [Number],
        required: true
    },
    name: { type: String },
    description: { type: String },
    country: { type: String },
    language: { type: String },
    source: { type: String },
    author: { type: String },
    year: { type: Number},
    createdAt: {type: Date, default: new Date},
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
});

const Key = mongoose.model("Key", KeySchema);
export default Key;