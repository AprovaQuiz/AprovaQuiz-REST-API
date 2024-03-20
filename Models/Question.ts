import mongoose from 'mongoose';

const schema = new mongoose.Schema({

    texto: {
        type: String,
        required: [true, "Precisa do texto informativo da questão"]
    },
    alternativas: {
        type: [{
            textoAlt: String,
            letra: {
                type: String,
                maxLenght: 1
            },
        }],
        validate: {
            validator: (v: []) => {
                return v.length <= 5
            },
            message: "Passou o limite de 5 questões"
        },
        required: [true, "Precisa das alternativas"]
    },
    alternativaCorreta: {
        type: String,
        required: [true, "Precisa da Alternatica Correta"],
        maxLenght: 1
    }
},
    { timestamps: true })

export const Question = mongoose.model('Question', schema)