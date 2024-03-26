import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    materia: {
        type: mongoose.Types.ObjectId,
        ref: 'Subject'
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

export const Topic = mongoose.model('Topic', schema)