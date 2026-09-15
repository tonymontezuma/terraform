import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Scene } from "@babylonjs/core/scene";

import { PlayerController } from "./PlayerController";

export class Game {
  private readonly canvas: HTMLCanvasElement;
  private readonly statusElement: HTMLElement;
  private readonly hintElement: HTMLElement;
  private readonly engine: Engine;
  private readonly scene: Scene;
  private readonly player: PlayerController;
  private readonly resizeHandler: () => void;
  private readonly pointerLockHandler: (locked: boolean) => void;
  private isDisposed = false;

  public constructor(
    canvas: HTMLCanvasElement,
    statusElement: HTMLElement,
    hintElement: HTMLElement,
  ) {
    this.canvas = canvas;
    this.statusElement = statusElement;
    this.hintElement = hintElement;
    this.engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });
    this.scene = new Scene(this.engine);
    this.scene.collisionsEnabled = true;
    this.scene.gravity = new Vector3(0, -9.81, 0);
    this.scene.clearColor = new Color4(0.16, 0.12, 0.15, 1);

    this.createEnvironment();

    this.pointerLockHandler = (locked: boolean) => {
      this.hintElement.textContent = locked
        ? "WASD para mover · Mouse para olhar · Esc para liberar"
        : "Clique na tela para capturar o mouse · WASD para mover · Esc para liberar";
      this.hintElement.style.opacity = locked ? "0.45" : "1";
    };

    this.player = new PlayerController(this.scene, canvas, {
      onPointerLockChange: this.pointerLockHandler,
    });
    this.scene.activeCamera = this.player.camera;

    this.resizeHandler = () => this.engine.resize();
    window.addEventListener("resize", this.resizeHandler);

    this.engine.runRenderLoop(() => {
      if (!this.isDisposed) {
        this.scene.render();
      }
    });

    this.statusElement.textContent = "Protótipo de movimentação carregado";
  }

  private createEnvironment(): void {
    const ambientLight = new HemisphericLight(
      "ambient-light",
      new Vector3(0.2, 1, 0.1),
      this.scene,
    );
    ambientLight.intensity = 1.15;
    ambientLight.diffuse = new Color3(0.94, 0.76, 0.62);
    ambientLight.groundColor = new Color3(0.16, 0.1, 0.08);

    const ground = MeshBuilder.CreateGround(
      "dry-ground",
      {
        width: 90,
        height: 90,
        subdivisions: 32,
      },
      this.scene,
    );
    ground.checkCollisions = true;

    const groundMaterial = new StandardMaterial("dry-ground-material", this.scene);
    groundMaterial.diffuseColor = new Color3(0.31, 0.22, 0.18);
    groundMaterial.specularColor = new Color3(0.04, 0.03, 0.02);
    ground.material = groundMaterial;

    const rockMaterial = new StandardMaterial("rock-material", this.scene);
    rockMaterial.diffuseColor = new Color3(0.28, 0.27, 0.27);
    rockMaterial.specularColor = new Color3(0.08, 0.08, 0.08);

    const rockPositions = [
      new Vector3(3, 0.35, 2),
      new Vector3(-4, 0.24, 5),
      new Vector3(6, 0.28, 9),
      new Vector3(-8, 0.42, -1),
      new Vector3(1, 0.2, 12),
    ];

    rockPositions.forEach((position, index) => {
      const rock = MeshBuilder.CreateIcoSphere(
        `rock-${index}`,
        {
          radius: 0.7 + (index % 2) * 0.2,
          subdivisions: 1,
        },
        this.scene,
      );
      rock.position = position;
      rock.scaling.y = 0.7;
      rock.rotation.y = index * 0.7;
      rock.material = rockMaterial;
    });
  }

  public dispose(): void {
    if (this.isDisposed) {
      return;
    }

    this.isDisposed = true;
    window.removeEventListener("resize", this.resizeHandler);
    this.player.dispose();
    this.scene.dispose();
    this.engine.dispose();
  }
}
