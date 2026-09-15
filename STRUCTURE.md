# Terraform

## Runtime

- Babylon.js 9
- TypeScript + Vite
- Dimensão: 3D
- Alvo: navegador desktop, com adaptação planejada para iPad e iPhone

## App Entry

- `index.html` -> `src/main.ts`
- `src/main.ts` -> cria a instância de `Game`
- `src/game/Game.ts` -> possui `Engine`, `Scene`, ambiente, render loop e resize
- `src/game/PlayerController.ts` -> possui a `UniversalCamera`, movimento, gravidade, colisões e pointer lock

## Game Entry

- `Game` cria o chão seco e pedras de teste.
- `PlayerController` mantém a câmera em primeira pessoa separada da cena.
- A lógica de gameplay não depende de React ou de um framework de UI.

## Próximos módulos planejados

- `InputManager` -> ações semânticas para teclado, mouse e toque.
- `InteractionSystem` -> raycast, coleta e interação.
- `Inventory` -> slots, pilhas e persistência.
- `TerrainSystem` -> células caváveis e terraformação.
- `TouchControls` -> joystick virtual e botões para iPad/iPhone.
- `Hud` -> saúde, sede, fome e oxigênio.

## Verificação

- `pnpm check`
- `pnpm build`
- `pnpm dev`
- teste manual de WASD, mouse, gravidade, colisão com o terreno e pointer lock.
