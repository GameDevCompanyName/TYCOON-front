export module game {

    export enum StoreAction {
        Buy,
        Sell
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

    export class PlayerData {
        constructor(id: number, name: string, money: number, cityId: number, inventory: Array<game.StoreEntryInfo>) {
            this.id = id;
            this.name = name;
            this.money = money;
            this.cityId = cityId;
            this.inventory = inventory;
        }

        id: number;
        name: string;
        money: number;
        cityId: number;
        inventory: Array<StoreEntryInfo>;

        static initialState: PlayerData = new PlayerData(
            -1,
            "",
            0,
            -1,
            new Array<game.StoreEntryInfo>()
        );

        static testState: PlayerData = new PlayerData(
            18,
            "Flextaper",
            10872,
            18,
            new Array<game.StoreEntryInfo>(
                new StoreEntryInfo(0, "Колбаса", 0, 15),
                new StoreEntryInfo(1, "Водка", 0, 3)
            )
        )
    }

    export class CityData {
        constructor(id: number, name: string, population: number, store: Array<StoreEntryInfo>, players: Array<string>) {
            this.id = id;
            this.name = name;
            this.population = population;
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
                new StoreEntryInfo(2, "Железо", 846, 63),
                new StoreEntryInfo(3, "Золото", 5314, 8)
            ),
            new Array<string>()
        );
    }

    export class Message {
        constructor(sender: string, text: string) {
            this.sender = sender;
            this.text = text;
        }

        sender : string;
        text : string;
    }

}
