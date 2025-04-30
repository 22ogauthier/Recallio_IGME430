const models = require('../models');
const Flashcard = models.Flashcard;

const makerPage = (req, res) => {
    return res.render('app');
};

const pageNotFound = (req, res) => {
    return res.status(404).render('404');
};

const getFlashcards = async (req, res) => {
    console.log("getFlashcards called!");
    try {
        const query = { owner: req.session.account._id };
        const docs = await Flashcard.find(query).select('front back').lean().exec();

        return res.json({ flashcards: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving flashcards!' });
    }
};

const makeFlashcard = async (req, res) => {
    if (!req.body.front || !req.body.back) {
        return res.status(400).json({ error: 'Front and back are required!' });
    }

    const flashcardData = {
        front: req.body.front,
        back: req.body.back,
        owner: req.session.account._id,
    };

    try {
        const newFlashcard = new Flashcard(flashcardData);
        await newFlashcard.save();
        return res.status(201).json({ front: newFlashcard.front, back: newFlashcard.back });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Flashcard already exists!' });
        }
        return res.status(500).json({ error: 'An error occured making flashcard!' });
    }
}

const deleteFlashcard = async (req, res) => {
    try {
        const { id } = req.body;
        console.log('ID received from client:', req.body.id);
        const result = await Flashcard.deleteOne({ _id: id, owner: req.session.account._id });

        console.log(result);
        console.log(result.deletedCount);
        if (result.deletedCount === 1) {
            return res.status(200).json({ message: 'Flashcard deleted!' });
        } else {
            return res.status(404).json({ message: 'Flashcard not found' });
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    makerPage,
    makeFlashcard,
    getFlashcards,
    deleteFlashcard,
    pageNotFound,
};