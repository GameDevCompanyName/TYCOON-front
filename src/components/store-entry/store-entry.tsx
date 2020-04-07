import * as React from 'react';
import {Howl, Howler} from 'howler';
import {game} from "../../common/game";
import StoreAction = game.StoreAction;
import "./store-entry.css";

let sound = new Howl({
    src: ["sound/click.mp3"]
});

function StoreEntry(props: any) {

    function handleBuy(e: any) {
        e.preventDefault();
        console.log("Купить");
        props.onStoreAction(props.entryId, StoreAction.Buy);
        sound.play();
    }

    function handleSell(e: any) {
        e.preventDefault();
        console.log("Продать");
        props.onStoreAction(props.entryId, StoreAction.Sell);
        sound.play();
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
                    <div className="common-styles__text store-entry__quantity">{props.entryQuantity} шт.</div>
                </div>
                <button className="common-styles__button store-entry__button store-entry__minus" onClick={handleBuy}>+
                </button>
            </div>
        </div>
    )
}

export default StoreEntry;