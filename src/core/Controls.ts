import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import * as THREE from 'three';

export class GameControls {
    private controls: PointerLockControls;
    private moveForward: boolean = false;
    private moveBackward: boolean = false;
    private moveLeft: boolean = false;
    private moveRight: boolean = false;
    private moveUp: boolean = false;
    private moveDown: boolean = false;
    private camera: THREE.Camera;

    constructor(camera: THREE.Camera, domElement: HTMLElement) {
        this.camera = camera;
        this.controls = new PointerLockControls(camera, domElement);
        this.setupKeyboardControls();
    }

    private flyUp(speed: number): void {
        this.camera.position.add(new THREE.Vector3(0, speed, 0));
    }

    private setupKeyboardControls(): void {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = true;
                    break;
                case 'Space':
                    this.moveUp = true;
                    break;
                case 'ShiftLeft':
                    this.moveDown = true;
                    break;
            }
        });

        document.addEventListener('keyup', (event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = false;
                    break;
                case 'Space':
                    this.moveUp = false;
                    break;
                case 'ShiftLeft':
                    this.moveDown = false;
                    break;
            }
        });
    }

    public lock(): void {
        this.controls.lock();
    }

    public unlock(): void {
        this.controls.unlock();
    }

    public update(): void {
        if (this.controls.isLocked) {
            const speed = 0.1;
            if (this.moveForward) this.controls.moveForward(speed);
            if (this.moveBackward) this.controls.moveForward(-speed);
            if (this.moveLeft) this.controls.moveRight(-speed);
            if (this.moveRight) this.controls.moveRight(speed);
            if (this.moveUp) this.flyUp(speed);
            if (this.moveDown) this.flyUp(-speed);
        }
    }
}
