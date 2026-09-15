import "./style.css";

import { Game } from "./game/Game";

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");
const statusElement = document.querySelector<HTMLElement>("#status");
const hintElement = document.querySelector<HTMLElement>("#hint");

if (!canvas || !statusElement || !hintElement) {
  throw new Error("Elementos obrigatórios do jogo não foram encontrados.");
}

const game = new Game(canvas, statusElement, hintElement);

if (import.meta.hot) {
  import.meta.hot.dispose(() => game.dispose());
}

window.addEventListener("beforeunload", () => game.dispose(), { once: true });
