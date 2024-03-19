import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "Usuário necessário"]
    },
    number: {
        type: Number,
        maxLength: 4,
    }
}, { timestamps: true })

export const PassRecover = mongoose.model('PassRecover', schema)