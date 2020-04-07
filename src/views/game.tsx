import * as React from 'react';
import {Howl, Howler} from 'howler';
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
import {socketActions} from "../common/socket";
import requestWorld = socketActions.requestWorld;
import moveToCity = socketActions.moveToCity;
import requestPlayer = socketActions.requestPlayer;
import Message = game.Message;
import sendBuy = socketActions.sendBuy;
import socketHost = Config.socketHost;

let dealSound = new Howl({
    src: ["sound/deal_success.wav"]
});
let mainMusic = new Howl({
    src: ["sound/music_1.mp3"],
    loop: true
});
let horses = new Howl({
    src: ["sound/horses.mp3"]
});

let shoppingCartBuffer = new Map<number, number>();
let playerDataBuffer: PlayerData;
let cityDataBuffer: CityData;
let messageBuffer: Array<Message>;

let socket: WebSocket;

const Game = () => {

    const {addToast} = useToasts();
    const [playerData, setPlayerData] = useState(PlayerData.initialState);
    const [cityData, setCityData] = useState(CityData.initialState);
    const [shoppingCart, setShoppingCart] = useState(new Map<number, number>());
    const [messages, setMessages] = useState(new Array<Message>(
        new Message("Igorlo", "Всем привет в этом ламповом чатике"),
        new Message("Alex", "Хули нам пацанам"),
    ));

    let moveTo: Function;
    let isMovement: Function;
    let movePlayer: Function;

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
        let functions = initPixiApp(data, locationClicked, playerDataBuffer.cityId, playerDataBuffer.id);
        moveTo = functions.moveTo;
        isMovement = functions.isMovement;
        movePlayer = functions.movePlayer;
    }

    function initSocket() {
        let socket = new WebSocket(socketHost + "/game");
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
        socket = initSocket();
        reloadShoppingCart();
    };

    function error(text: string, cause: string) {
        addToast(text + "Причина: " + cause, {appearance: "error"});
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
            case "playerMoved" : {
                if (response.status != 200) {
                    error("Не удалось обработать перемещение другого игрока.", response.data.cause);
                    break;
                }
                movePlayer(
                    response.data.moveInfo.playerId,
                    response.data.moveInfo.newCityId
                );
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
                // horses.play();
                break;
            }
            case "deal": {
                if (response.status != 200) {
                    error("Не удалось совершить сделку.", response.data.cause);
                    break;
                }
                playerDataUpdated(response.data.player);
                cityDataUpdated(response.data.city);
                dealSound.play();
                addToast("Сделка совершена.", {
                    appearance: "success",
                    autoDismiss: true
                });
                reloadShoppingCart();
                break;
            }
            default: {
                addToast("Не удалось обработать ответ сервера.", {appearance: 'error', autoDismiss: true});
                break;
            }
        }
    }

    // function showToast(text: any) {
    // addToast(text, "Закрыть");
    // }

    function playerDataUpdated(playerRawData: any) {
        let inventory: Array<StoreEntryInfo> = [];

        playerRawData.resources.forEach(function (resource: any) {
            inventory.push(
                new StoreEntryInfo(resource.id, resource.name, 0, resource.quantity)
            );
        });

        playerDataBuffer = new PlayerData(
            playerRawData.id,
            playerRawData.name,
            playerRawData.money,
            playerRawData.cityId,
            inventory
        );
        setPlayerData(playerDataBuffer);
    }

    function reloadShoppingCart() {
        shoppingCartBuffer = new Map<number, number>();
        setShoppingCart(shoppingCartBuffer);
    }

    function buy() {
        sendBuy(socket, shoppingCartBuffer);
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
                        buyCart={buy.bind(this)}
                        // callback={} TODO
                        playerData={playerData}
                        shoppingCart={shoppingCart}
                        messages={messages}
                    />
                </div>
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
