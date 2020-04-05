export module socketActions {

    export function requestWorld(socket: WebSocket) {
        console.log("Запрашиваю всё");
        let request = {
            request: "init",
            parameters: {}
        };
        socket.send(JSON.stringify(request));
    }

    export function moveToCity(socket: WebSocket, newCityId: number) {
        console.log("Запрашиваю мув");
        let request = {
            request: "move",
            parameters: {
                cityId: newCityId
            }
        };
        socket.send(JSON.stringify(request));
    }

    export function requestPlayer(socket: WebSocket) {
        console.log("Запрашиваю игрока");
        let request = {
            request: "player",
            parameters: {}
        };
        socket.send(JSON.stringify(request));
    }

    export function sendBuy(socket: WebSocket, cart: Map<number, number>) {
        console.log("Посылаю запрос на сделку.");
        let items : Array<any> = [];
        cart.forEach(function (value: number, key: number) {
            if (value > 0) {
                items.push({
                    id: key,
                    quantity: value,
                    action: "buy"
                });
            } else {
                items.push({
                    id: key,
                    quantity: -value,
                    action: "sell"
                });
            }
        });
        let request = {
            request: "deal",
            parameters: {
                items: items
            }
        };
        socket.send(JSON.stringify(request));
    }

}