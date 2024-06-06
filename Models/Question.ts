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
            // talvez faça mais sentido pegar pelo index, mas vou deixar por enquanto
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
        type: String,
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
