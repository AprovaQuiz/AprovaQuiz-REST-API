import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    pertence: {
        type: String,
        required: [true, "É necessário informar o que a matéria pertence"]
    },
    nome: {
        type: String,
        required: [true, "É necessário o nome da matéria"]
    },
    image: {
        type: mongoose.Types.ObjectId,
        ref: 'Image'
    }
}, { timestamps: true })

export const Subject = mongoose.model('Subject', schema)