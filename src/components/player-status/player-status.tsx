import * as React from "react";
import "./player-status.css";
import TitleValue from "../common/title-text/title-value";

const PlayerStatus = (props : any) => {

    let callback = props.callback;

    function handleClick(e : any) {
        e.preventDefault();
        callback();
    }

    return (
        <div className="player-status__main">
            <div className="common-styles__money-bar">
                <span>{props.playerData.money}$</span>
            </div>
            {/*<TitleValue title={"Идентификатор"} field={props.playerData.id}/>*/}
            <TitleValue title={"Имя"} field={props.playerData.name}/>
            {/*<button className="common-styles__button" onClick={handleClick}>*/}
            <button className="common-styles__button">
                <span>Обновить контент</span>
            </button>
        </div>
    )
};

export default PlayerStatus;