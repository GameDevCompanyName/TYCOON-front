import * as React from "react";
import "./game-header.css";
import LinkButton from "../common/link-button/LinkButton";

const GameHeader = () => {
    return (
        <div className="game-header__main common-styles__default-container">
            <h1 className="game-header__title">Tycoon</h1>
            <div className="game-header__middle">
                <div className="game-header__github">
                    <LinkButton href="https://github.com/GameDevCompanyName/TycoonBackend" text="Github бэк"/>
                </div>
                <div className="game-header__github">
                    <LinkButton href="https://github.com/GameDevCompanyName/TYCOON-front" text="Github фронт"/>
                </div>
                <div className="game-header__github">
                    <LinkButton href="https://github.com/GameDevCompanyName/TYCOON-generation" text="Github генератор"/>
                </div>
                <div className="game-header__about">
                    <LinkButton href="https://youtu.be/dQw4w9WgXcQ" text="О проекте"/>
                </div>
            </div>
            <div className="game-header__quit">
                <LinkButton href="/logout" text="Выйти"/>
            </div>
        </div>
    )
};

export default GameHeader;