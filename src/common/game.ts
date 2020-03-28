export module game {

    export enum StoreAction {
        Buy,
        Sell
    }

    export class PlayerData {
        constructor(id: number, name: string, money: number, cityId: number, quantityMask: number, quantityVacc: number, userId: number) {
            this.id = id;
            this.name = name;
            this.money = money;
            this.cityId = cityId;
            this.quantityMask = quantityMask;
            this.quantityVacc = quantityVacc;
            this.userId = userId;
        }

        id: number;
        name: string;
        money: number;
        cityId: number;
        quantityMask: number;
        quantityVacc: number;
        userId: number;

        static initialState: PlayerData = new PlayerData(
            -1,
            "Igorlo",
            2534,
            -1,
            0,
            0,
            -1
        );
    }

    export class CityData {
        constructor(id: number, name: string, costMask: number, costVacc: number, players: Array<string>) {
            this.id = id;
            this.name = name;
            this.costMask = costMask;
            this.costVacc = costVacc;
            this.players = players;
        }

        id: number;
        name: string;
        costMask: number;
        costVacc: number;
        players: Array<string>;

        static initialState: CityData = new CityData(
            -1,
            "Петербург",
            16,
            88,
            new Array<string>()
        );
    }

    export class StoreEntryInfo {
        constructor(id: number, name: string, cost: number) {
            this.id = id;
            this.name = name;
            this.cost = cost;
        }

        id: number;
        name: string;
        cost: number;
    }

    export class ToastData {
        constructor(text: string, buttonText: string, deleteHandler: Function, onClick: Function, key: number) {
            this.text = text;
            this.buttonText = buttonText;
            this.deleteHandler = deleteHandler;
            this.onClick = onClick;
            this.key = key;
        }

        text: string;
        buttonText: string;
        deleteHandler: Function;
        onClick: Function;
        key: number;
    }

}
