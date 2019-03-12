basket_id = ""
self.addEventListener('activate', function(event) {
    console.log("Ready for the demo");
    basket_id = create_UUID();
});

token = "my access token"


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
                client.postMessage({
                    "command": "broadcastOnRequest",
                    "message": "Broadcasting new basket with id = "+ basket_id
                });
                
            })
        })
    }
});


function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}
