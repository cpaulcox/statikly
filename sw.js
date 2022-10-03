// Service worker lifecycle event handling

// Fetch event handling

// The fetch event is fired when the fetch() method is called.
// Use the event name in methods like addEventListener(), or set an event handler property.
// addEventListener("fetch", (event) => {});  'fetch' is a predfined hook name.

// Intercepts all fetch traffic.
onfetch = (event) => { 
    
  console.log('Handling fetch event for', event.request.url);
  console.log('Request details', event.request);
  console.log('Fetch event details', event);
    
    
  // We only want to call event.respondWith() if this is a navigation request
  // for an HTML page.
  // request.mode of 'navigate' is unfortunately not supported in Chrome
  // versions older than 49, so we need to include a less precise fallback,
  // which checks for a GET request with an Accept: text/html header.
  if (event.request.mode === 'navigate' ||
      (event.request.method === 'GET' &&
       event.request.headers.get('accept').includes('text/html'))) {
    console.log('Handling fetch event for', event.request.url);
    event.respondWith(
      fetch(event.request)
        .then(response => {
        console.log('Response is ', response);
        console.log('Content type is', response.headers.get('Content-Type'))
        if (response.headers.get('Content-Type').startsWith('application/json')) {
            var clone = response.clone() // Must clone as can only be used once and is returned to responWith
            clone.json().then(json => {
                console.log('JSON Body ', json)
            })
        }
        
        return response;
      })
        .catch(error => {
        // The catch is only triggered if fetch() throws an exception, which will most likely
        // happen due to the server being unreachable.
        // If fetch() returns a valid HTTP response with an response code in the 4xx or 5xx
        // range, the catch() will NOT be called. If you need custom handling for 4xx or 5xx
        // errors, see https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/fallback-response
        console.log('Fetch failed; returning offline page instead.', error);
        return caches.match(OFFLINE_URL);
      })
    );
  }

  // If our if() condition is false, then this fetch handler won't intercept the request.
  // If there are any other fetch handlers registered, they will get a chance to call
  // event.respondWith(). If no fetch handlers call event.respondWith(), the request will be
  // handled by the browser as if there were no service worker involvement.
});


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
