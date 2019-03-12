self.addEventListener('activate', function(event) {
    console.log("Ready for the demo");
});

token = "my access token"
basket_id = "112233445566"

self.addEventListener('message', function(event) {
    var data = event.data;

    if (data.command == "oneWayCommunication") {
        console.log("Message from the Page : ", data.message);
    } else if (data.command == "twoWayCommunication") {
        console.log("Responding to message from the Page: ", data.message);
        event.ports[0].postMessage({
            "message": "Hi, Page with..." + token
        });
        event.ports[0].postMessage({
            "message": "basket id = " + basket_id
        });
    } else if (data.command == "broadcast") {
        console.log("Broadcasting to the clients");

        self.clients.matchAll().then(function(clients) {
            clients.forEach(function(client) {
                client.postMessage({
                    "command": "broadcastOnRequest",
                    "message": "This is a broadcast on request from the SW"
                });
            })
        })
    }
});
