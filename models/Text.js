import mongoose from 'mongoose';

const TextSchema = new mongoose.Schema({
    document: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    language: {
        type: String,
    },
    source: {type: String},
    author: {type: String},
    country: {
        type: String,
    },
    year: {
        type: Number,
    },
    createdAt: {type: Date, default: new Date},
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
});

const Text = mongoose.model('Text', TextSchema);
export default Text;