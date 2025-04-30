const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass });
    return false;
}

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!username || !pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, pass2 });
    return false;
}

//https://medium.com/@kenaszogara/tutorial-create-simple-login-form-with-reactjs-31965ed3ccfa
const LoginWindow = (props) => {
    return (
        <div>
            <img src="/assets/img/big logo.png" alt="flashcard face" className="big-logo" />
            <div className="modal">
                <h4 className="loginTitle">Login</h4>
                <form id="loginForm"
                    name="loginForm"
                    onSubmit={handleLogin}
                    action="/login"
                    method="POST"
                    className="mainForm"
                >
                    <div className="text_area">
                        <input
                            type="text"
                            id="user"
                            name="user"
                            placeholder="Username"
                            className="text_input"
                        />
                    </div>
                    <div className="text_area">
                        <input
                            type="text"
                            id="pass"
                            name="pass"
                            placeholder="Password"
                            className="text_input">
                        </input>
                    </div>
                    <input
                        type="submit"
                        value="LOG IN"
                        className={"btn formSubmit"}
                    />
                </form>
            </div>
        </div>
    )
};


const SignUpWindow = (props) => {
    return (
        <div>
            <img src="/assets/img/big logo.png" alt="flashcard face" className="big-logo" />
            <div className="modal">
                <h4 className="loginTitle">Sign Up</h4>
                <form id="signUpForm"
                    name="signUpForm"
                    onSubmit={handleSignup}
                    action="/signUp"
                    method="POST"
                    className="mainForm"
                >
                    <div className="text_area">
                        <input
                            type="text"
                            id="user"
                            name="user"
                            placeholder="Username"
                            className="text_input"
                        />
                    </div>
                    <div className="text_area">
                        <input
                            type="text"
                            id="pass"
                            name="pass"
                            placeholder="Password"
                            className="text_input">
                        </input>
                    </div>
                    <div className="text_area">
                        <input
                            type="text"
                            id="pass2"
                            name="pass2"
                            placeholder="Password"
                            className="text_input">
                        </input>
                    </div>
                    <input
                        type="submit"
                        value="SIGN UP"
                        className={"btn formSubmit"}
                    />
                </form>
            </div>
        </div>
    )
};

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<LoginWindow />);
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<SignUpWindow />);
        return false;
    });

    root.render(<LoginWindow />);
}

window.onload = init;