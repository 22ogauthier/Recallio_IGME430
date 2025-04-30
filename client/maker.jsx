const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const db = require('mongoose');

const handleFlashcard = (e, onFlashcardAdded) => {
    e.preventDefault();
    helper.hideError();

    const front = e.target.querySelector('#flashcardFront').value;
    const back = e.target.querySelector('#flashcardBack').value;

    if (!front || !back) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { front, back }, onFlashcardAdded);
    return false;
}

const FlashcardForm = (props) => {
    return (
        <div>
            <div className="flashcard-modal">
                <h4 className="flashcardTitle">Add a Flashcard</h4>
                <form id="flashcardForm"
                    name="flashcardForm"
                    onSubmit={(e) => handleFlashcard(e, props.triggerReload)}
                    action="/maker"
                    method="POST"
                    className="mainForm"
                >
                    <div className="text_area">
                        <input
                            type="text"
                            id="flashcardFront"
                            name="flashcardFront"
                            className="text_input"
                        />
                    </div>
                    <div className="text_area">
                        <input
                            type="text"
                            id="flashcardBack"
                            name="flashcardBack"
                            className="text_input">
                        </input>
                    </div>
                    <input
                        type="submit"
                        value="Make Flashcard"
                        className={"btn formSubmit"}
                    />
                </form>
            </div>
        </div>
    );
};

const FlashcardList = (props) => {
    const { flashcards, setFlashcards, reloadFlashcards, triggerReload } = props;
    const [flippedId, setFlippedId] = useState(null);

    const handleDeleteFlashcard = async (flashcardId) => {
        const response = await fetch('/deleteFlashcard', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: flashcardId }),
        });

        const result = await response.json();

        if (result.message === 'Flashcard deleted!') {
            console.log('Flashcard deleted!');
            props.triggerReload();
        } else {
            console.error('Failure to delete');
        }
    }

    useEffect(() => {
        const loadFlashcardsFromServer = async () => {
            const response = await fetch('/getFlashcards');
            const data = await response.json();
            setFlashcards(data.flashcards);
        };
        loadFlashcardsFromServer();
    }, [reloadFlashcards]);

    if (flashcards.length === 0) {
        return (
            <div className="flashcardList">
                <h3 className="emptyFlashcard">No Flashcards Yet!</h3>
            </div >
        );
    }

    /*https://nabendu82.medium.com/build-a-flashcard-quiz-with-react-c1cb96e3a1e8*/
    const flashcardNodes = flashcards.map(flashcard => {
        const isFlipped = flippedId === flashcard._id;
        return (
            <div key={flashcard.id} className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                onClick={() => setFlippedId(isFlipped ? null : flashcard._id)}>

                <div className="front">
                    <h3 className="flashcardFront"> {flashcard.front}</h3>
                    <button className="deleteButton" onClick={(e) => {
                        console.log("delete flashcard with: ", flashcard._id);
                        e.stopPropagation();
                        handleDeleteFlashcard(flashcard._id);
                    }}>
                        <img src="/assets/img/trash-solid.svg" alt="Delete"></img>
                    </button>
                </div>

                <div className="back">
                    <h3 className="flashcardBack"> {flashcard.back}</h3>
                </div>
            </div>

        );
    });

    return (
        <div className="flashcardList">
            {flashcardNodes}
        </div>
    );
};

const Stats = ({flashcards, isPremium, onTogglePremium}) => {
    return (
        <div>
            <div className="flashcard-modal">
                <h4 className="flashcardTitle">Stats</h4>
                <div id="stats-content">
                    <p><b>Number of cards in deck:</b> {flashcards.length}</p>
                    <h5>Want to unlock more features?</h5>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={isPremium}
                            onChange={onTogglePremium}
                        />
                        <span className="slider round"></span>
                    </label>
                    {isPremium && (
                        <>
                        <p><b>Estimated study time:</b> {flashcards.length * 0.5} min</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const App = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [isPremium, setIsPremium] = useState(false);
    const [reloadFlashcards, setReloadFlashcards] = useState(false);

    return (
        <div id="makerPage">
            <div id="makeFlashcard">
                <FlashcardForm triggerReload={() => setReloadFlashcards(!reloadFlashcards)} />
            </div>
            <div id="flashcards">
                <FlashcardList flashcards={flashcards} setFlashcards={setFlashcards} reloadFlashcards={reloadFlashcards} triggerReload={() => setReloadFlashcards(!reloadFlashcards)} />
            </div>
            <div id="displayStats">
                <Stats flashcards={flashcards} isPremium={isPremium} onTogglePremium={() => setIsPremium(prev => !prev)}></Stats>
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;