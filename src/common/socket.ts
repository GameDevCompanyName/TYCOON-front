export module socket {

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
                cityId: newCityId.toString()
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

}