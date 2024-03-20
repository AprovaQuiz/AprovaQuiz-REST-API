import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    pertence: {
        type: mongoose.Types.ObjectId,
        ref: 'Matter'
    },
    nome: {
        type: String,
        required: [true, "É necessário o nome do assunto"]
    },
    questions: [{
        type: mongoose.Types.ObjectId,
        ref: 'Question'
    }],
    image: {
        type: mongoose.Types.ObjectId,
        ref: 'Image'
    }
}, { timestamps: true })

export const Subject = mongoose.model('Subject', schema)