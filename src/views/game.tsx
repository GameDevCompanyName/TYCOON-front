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
import {Config} from "../common/config";
import {initPixiApp} from "../components/interactive-map/interactive-map";
import {socket} from "../common/socket";
import requestWorld = socket.requestWorld;
import moveToCity = socket.moveToCity;
import requestPlayer = socket.requestPlayer;
import Message = game.Message;

let shoppingCartBuffer = new Map<number, number>();
let playerDataBuffer: PlayerData;
let cityDataBuffer: CityData;
let messageBuffer: Array<Message>;

const Game = () => {

    const {addToast} = useToasts();
    const [playerData, setPlayerData] = useState(PlayerData.testState);
    const [cityData, setCityData] = useState(CityData.testState);
    const [shoppingCart, setShoppingCart] = useState(new Map<number, number>());
    const [messages, setMessages] = useState(new Array<Message>(
        new Message("Igorlo", "Всем привет в этом ламповом чатике"),
        new Message("Alex", "Хули нам пацанам"),
    ));

    let socket: WebSocket;
    let moveTo: Function;
    let isMovement: Function;

    function locationClicked(id: number) {
        if (id == cityDataBuffer.id) {
            return;
        }
        if (!isMovement()) {
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

    function initSocket() {
        let socket = new WebSocket("ws://192.168.1.50:8080/game");
        socket.onopen = function () {
            requestPlayer(socket);
            requestWorld(socket);
        };
        socket.onmessage = function (event: MessageEvent) {
            handleRequest(JSON.parse(event.data));
        };
        socket.onerror = function () {
            addToast("Ошибка соединения с сервером.", {appearance: 'error', autoDismiss: true});
        };
        socket.onclose = function () {
            addToast("Соединение с сервером потеряно.", {appearance: 'error', autoDismiss: true});
        };
        return socket;
    }

    onload = function () {
        // socket = initSocket();
        // reloadShoppingCart();
    };

    function error(text: string, cause: string) {
        addToast(text + "\nПричина: " + cause, {appearance: "error"});
    }

    function handleRequest(response: any) {
        console.log(response);
        switch (response.type) {
            case "world": {
                if (response.status != 200) {
                    error("Не удалось загрузить мир", response.data.cause);
                    break;
                }
                console.log("Пришёл ответ на мир");
                cityDataUpdated(response.data.city);
                playerDataUpdated(response.data.player);
                worldLoaded(response.data.world);
                break;
            }
            case "city": {
                if (response.status != 200) {
                    error("Не удалось загрузить город", response.data.cause);
                    break;
                }
                console.log("Пришёл ответ на город");
                cityDataUpdated(response.data.city);
                break;
            }
            case "player" : {
                if (response.status != 200) {
                    error("Не удалось загрузить игрока", response.data.cause);
                    break;
                }
                console.log("Пришёл ответ на игрока");
                playerDataUpdated(response.data.player);
                console.log(playerData);
                break;
            }
            case "move" : {
                if (response.status != 200) {
                    if (response.status == 400) {
                        error("Не удалось переместиться", response.data.cause);
                        break;
                    }
                    error("Не удалось переместиться", response.data.cause);
                    break;
                }
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
            playerRawData.cityId,
            new Array<game.StoreEntryInfo>() //TODO
        );
        setPlayerData(playerDataBuffer);
    }

    function reloadShoppingCart() {
        shoppingCartBuffer = new Map<number, number>();
        setShoppingCart(shoppingCartBuffer);
    }

    function buy() {
        addToast("Сделка совершена", {appearance: "success", autoDismiss: true});
        reloadShoppingCart();
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

        let store = new Array<StoreEntryInfo>();
        cityRawData.resources.forEach(function (resource: any) {
            store.push(
                new StoreEntryInfo(
                    resource.id,
                    resource.name,
                    resource.cost,
                    resource.quantity
                )
            );
        });

        cityDataBuffer = new CityData(
            cityRawData.id,
            cityRawData.name,
            cityRawData.population,
            store,
            cityRawData.players
        );
        setCityData(cityDataBuffer);
    }

    // function handleSend(event: any) {
    //     event.preventDefault();
    //     addToast("Flex", {appearance: 'info', autoDismiss: true});
    //     // socket.send("{" +
    //     //     "\"request\" : \"init\"," +
    //     //     "\"parameters\" : {}" +
    //     //     "}");
    //     // socket.onmessage = function (event: MessageEvent) {
    //     //     let response = JSON.parse(event.data);
    //     //     console.log(response.data.world);
    //     // }
    // }

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
                        reloadCart={reloadShoppingCart}
                        buyCart={buy}
                        // callback={} TODO
                        playerData={playerData}
                        shoppingCart={shoppingCart}
                        messages={messages}
                    />
                </div>
            </div>
            {/*<div className="game__footer">*/}
            {/*    <button onClick={handleSend}>ws send</button>*/}
            {/*</div>*/}
        </div>
    );
};

let root = document.getElementById("react-game-root");
root && ReactDOM.render(
    <ToastProvider placement="bottom-right" autoDismissTimeout={10000}>
        <Game/>
    </ToastProvider>,
    root);
