import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    pertence: {
        type: String,
        enum: [
            "Ciências da Natureza", "Ciências Humanas",
            "Matemática", "Linguagens"
        ],
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

export const Matter = mongoose.model('Matter', schema)