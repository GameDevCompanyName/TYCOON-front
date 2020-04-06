import {useState} from "react";
import {useEffect} from "react";
import * as React from "react";
import "./login-form.css";
import {Config} from "../../common/config";
import {http} from "../../common/http";
import contentOfPostRequest = http.contentOfPostRequest;
import relativeHost = Config.relativeHost;

const LoginForm = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        if (username.trim().length == 0 || password.trim().length == 0) {
            setIsButtonDisabled(true);
        } else {
            setIsButtonDisabled(false);
        }
    }, [username, password]);

    function sendLoginRequest() {
        let data: FormData = new FormData();
        data.append("username", username);
        data.append("password", password);
        contentOfPostRequest("/login", data, true, handleLoginResponse);
    }

    function handleLoginResponse(response: any) {
        let parsedResponse = JSON.parse(response);
        switch (parsedResponse.status) {
            case 300:
                alert("Пользователь уже зарегистрирован");
                break;
            case 200:
                window.location.href = (relativeHost + "/");
                break;
            case 400:
                alert("Ошибка");
        }
    }

    return (
        <div className="login-form__form-wrapper common-styles__default-container">
            <h1>Войти</h1>
            <input
                className="login-form__form__username
                                login-form__input
                                common-styles__input"
                name="username"
                id="username"
                placeholder="Имя"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="login-form__form__password
                                login-form__input
                                common-styles__input"
                name="password"
                type="password"
                id="password"
                placeholder="Пароль"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                className="login-form__form__submit
                                login-form__button
                                common-styles__button
                                common-styles__submit"
                onClick={sendLoginRequest}
                disabled={isButtonDisabled}
            ><span>Войти</span></button>
        </div>
    );

};

export default LoginForm;
