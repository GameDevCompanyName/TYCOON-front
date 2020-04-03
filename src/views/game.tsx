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
import {socket} from "../common/socket";
import requestWorld = socket.requestWorld;
import moveToCity = socket.moveToCity;
import requestPlayer = socket.requestPlayer;

let shoppingCartBuffer = new Map<number, number>();
let playerDataBuffer : PlayerData;
let cityDataBuffer : CityData;

const Game = () => {

    const {addToast} = useToasts();
    const [playerData, setPlayerData] = useState(PlayerData.initialState);
    const [cityData, setCityData] = useState(CityData.initialState);
    const [shoppingCart, setShoppingCart] = useState(new Map<number, number>());

    let socket: WebSocket;
    let moveTo: Function;
    let isMovement: Function;

    function locationClicked(id: number) {
        if (!isMovement()){
            moveToCity(socket, id);
        }
    }

    function worldLoaded(data: string) {
        console.log("Рисую город");
        console.log(playerData.cityId);
        let functions = initPixiApp(data, locationClicked, playerDataBuffer.cityId);
        moveTo = functions.moveTo;
        isMovement = functions.isMovement
    }

    onload = function () {
        socket = new WebSocket("ws://192.168.1.50:8080/game");
        socket.onopen = function () {
            requestPlayer(socket);
            requestWorld(socket);
        };
        socket.onmessage = function (event: MessageEvent) {
            handleRequest(JSON.parse(event.data));
        };
        socket.onerror = function(){
            addToast("Ошибка соединения с сервером.", {appearance: 'error', autoDismiss: true});
        };
        socket.onclose = function(){
            addToast("Соединение с сервером потеряно.", {appearance: 'error', autoDismiss: true});
        };
        reloadShoppingCart();
    };

    function handleRequest(response: any) {
        if (response.status != 200) {
            addToast("Операция не удалась.", {appearance: 'error', autoDismiss: true});
            return;
        }
        switch (response.type) {
            case "world": {
                console.log("Пришёл ответ на мир");
                cityDataUpdated(response.data.city);
                playerDataUpdated(response.data.player);
                worldLoaded(response.data.world);
                break;
            }
            case "city": {
                console.log("Пришёл ответ на город");
                cityDataUpdated(response.data.city);
                break;
            }
            case "player" : {
                console.log("Пришёл ответ на игрока");
                playerDataUpdated(response.data.player);
                console.log(playerData);
                break;
            }
            case "move" : {
                console.log("Пришёл ответ на передвижение");
                cityDataUpdated(response.data.city);
                moveTo(cityDataBuffer.id);
                break;
            }
            default: {
                addToast("Не удалось обработать ответ сервера.", {appearance: 'error', autoDismiss: true});
            }
        }
    }

    // function showToast(text: any) {
    // addToast(text, "Закрыть");
    // }

    function playerDataUpdated(playerRawData: any) {
        playerDataBuffer = new PlayerData(
            playerRawData.id,
            playerRawData.name,
            playerRawData.money,
            playerRawData.cityId
        );
        setPlayerData(playerDataBuffer);
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
                if (oldValue == -1) {
                    shoppingCartBuffer.delete(entryId);
                } else {
                    shoppingCartBuffer.set(entryId, oldValue + 1);
                }
                break;
            }
            case game.StoreAction.Sell: {
                if (oldValue == 1) {
                    shoppingCartBuffer.delete(entryId);
                } else {
                    shoppingCartBuffer.set(entryId, oldValue - 1);
                }
                break;
            }
        }
        setShoppingCart(shoppingCartBuffer);
    }

    function cityDataUpdated(cityRawData: any) {
        cityDataBuffer = new CityData(
            cityRawData.id,
            cityRawData.name,
            cityRawData.population,
            CityData.testState.storeInfo,
            cityRawData.players
        );
        setCityData(cityDataBuffer);
    }

    function updateInfo() {
        getEntity("/game/player", playerDataUpdated);
        getEntity("/game/city", cityDataUpdated);
    }

    function handleSend(event: any) {
        event.preventDefault();
        addToast("Flex", {appearance: 'info', autoDismiss: true});
        // socket.send("{" +
        //     "\"request\" : \"init\"," +
        //     "\"parameters\" : {}" +
        //     "}");
        // socket.onmessage = function (event: MessageEvent) {
        //     let response = JSON.parse(event.data);
        //     console.log(response.data.world);
        // }
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
