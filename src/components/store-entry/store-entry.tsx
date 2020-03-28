import * as React from 'react';
import {game} from "../../common/game";
import StoreAction = game.StoreAction;
import "./store-entry.css";

function StoreEntry(props : any) {

    function handleBuy(e : any) {
        e.preventDefault();
        props.onAction(props.entryId, StoreAction.Buy);
    }

    function handleSell(e : any) {
        e.preventDefault();
        props.onAction(props.entryId, StoreAction.Sell);
    }

    return (
        <div className="store-entry__main">
            <button className="common-styles__button store-entry__button" onClick={handleSell}>-</button>
            {/*<span className="common-styles__text store-entry__text">{props.entryId} - {props.entryName}</span>*/}
            <span className="common-styles__text store-entry__text">{props.entryName}</span>
            <span className="common-styles__text store-entry__cost common-styles__money">{props.entryCost} $</span>
            <button className="common-styles__button store-entry__button" onClick={handleBuy}>+</button>
        </div>
    )
}

export default StoreEntry;