import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: false }, // required: False nastavené kvôli OAuth 2 Google prihlaseniu, kde sa používateľ nemusí mať zadané priezvisko
    email: { type: String, required: true, unique: true },
    password: { type: String},
    role: { type: String, required: true, default: 'user' },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
});

UserSchema.pre('save', async function (next) {
    if (this.provider !== 'local' || !this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export default mongoose.model('User', UserSchema);
