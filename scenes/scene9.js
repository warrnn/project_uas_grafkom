import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { enableShadows, onError } from '../helpers/functionHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ColorGUIHelper } from '../helpers/classHelper';
import { degToRad } from 'three/src/math/MathUtils.js';

export function loadScene9(scene, models, mixers) {
    const loader = new GLTFLoader();
    const gui = new GUI();

    /* Background */
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/backgrounds/bg_scene_3.jpg', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
    });

    /* Lights */
    const ambientLight = new THREE.AmbientLight("#ffda24", 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(58.2, 100, -100);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    directionalLight.shadow.camera.near = -500;
    directionalLight.shadow.camera.far = 500;
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

    /* 3D Object Loads */
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: "rgba(100, 100, 100, 1)",
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 0, 0);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    loader.load('/environment/metlife_building.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(3, 2, 2);
        model.position.set(-55, 0, 0);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/chrysler_building.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.1, 1.1, 1.1);
        model.position.set(60, 0, 0);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/modern_office_building_2.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(90, 125, 125);
        model.position.set(15, 0, 0);
        model.rotation.y = degToRad(180);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/modern_office_building_2.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(125, 225, 125);
        model.position.set(60, 0, 80);
        model.rotation.y = degToRad(90);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/chrysler_building.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 0.7, 1);
        model.position.set(-115, 0, -50);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);
}

export function loadAnimationScene9(models, scene) {

}
