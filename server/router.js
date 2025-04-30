const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/getFlashcards', mid.requiresLogin, controllers.Flashcard.getFlashcards);

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/maker', mid.requiresLogin, controllers.Flashcard.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Flashcard.makeFlashcard);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

    app.post('/deleteFlashcard', mid.requiresLogin, controllers.Flashcard.deleteFlashcard);

    app.get('/*', controllers.Flashcard.pageNotFound);
};

module.exports = router;

