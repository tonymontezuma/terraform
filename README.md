# Terraform

Protótipo de jogo de terraformação em primeira pessoa para computador, iPad e iPhone.

## Stack inicial

- Babylon.js 9
- TypeScript
- Vite
- WebGL no navegador

## Executar localmente

```bash
pnpm install
pnpm dev
```

Abra o endereço exibido pelo Vite. Para o primeiro teste no computador:

- clique no canvas para capturar o mouse;
- use `W`, `A`, `S` e `D` para movimentar;
- mova o mouse para olhar ao redor;
- pressione `Esc` para liberar o mouse.

A estrutura já deixa o canvas preparado para receber controles de toque em uma próxima etapa.

## Scripts

```bash
pnpm check   # verifica os tipos TypeScript
pnpm build   # gera a versão de produção
pnpm preview # serve a versão compilada
```

## Estrutura inicial

- `src/main.ts`: entrada da aplicação.
- `src/game/Game.ts`: engine, cena, iluminação, terreno e loop de renderização.
- `src/game/PlayerController.ts`: câmera e movimentação em primeira pessoa.
- `src/style.css`: canvas e HUD inicial.
