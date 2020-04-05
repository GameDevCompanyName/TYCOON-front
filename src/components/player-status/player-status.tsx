import * as React from "react";
import "./player-status.css";
import TitleValue from "../common/title-text/title-value";
import {game} from "../../common/game";
import StoreEntryInfo = game.StoreEntryInfo;

const PlayerStatus = (props: any) => {

    let callback = props.callback;

    function handleClick(e: any) {
        e.preventDefault();
        // callback(); //TODO
    }

    function getItemNameById(storeInfo: Array<StoreEntryInfo>, id: number): string {
        let name: string;
        storeInfo.forEach(function (entry: StoreEntryInfo) {
            if (entry.id === id)
                name = entry.name;
        });
        return name == null ? "Волшебные бобы" : name;
    }

    function getCostById(storeInfo: Array<game.StoreEntryInfo>, id: number): number {
        let cost: number;
        storeInfo.forEach(function (entry: StoreEntryInfo) {
            if (entry.id === id)
                cost = entry.cost;
        });
        return cost == null ? 0 : cost;
    }

    function buildShoppingCart(storeInfo: Array<StoreEntryInfo>, shoppingCart: Map<number, number>) {
        let elements = new Array<JSX.Element>();
        let totalCost: number = 0;
        shoppingCart.forEach(function (value: number, key: number) {
            totalCost += getCostById(storeInfo, key) * value;
            elements.push(
                <div className="player-status__shopping-cart-item" key={key}>
                    <span className="player-status__shopping-cart-item__name">{getItemNameById(storeInfo, key)}</span>
                    <span className="player-status__shopping-cart-item__quantity">{value} шт.</span>
                </div>
            );
        });
        elements.push(
            <div key={storeInfo.length} className="player-status__shopping-cart-total-cost common-styles__money">
                {-totalCost} $
            </div>
        );
        if (totalCost > props.playerData.money) {
            elements.push(
                <div key={storeInfo.length + 1}
                     className="player-status__shopping-cart-not-enough-money common-styles__default-shadow">
                    Недостаточно<br/>средств
                </div>
            );
        }
        return elements;
    }

    function buildInventory(inventory: Array<StoreEntryInfo>) {
        let elements = new Array<JSX.Element>();
        inventory.forEach(function (value: StoreEntryInfo, index: number) {
            if (value.quantity <= 0){
                return
            }
            elements.push(
                <div className="player-status__inventory-item" key={index}>
                    <span className="player-status__inventory-item__name">{value.name}</span>
                    <span className="player-status__inventory-item__quantity">{value.quantity} шт.</span>
                </div>
            );
        });
        return elements;
    }


    return (
        <div className="player-status__main">
            <div className="common-styles__money-bar">
                <span>{props.playerData.money}$</span>
            </div>
            {/*<TitleValue title={"Идентификатор"} field={props.playerData.id}/>*/}
            <TitleValue title={"Имя"} field={props.playerData.name}/>
            {/*<button className="common-styles__button" onClick={handleClick}>*/}
            {/*<button className="common-styles__button">*/}
            {/*    <span>Обновить контент</span>*/}
            {/*</button>*/}
            <div className="player-status__inventory common-styles__default-container common-styles__default-shadow">
                <div className="player-status__inventory-title">Инвентарь</div>
                {!props.playerData.inventory.length
                    ? <div className="player-status__inventory-empty">Пусто</div>
                    : buildInventory(props.playerData.inventory)
                }
            </div>
            {!props.shoppingCart.size ? null :
                <div
                    className="player-status__shopping-cart common-styles__default-container common-styles__default-shadow">
                    <div className="player-status__shopping-cart-title">Список покупок</div>
                    {buildShoppingCart(props.storeInfo, props.shoppingCart)}
                    <div className="player-status__shopping-cart-buttons-wrapper">
                        <button className="player-status__shopping-cart-drop-button common-styles__button"
                                onClick={props.reloadCart}>
                            <span>Отмена</span>
                        </button>
                        <button className="player-status__shopping-cart-buy-button common-styles__button"
                                onClick={props.buyCart}>
                            <span>Сделка</span>
                        </button>
                    </div>
                </div>
            }
        </div>
    )
};

export default PlayerStatus;