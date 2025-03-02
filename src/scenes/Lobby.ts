import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class Lobby {
  scene: THREE.Scene;
  loader: GLTFLoader;
  lobbyModel: THREE.Object3D; // Allow undefined initially
  boundingBoxes: {box: THREE.Box3, obj: THREE.Mesh}[] = []; // Store bounding boxes
  ready: Promise<void>;
  private modelScale: [number, number, number] = [2, 1, 1];


  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.loader = new GLTFLoader();
    this.ready = this.init();

  }

  private async init() {
    await this.loadLobby();
    this.createBoundingBoxes()
  }

  private async loadLobby() {
    try {
      const gltf = await this.loadGLTF("/UpasnaNew1.glb");
      const model = gltf; // No type error now
      console.log(model);
      // model.scale.set(...this.modelScale);
      this.lobbyModel = model;
      // this.lobbyModel.traverse((child) => {
      //   console.log("child's name", child.name);
      //     if(child.name !== "LobbyEast"){
      //       this.scene.add(child);
      //     }
      // })
      this.scene.add(this.lobbyModel);
      console.log("Lobby Loaded");
    } catch (error) {
      console.error("Error loading lobby:", error);
    }
  }

  private loadGLTF(modelPath: string): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        modelPath,
        (gltf) => resolve(gltf.scene as THREE.Object3D), // Correctly returning gltf.scene
        undefined,
        (error) => reject(error)
      );
    });
  }

  private createBoundingBoxes(): void {
    // this.lobbyModel.traverse((child) => {
    //   if (child instanceof THREE.Mesh && child.name !== "Plane004") {
    //     child.material.color.set(0xff00ff); // Magenta color
    //   }})
    
    this.lobbyModel.traverse((child) => {
      console.log("child's name is", child.name, "instance is", child.type);
        if (child instanceof THREE.Mesh && child.name !== "Ground") {
            child.updateMatrixWorld(true); // Ensure world transformations are applied

            // // Get the local bounding box
            const localBox = new THREE.Box3().setFromObject(child);
            // if (child.name == "Plane001"){
            //   const worldScale = new THREE.Vector3();
            //   child.getWorldScale(worldScale);
            //   console.log("worldscale is", worldScale)
  
            //   // Scale the bounding box manually
            //   const scaledMin = localBox.min.clone().multiply(worldScale);
            //   const scaledMax = localBox.max.clone().multiply(worldScale);
            //   const scaledBox = new THREE.Box3(scaledMin, scaledMax);
  
            //   this.boundingBoxes.push(scaledBox);
            //   const boxHelper = new THREE.Box3Helper(scaledBox, new THREE.Color(0xff0000));
            // this.scene.add(boxHelper);
            // }

            // Get world scale (scale applied to the object in the scene)
          //  else{
            this.boundingBoxes.push({box: localBox, obj: child});
            // Optional: Visualize the bounding box
            const boxHelper = new THREE.Box3Helper(localBox, new THREE.Color(0xff0000));
            this.scene.add(boxHelper);
        }
    });

    console.log("length", this.boundingBoxes.length);
    console.log("Bounding boxes generated:", this.boundingBoxes);
}

}
