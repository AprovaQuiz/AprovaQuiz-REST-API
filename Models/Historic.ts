import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    questoesFeitas: [{
        questao: {
            type: mongoose.Types.ObjectId,
            ref: 'Question'
        },
        respRegistrada: {
            type: Number,
            maxLenght: 1
        },
        acerto: Boolean,
    }],
    qtdDeAcertos: Number,
    qtdDeErros: Number,
    // se for null, sera intrepetado como Geral
    tipoSimulado: {
        materia: {
            type: mongoose.Types.ObjectId,
            ref: 'Subject'
        },
        assunto: {
            type: mongoose.Types.ObjectId,
            ref: 'Topic'
        }
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "Usuário necessário"]
    },
    tempoTotal: Number,

}, { timestamps: true })

export const Historic = mongoose.model('Historic', schema)
