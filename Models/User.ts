import mongoose from 'mongoose';


const schema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, "Usuário sem nome"]
    },
    userName: {
        type: String,
        required: [true, "Usuário sem username"],
        unique: true,
    },
    dataNasc: {
        type: Date,
        required: [true, "Sem data de nascimento"]
    },
    numCelular: {
        type: String,
        required: [true, "Sem Número de Celular"]
    },
    email: {
        type: String,
        validate: {
            validator: (v: string) => {
                return /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)+$/.test(v)
            },
            message: "Email inválido"
        },
        unique: true,
        required: [true, "Usuário sem Email"]
    },
    senha: {
        type: String,
        required: [true, "Usuário sem senha"]
    },
    role: {
        type: String,
        enum: ["normal", "admin"],
        required: [true, "Informe a role"]
    },
    image: {
        type: mongoose.Types.ObjectId,
        ref: 'Image'
    }
},
    {
        timestamps: true
    }
)

export const User = mongoose.model('User', schema)