import mongoose from 'mongoose';

const schema = new mongoose.Schema({

    enunciado: {
        type: String,
        required: [true, "Precisa do texto informativo da questão"]
    },
    pergunta: {
        type: String,
        required: [true, "Precisa da Pergunta do texto"]
    },
    alternativas: {
        type: [{
            textoAlt: String,
        }],
        validate: {
            validator: (v: []) => {
                return v.length <= 5
            },
            message: "Passou o limite de 5 alternativas"
        },
        required: [true, "Precisa das alternativas"]
    },
    lugarAno: String,
    alternativaCorreta: {
        type: Number,
        required: [true, "Precisa da Alternatica Correta"],
        maxLenght: 1
    },
    image: {
        type: mongoose.Types.ObjectId,
        ref: 'Image'
    }
},
    { timestamps: true })

export const Question = mongoose.model('Question', schema)
