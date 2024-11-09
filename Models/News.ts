import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, "Precisa do título"],
    },
    linkFonte: {
        type: String,
        required: [true, "Sem ser a choquei"]
    },
    linkImagem: String,
    fonte: String,
    resumo: String,
    conteudo: String,
}, { timestamps: true })

export const News = mongoose.model('News', schema)