// A named export — imported in F# via [<Import("greet", "./helpers.js")>]
export function greet(name) {
  return `Hello, ${name}!`;
}

// A default export — imported in F# via importDefault "./helpers.js"
export default {
  version: "1.0.0",
  shout(msg) {
    return String(msg).toUpperCase();
  }
};
