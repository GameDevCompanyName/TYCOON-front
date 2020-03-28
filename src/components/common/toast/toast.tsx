import * as React from 'react';
import "./toast.css";

const Toast = (props: any) => {

    function clickHandler(e: any) {
        e.preventDefault();
        if (props.onClick != null) {
            props.onClick();
        }
        if (props.deleteHandler != null) {
            props.deleteHandler(props.id);
        } else {
            alert("Действие не назначено")
        }
    }

    return <div className="toast__main common-styles__default-container">
        <span className="toast__text">
            {props.text}
        </span>
        <button onClick={clickHandler} className="toast__button common-styles__text-button">
            {props.buttonText == null ? "Закрыть" : props.buttonText}
        </button>
    </div>

};

export default Toast;
