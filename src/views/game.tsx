import * as React from 'react';
import {useEffect, useState} from 'react';
import * as ReactDOM from 'react-dom';
import {ToastProvider, useToasts} from 'react-toast-notifications';

import "./game.css";

import GameHeader from "../components/game-header/game-header";
import CityCard from "../components/city-card/city-card";

import {game} from "../common/game";
import {http} from "../common/http"
import StoreAction = game.StoreAction;
import PlayerData = game.PlayerData;
import getEntity = http.getEntity;
import CityData = game.CityData;
import StoreEntryInfo = game.StoreEntryInfo;
import InteractionPanel from "../components/interaction-panel/interaction-panel";
import ToastContainer from "../components/common/toast-container/toast-container";
import {Config} from "../common/config";
import {initPixiApp} from "../components/interactive-map/interactive-map";

let shoppingCartBuffer = new Map<number, number>();

const Game = () => {

    const {addToast} = useToasts();
    const [playerData, setPlayerData] = useState(PlayerData.initialState);
    const [cityData, setCityData] = useState(CityData.testState);
    const [shoppingCart, setShoppingCart] = useState(new Map<number, number>());

    let socket: WebSocket;

    onload = function () {
        socket = new WebSocket("ws://192.168.1.50:8080/game");
        // reloadShoppingCart();
    };

    // function showToast(text: any) {
    // addToast(text, "Закрыть");
    // }

    function playerDataUpdated(playerData: PlayerData) {
        setPlayerData(playerData);
    }

    function reloadShoppingCart() {
        shoppingCartBuffer = new Map<number, number>();
        cityData.storeInfo.forEach(function (entry) {
            shoppingCartBuffer.set(entry.id, 0);
        });
        setShoppingCart(shoppingCartBuffer);
    }

    function onStoreAction(entryId: number, action: StoreAction) {
        shoppingCartBuffer = new Map<number, number>(shoppingCart.entries());
        let oldValue = shoppingCartBuffer.get(entryId);
        if (oldValue == null)
            oldValue = 0;
        switch (action) {
            case game.StoreAction.Buy: {
                if (oldValue == -1){
                    shoppingCartBuffer.delete(entryId);
                } else {
                    shoppingCartBuffer.set(entryId, oldValue + 1);
                }
                break;
            }
            case game.StoreAction.Sell: {
                if (oldValue == 1){
                    shoppingCartBuffer.delete(entryId);
                } else {
                    shoppingCartBuffer.set(entryId, oldValue - 1);
                }
                break;
            }
        }
        setShoppingCart(shoppingCartBuffer);
        console.log(shoppingCart);
    }

    function cityDataUpdated(cityData: CityData) {
        setCityData(cityData);
    }

    function updateInfo() {
        getEntity("/game/player", playerDataUpdated);
        getEntity("/game/city", cityDataUpdated);
    }

    function handleSend(event: any) {
        event.preventDefault();
        addToast("Flex", {appearance: 'info', autoDismiss: true});
        socket.send("{" +
            "\"resource\" : \"/game/player\"" +
            "}");
        socket.onmessage = function (event: MessageEvent) {
            alert(event.data);
        }
    }

    return (
        <div className="game__main-wrapper">
            <div className="game__header">
                <GameHeader/>
            </div>
            <div className="game__main-content">
                <div className="game__main-content__city-card">
                    <CityCard cityData={cityData}/>
                </div>
                <div className="game__main-content__interaction">
                    <InteractionPanel
                        onStoreAction={onStoreAction}
                        storeInfo={cityData.storeInfo}
                        callback={updateInfo}
                        playerData={playerData}
                        shoppingCart={shoppingCart}
                    />
                </div>
            </div>
            <div className="game__footer">
                <button onClick={handleSend}>ws send</button>
            </div>
            <div className="game__toast-wrapper">

            </div>
        </div>
    );
};

let root = document.getElementById("react-game-root");
root && ReactDOM.render(
    <ToastProvider placement="bottom-right" autoDismissTimeout={10000}>
        <Game/>
    </ToastProvider>,
    root);
initPixiApp();
