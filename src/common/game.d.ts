export declare module game {
    enum StoreAction {
        Buy = 0,
        Sell = 1
    }
    class PlayerData {
        constructor(id: number, name: string, money: number, cityId: number);
        id: number;
        name: string;
        money: number;
        cityId: number;
        static initialState: PlayerData;
    }
    class StoreEntryInfo {
        constructor(id: number, name: string, cost: number, quantity: number);
        id: number;
        name: string;
        cost: number;
        quantity: number;
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
    class ToastData {
        constructor(text: string, buttonText: string, deleteHandler: Function, onClick: Function, key: number);
        text: string;
        buttonText: string;
        deleteHandler: Function;
        onClick: Function;
        key: number;
    }
}
