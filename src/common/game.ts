export module game {

    export enum StoreAction {
        Buy,
        Sell
    }

    export class PlayerData {
        constructor(id: number, name: string, money: number, cityId: number) {
            this.id = id;
            this.name = name;
            this.money = money;
            this.cityId = cityId;
        }

        id: number;
        name: string;
        money: number;
        cityId: number;

        static initialState: PlayerData = new PlayerData(
            -1,
            "",
            0,
            -1
        );
    }

    export class StoreEntryInfo {
        constructor(id: number, name: string, cost: number, quantity: number) {
            this.id = id;
            this.name = name;
            this.cost = cost;
            this.quantity = quantity;
        }

        id: number;
        name: string;
        cost: number;
        quantity: number;
    }

    export class CityData {
        constructor(id: number, name: string, population: number, store: Array<StoreEntryInfo>, players: Array<string>) {
            this.id = id;
            this.name = name;
            this.storeInfo = store;
            this.players = players;
        }

        id: number;
        name: string;
        population: number;
        storeInfo: Array<StoreEntryInfo>;
        players: Array<string>;

        static initialState: CityData = new CityData(
            0,
            "",
            0,
            new Array<StoreEntryInfo>(),
            new Array<string>()
        );

        static testState: CityData = new CityData(
            16,
            "Петербург",
            0,
            new Array<StoreEntryInfo>(
                new StoreEntryInfo(0, "Дерево", 80, 567),
                new StoreEntryInfo(1, "Камень", 135, 154),
                new StoreEntryInfo(2, "Камень", 846, 63),
                new StoreEntryInfo(3, "Золото", 5314, 8)
            ),
            new Array<string>()
        );
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
