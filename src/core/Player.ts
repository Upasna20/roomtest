import * as THREE from "three";
import { Lobby } from "../scenes/Lobby";
// import type {Room} from "../core/Game"
export class Player {
  public object: THREE.Mesh; // Player object
  public boundingBox: THREE.Box3; // Bounding box for collision
  private camera: THREE.Camera; // Reference to the camera

  constructor(camera: THREE.Camera) {
    this.camera = camera;

    // Create a simple box to represent the player
    const geometry = new THREE.BoxGeometry(0.2, 0.4, 0.1);
    const material = new THREE.MeshBasicMaterial({ color: 0xDAF7A6 });
    this.object = new THREE.Mesh(geometry, material);

    // Start player at the same position as the camera
    this.object.position.copy(this.camera.position);

    // Create a bounding box
    this.boundingBox = new THREE.Box3().setFromObject(this.object);
  }

  update(room: Lobby): void {
    const prevPlayerPos = this.object.position.clone();

    this.syncPositionWithCamera();
    this.boundingBox = new THREE.Box3().setFromObject(this.object);
    // console.clear();
    // console.log(this.object.position);
    // console.log("From bounding box update", room.boundingBoxes, "My position", this.boundingBox);
    for (const { box } of room.boundingBoxes) {
        // console.log("Boxes iteration", box, "My position", this.boundingBox);
        if (this.boundingBox.intersectsBox(box)) {
            // console.log("box is", box)
            // console.log(`Collision with room ${room}, and the box name ${box}`);
            // console.log(`current list of boundingboxes: ${room.boundingBoxes} and length is ${room.boundingBoxes.length}`)
            this.resetPosition(prevPlayerPos);
            break;
        }
    }
}

private syncPositionWithCamera(): void {
    this.object.position.set(
        this.camera.position.x,
        this.camera.position.y, // Adjust Y for player height
        this.camera.position.z
    );
}

// private handleDoorCollision(object: THREE.Object3D): void {
//     console.log("Player collided with a door. Opening...");
//     console.log("the object is", object)
//     console.log("let's see animations length", object.animations.length);

//     if (object.animations.length > 0) {
//         console.log("Okay Some animation works!!")
//         const mixer = new THREE.AnimationMixer(object);
//         const clip = object.animations[0]; // Assuming first animation is door opening
//         const action = mixer.clipAction(clip);
//         action.setLoop(THREE.LoopOnce, 1);
//         action.clampWhenFinished = true;
//         action.play();
//     }
// }

private resetPosition(prevPlayerPos: THREE.Vector3): void {
    this.object.position.copy(prevPlayerPos);
    this.camera.position.copy(prevPlayerPos);
    this.boundingBox.setFromObject(this.object);
}

}
