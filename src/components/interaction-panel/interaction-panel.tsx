import * as React from "react";
import PlayerStatus from "../player-status/player-status";
import CityActions from "../city-actions/city-actions";
import "./interaction-panel.css";
import Chat from "../chat/chat";

const InteractionPanel = (props : any) => {

    return (
        <div className="interaction-panel__main">
            <div className="interaction-panel__city-actions common-styles__default-container common-styles__cut-corners">
                <CityActions
                    onStoreAction={props.onStoreAction}
                    storeInfo={props.storeInfo}
                />
            </div>
            <div className="interaction-panel__wrapper">
                <div className="interaction-panel__player-status common-styles__cut-corners common-styles__default-container">
                    <PlayerStatus
                        callback={props.callback}
                        playerData={props.playerData}
                    />
                </div>
                <div className="interaction-panel__chat common-styles__default-container common-styles__cut-corners">
                    <Chat/>
                </div>
            </div>

        </div>
    )
};

export default InteractionPanel;
