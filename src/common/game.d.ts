export declare module game {
    enum StoreAction {
        Buy = 0,
        Sell = 1
    }
    class PlayerData {
        constructor(id: number, name: string, money: number, cityId: number, quantityMask: number, quantityVacc: number, userId: number);
        id: number;
        name: string;
        money: number;
        cityId: number;
        quantityMask: number;
        quantityVacc: number;
        userId: number;
        static initialState: PlayerData;
    }
    class CityData {
        constructor(id: number, name: string, costMask: number, costVacc: number, players: Array<string>);
        id: number;
        name: string;
        costMask: number;
        costVacc: number;
        players: Array<string>;
        static initialState: CityData;
    }
    class StoreEntryInfo {
        constructor(id: number, name: string, cost: number);
        id: number;
        name: string;
        cost: number;
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
