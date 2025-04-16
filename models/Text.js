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
    country: {
        type: String,
    },
    year: {
        type: Number,
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
});

const Text = mongoose.model('Text', TextSchema);
export default Text;