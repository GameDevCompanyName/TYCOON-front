import * as React from "react";
import "./game-header.css";
import LinkButton from "../common/link-button/LinkButton";

const GameHeader = () => {
    return (
        <div className="game-header__main common-styles__default-container">
            <h1 className="game-header__title">Tycoon</h1>
            <div className="game-header__quit">
                <LinkButton href="/logout" text="Выйти"/>
            </div>
        </div>
    )
};

export default GameHeader;