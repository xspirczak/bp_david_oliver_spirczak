import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
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

const Document = mongoose.model('Document', DocumentSchema);
export default Document;