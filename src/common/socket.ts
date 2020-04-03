export module socket {

    export function requestWorld(socket : WebSocket) {
        let request = {
            request : "init",
            parameters : {}
        };
        socket.send(JSON.stringify(request));
    }

}