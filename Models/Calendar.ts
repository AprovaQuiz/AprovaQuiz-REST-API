import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    data: {
        type: Date,
        required: [true, "Data necessária"]
    },
    periodo: String,
    linkReferencia: String
}, { timestamps: true })

export const Calendar = mongoose.model('Calendar', schema)
