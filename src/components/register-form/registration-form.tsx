import {useState} from "react";
import {useEffect} from "react";
import * as React from "react";
import "./registration-form.css";
import {http} from "../../common/http";
import contentOfPostRequest = http.contentOfPostRequest;
import {Config} from "../../common/config";

const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        if (username.trim().length == 0
            || password.trim().length == 0
            || password !== confPassword
        ) {
            setIsButtonDisabled(true);
        } else {
            setIsButtonDisabled(false);
        }
    }, [username, password, confPassword]);

    function handleRegisterResponse(response: any) {
        let parsedResponse = JSON.parse(response);
        switch (parsedResponse.status) {
            case 300:
                alert("Пользователь уже зарегистрирован");
                break;
            case 200:
                // window.location.replace("/");
                break;
            case 400:
                alert("Ошибка");
        }
    }

    function sendRegisterRequest() {
        let data: FormData = new FormData();
        data.append("username", username);
        data.append("password", password);
        data.append("passwordConfirm", confPassword);
        contentOfPostRequest("/registration", data, true, handleRegisterResponse);
    }

    return (
        <div className="registration-form__form-wrapper common-styles__default-container">
            <h1>Регистрация</h1>
            <input
                className="registration-form__form__username
                                registration-form__input
                                common-styles__input"
                name="userName"
                placeholder="Имя"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="registration-form__form__password
                                registration-form__input
                                common-styles__input"
                name="pass"
                type="password"
                placeholder="Пароль"
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                className="registration-form__form__password
                                registration-form__input
                                common-styles__input"
                name="passConfirm"
                type="password"
                placeholder="Снова пароль"
                onChange={(e) => setConfPassword(e.target.value)}
            />
            <button
                className="login-form__form__submit
                                login-form__button
                                common-styles__button
                                common-styles__submit"
                onClick={sendRegisterRequest}
                disabled={isButtonDisabled}
            ><span>Зарегистрироваться</span></button>
        </div>
    );

};

export default RegistrationForm;
