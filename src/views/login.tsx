import * as ReactDOM from 'react-dom';
import * as React from 'react';
import LoginForm from "../components/login-form/login-form";
import LinkButton from "../components/common/link-button/LinkButton";
import "./login.css";

let page = (
    <div className="login__main-wrapper">
        <LoginForm />
        <LinkButton href="/registration" text="Создать пользователя"/>
    </div>
);

let root = document.getElementById('react-login-root');
root && ReactDOM.render(page, root);
