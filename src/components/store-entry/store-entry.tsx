import * as React from 'react';
import {game} from "../../common/game";
import StoreAction = game.StoreAction;
import "./store-entry.css";

function StoreEntry(props: any) {

    function handleBuy(e: any) {
        e.preventDefault();
        props.onAction(props.entryId, StoreAction.Buy);
    }

    function handleSell(e: any) {
        e.preventDefault();
        props.onAction(props.entryId, StoreAction.Sell);
    }

    return (
        <div className="store-entry__shit-wrapper">
            <div className="store-entry__main">
                <button className="common-styles__button store-entry__button store-entry__plus" onClick={handleSell}>-
                </button>
                {/*<span className="common-styles__text store-entry__text">{props.entryId} - {props.entryName}</span>*/}
                <div className="store-entry__text-wrapper">
                    <div className="store-entry__top-text-wrapper">
                        <div className="common-styles__text store-entry__text">{props.entryName}</div>
                        <div
                            className="common-styles__text store-entry__cost common-styles__money">{props.entryCost} $
                        </div>
                    </div>
                    <div className="common-styles__text store-entry__quantity">{props.entryQuantity}</div>
                </div>
                <button className="common-styles__button store-entry__button store-entry__minus" onClick={handleBuy}>+
                </button>
            </div>
        </div>
    )
}

export default StoreEntry;