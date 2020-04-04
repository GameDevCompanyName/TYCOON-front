import * as React from "react";
import "./chat.css";
import {game} from "../../common/game";
import Message = game.Message;

const Chat = (props: any) => {

    function buildMessages(messages: Array<Message>): Array<JSX.Element> {
        let elements = new Array<JSX.Element>();
        messages.forEach(function (message: Message, index: number) {
            elements.push(
                <div key={index} className="chat__message-wrapper common-styles__default-container">
                    <span className="chat__message-sender">{message.sender}</span>:
                    <span className="chat__message-text">{message.text}</span>
                </div>
            )
        });
        return elements;
    }

    return (
        <div className="chat__wrapper">
            <div className="chat__messages">
                {buildMessages(props.messages)}
            </div>
            <div className="chat__input">
                <input className="common-styles__input" type="text"/>
                <button className="common-styles__button">Send</button>
            </div>
        </div>
    )
};

export default Chat;