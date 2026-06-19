module App

open Browser
open Browser.Types
open CanvasConfetti

// ANCHOR: confetti-usage
let btn = document.getElementById "confettiBtn" :?> HTMLButtonElement
btn.onclick <- fun _ ->
    // Basic call with defaults
    confetti (ConfettiOptions()) |> ignore
    // Custom options — demonstrates the Ch.6 POJO pattern in a real binding
    confetti (ConfettiOptions(particleCount = 200,
                              spread = 80.0,
                              origin = {| x = 0.5; y = 0.6 |}))
    |> ignore
// ANCHOR_END: confetti-usage
