import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

export interface PlayerControllerOptions {
  eyeHeight?: number;
  moveSpeed?: number;
  mouseSensitivity?: number;
  onPointerLockChange?: (locked: boolean) => void;
}

/**
 * Controla a câmera que representa o jogador.
 *
 * O primeiro protótipo usa teclado/mouse no desktop e deixa o canvas preparado
 * para entrada por toque. A lógica de jogo não depende de React ou do DOM além
 * do canvas recebido no construtor.
 */
export class PlayerController {
  public readonly camera: UniversalCamera;

  private readonly canvas: HTMLCanvasElement;
  private readonly onPointerLockChange?: (locked: boolean) => void;
  private readonly pointerDownHandler: (event: PointerEvent) => void;
  private readonly pointerLockChangeHandler: () => void;
  private readonly pointerLockErrorHandler: () => void;
  private readonly baseSpeed: number;

  public constructor(
    scene: Scene,
    canvas: HTMLCanvasElement,
    options: PlayerControllerOptions = {},
  ) {
    this.canvas = canvas;
    this.onPointerLockChange = options.onPointerLockChange;
    this.baseSpeed = options.moveSpeed ?? 0.18;

    this.camera = new UniversalCamera(
      "player-camera",
      new Vector3(0, options.eyeHeight ?? 1.7, -8),
      scene,
    );

    this.camera.attachControl(canvas, true);
    this.camera.applyGravity = true;
    this.camera.checkCollisions = true;
    this.camera.ellipsoid = new Vector3(0.45, 0.85, 0.45);
    this.camera.speed = this.baseSpeed;
    this.camera.inertia = 0.12;
    this.camera.angularSensibility = options.mouseSensitivity ?? 3_000;
    this.camera.touchAngularSensibility = 3_000;
    this.camera.minZ = 0.05;
    this.camera.maxZ = 500;
    this.camera.keysUp = [87];
    this.camera.keysDown = [83];
    this.camera.keysLeft = [65];
    this.camera.keysRight = [68];
    this.camera.keysUpward = [32];

    this.pointerDownHandler = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      if (document.pointerLockElement !== this.canvas) {
        void this.canvas.requestPointerLock?.();
      }
    };

    this.pointerLockChangeHandler = () => {
      this.onPointerLockChange?.(document.pointerLockElement === this.canvas);
    };

    this.pointerLockErrorHandler = () => {
      this.onPointerLockChange?.(false);
    };

    canvas.addEventListener("pointerdown", this.pointerDownHandler);
    document.addEventListener("pointerlockchange", this.pointerLockChangeHandler);
    document.addEventListener("pointerlockerror", this.pointerLockErrorHandler);
  }

  public dispose(): void {
    this.canvas.removeEventListener("pointerdown", this.pointerDownHandler);
    document.removeEventListener("pointerlockchange", this.pointerLockChangeHandler);
    document.removeEventListener("pointerlockerror", this.pointerLockErrorHandler);
    this.camera.detachControl();
    this.camera.dispose();
  }
}
