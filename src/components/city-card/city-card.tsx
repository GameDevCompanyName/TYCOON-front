// @ts-ignore
import * as React from "react";
import "./city-card.css";
import {useState} from "react";
import TitleField from "../common/title-text/title-value";

const CityCard = (props: any) => {

    return (
        <div className="city-card__main">
            <div className="city-card__wrapper common-styles__cut-corners common-styles__default-container">
                <div className="city-card__photo">
                    <h1>{props.cityData.name}</h1>
                </div>
                <div className="city-card__map">

                </div>
                <div className="city-card__info">
                    <TitleField title={"Идентификатор"} field={props.cityData.id}/>
                    <TitleField title={"Игроки"} field={props.cityData.players.toString()}/>
                    {/*<PlayerList players={props.cityData.players}/>*/}
                </div>
            </div>
        </div>
    )
};

export default CityCard;