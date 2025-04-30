const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const FlashcardSchema = new mongoose.Schema({
    front: {
        type: String,
        required: true,
        trim: true, 
        set: setName,
    },
    back: {
        type: String,
        required: true,
        trim: true, 
        set: setName,
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

FlashcardSchema.statics.toAPI = (doc) => ({
    front: doc.front,
    back: doc.back,
});

const FlashcardModel = mongoose.model('Flashcard', FlashcardSchema);
module.exports = FlashcardModel;