import * as React from "react";
import StoreEntry from "../store-entry/store-entry";
import {Component} from "react";
import {game} from "../../common/game";
import StoreEntryInfo = game.StoreEntryInfo;
import "./city-actions.css";
import InfoNote from "../common/info-note/info-note";
import TitleField from "../common/title-text/title-value";

const CityActions = (props: any) => {

    let entries = new Array<JSX.Element>();
    props.storeInfo.forEach(function (entry: StoreEntryInfo) {
        entries.push(
            <StoreEntry
                key={entry.id} //we need it for some reason
                entryId={entry.id}
                entryName={entry.name}
                entryCost={entry.cost}
                onAction={props.onStoreAction}
            />
        );
    });

    return (
        <div className="city-actions__main">
            <TitleField field="Также здесь могут висеть информационные сообщения. Объявления вские и прочее."/>
            <TitleField field="Например сегодня у нас бесплатные пирожки."/>
            {entries}
            <TitleField field="А завтра макароны"/>
            {entries}
            {entries}
        </div>
    )
};

export default CityActions;