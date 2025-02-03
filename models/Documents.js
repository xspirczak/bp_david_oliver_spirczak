import mongoose from 'mongoose';

// Define the schema for your 'documents' collection
const DocumentSchema = new mongoose.Schema({
    document: {
        type: String,
        required: true,  // Make this field required if necessary
    },
});

// Create and export the model
const Document = mongoose.model('Document', DocumentSchema);
export default Document;