import * as React from 'react';
import "./toast-container.css";
import {useState} from "react";
import Toast from "../toast/toast";
import {game} from "../../../common/game";
import ToastData = game.ToastData;

const ToastContainer = (props: any) => {

    return <div className="toast-container__main">
        <Toast text="Это тестовый тост ко ко ко"/>
        <Toast text="А это тост с кастомной надписью на кнопке чтобы сюда можно было привязать любое действие"
        buttonText="Прикольно"/>
    </div>

};

export default ToastContainer;
