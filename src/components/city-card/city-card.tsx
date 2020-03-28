// @ts-ignore
import * as React from "react";
import "./city-card.css";
import {useState} from "react";
import TitleField from "../common/title-text/title-value";

const CityCard = (props : any) => {

    return (
        <div className="city-card__main">
            <div className="city-card__photo common-styles__default-container common-styles__cut-corners">

            </div>
            <div className="city-card__info common-styles__default-container common-styles__cut-corners">
                <h1>Город</h1>
                <TitleField title={"Идентификатор"} field={props.cityData.id}/>
                <TitleField title={"Название"} field={props.cityData.name}/>
                <TitleField title={"Игроки"} field={props.cityData.players.toString()}/>
                {/*<PlayerList players={props.cityData.players}/>*/}
            </div>
        </div>
    )
};

export default CityCard;