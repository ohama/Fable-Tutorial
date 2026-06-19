module App

open Browser

// ANCHOR: hello-world
let app = document.getElementById "app"
app.innerHTML <- "<h1>Hello from Fable!</h1>"
// ANCHOR_END: hello-world
