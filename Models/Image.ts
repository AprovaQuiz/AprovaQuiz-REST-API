import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Precisa do nome"]
    },
    img:
    {
        data: {
            type: Buffer,
            required: [true, "Precisa da DataBuffer"]
        },
        contentType: {
            type: String,
            required: [true, "Precisa do tipo de arquivo"]
        },

    }

}, { timestamps: true })

export const Image = mongoose.model('Image', schema)