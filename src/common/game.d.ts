export declare module game {
    enum StoreAction {
        Buy = 0,
        Sell = 1
    }
    class StoreEntryInfo {
        constructor(id: number, name: string, cost: number, quantity: number);
        id: number;
        name: string;
        cost: number;
        quantity: number;
    }
    class PlayerData {
        constructor(id: number, name: string, money: number, cityId: number, inventory: Array<game.StoreEntryInfo>);
        id: number;
        name: string;
        money: number;
        cityId: number;
        inventory: Array<StoreEntryInfo>;
        static initialState: PlayerData;
        static testState: PlayerData;
    }
    class CityData {
        constructor(id: number, name: string, population: number, store: Array<StoreEntryInfo>, players: Array<string>);
        id: number;
        name: string;
        population: number;
        storeInfo: Array<StoreEntryInfo>;
        players: Array<string>;
        static initialState: CityData;
        static testState: CityData;
    }
    class Message {
        constructor(sender: string, text: string);
        sender: string;
        text: string;
    }
}
