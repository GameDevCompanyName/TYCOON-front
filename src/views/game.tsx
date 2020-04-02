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

const Game = () => {

    const {addToast} = useToasts();
    const [playerData, setPlayerData] = useState(PlayerData.initialState);
    const [cityData, setCityData] = useState(CityData.initialState);
    const [storeInfo, setStoreInfo] = useState(new Array<StoreEntryInfo>());

    useEffect(() => {
        let list = new Array<StoreEntryInfo>();
        list.push(
            new StoreEntryInfo(1, "Дерево", cityData.costMask)
        );
        list.push(
            new StoreEntryInfo(2, "Камень", cityData.costVacc)
        );
        setStoreInfo(list);
    }, [cityData]);

    let socket: WebSocket;

    onload = function () {
        socket = new WebSocket("ws://192.168.1.50:8080/game");
    };

    // function showToast(text: any) {
    // addToast(text, "Закрыть");
    // }

    function playerDataUpdated(playerData: PlayerData) {
        setPlayerData(playerData);
    }

    function storeAction(entryId: string, action: StoreAction) {
        alert(entryId + action.toString());
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
                        onStoreAction={storeAction}
                        storeInfo={storeInfo}
                        callback={updateInfo}
                        playerData={playerData}
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
root && ReactDOM.render(<ToastProvider placement="bottom-right" autoDismissTimeout={10000}><Game/></ToastProvider>, root);
initPixiApp();
