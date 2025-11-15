import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { degToRad } from 'three/src/math/MathUtils.js';
import { enableShadows, onError } from '../helpers/functionHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ColorGUIHelper } from '../helpers/classHelper';

const loader = new GLTFLoader();
const gui = new GUI();

export function loadScene2(scene, models) {
    // Background
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/backgrounds/drakensberg_solitary_mountain_puresky_2k.jpg', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
    });

    // Lights
    const ambientLight = new THREE.AmbientLight("#ffffff", 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(-100, 21.5, -45.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    directionalLight.shadow.mapSize.width = 2048 * 3;
    directionalLight.shadow.mapSize.height = 2048 * 3;

    directionalLight.shadow.camera.near = -500;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.shadow.camera.left = -500;
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.bottom = -500;

    const dirHelper = new THREE.DirectionalLightHelper(directionalLight);
    const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(dirHelper, shadowHelper);

    scene.userData.directionalLightHelper = dirHelper;
    scene.userData.shadowHelper = shadowHelper;

    const lightFolder = gui.addFolder("Lights");

    const ambientFolder = lightFolder.addFolder("Ambient Light");
    ambientFolder.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value');
    ambientFolder.add(ambientLight, "intensity", 0, 5, 0.01);

    const dirFolder = lightFolder.addFolder("Directional Light");
    dirFolder.addColor(new ColorGUIHelper(directionalLight, 'color'), 'value');
    dirFolder.add(directionalLight, "intensity", 0, 10, 0.1);
    dirFolder.add(directionalLight.position, "x", -100, 100, 0.1);
    dirFolder.add(directionalLight.position, "y", -100, 100, 0.1);
    dirFolder.add(directionalLight.position, "z", -100, 100, 0.1);

    // 3D Object Loads
    loader.load('/environment/american_road.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.1, 0.1, 0.1);
        model.position.set(0, -20, 0);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/animated_roller_coaster.glb', (gltf) => {
        console.log(gltf.animations);
        const model = gltf.scene;
        model.scale.set(1.2, 1.2, 1.2);
        model.position.set(-160, 0, 80);
        model.rotation.x = degToRad(-0.1);
        model.rotation.y = degToRad(180);
        enableShadows(model);
        scene.add(model);
        const mixer = new THREE.AnimationMixer(model);
        const clip = THREE.AnimationClip.findByName(gltf.animations, "Scene");
        if (clip) {
            const action = mixer.clipAction(clip);
            action.play();
        }
        scene.userData.mixer = mixer;
    }, undefined, onError);
}