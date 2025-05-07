const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const EeveeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    level: {
        type: Number,
        min: 0,
        required: true,
    },
    species: {
        type: String,
        required: true,
    },
    evolvesInto: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

EeveeSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    level: doc.level,
    species: doc.species,
    evolvesInto: doc.evolvesInto,
});

const EeveeModel = mongoose.model('Eevee', EeveeSchema);
module.exports = EeveeModel;