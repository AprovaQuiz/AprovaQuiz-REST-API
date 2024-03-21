import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    questoesFeitas: [{
        questao: {
            type: mongoose.Types.ObjectId,
            ref: 'Question'
        },
        respRegistrada: {
            type: String,
            maxLenght: 1
        },
        acerto: Boolean,
        tempoQuestao: Number,
    }],
    qtdDeAcertos: Number,
    qtdDeErros: Number,
    // se for null, sera intrepetado como Geral
    tipoSimulado: {
        materia: {
            type: mongoose.Types.ObjectId,
            ref: 'Matter'
        },
        assunto: {
            type: mongoose.Types.ObjectId,
            ref: 'Subject'
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