import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { degToRad } from 'three/src/math/MathUtils.js';
import { enableShadows, onError } from '../helpers/functionHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ColorGUIHelper } from '../helpers/classHelper';

const loader = new GLTFLoader();
const gui = new GUI();

export function loadScene1(scene, models) {
    // Background
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/backgrounds/your_image.jpg', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
    });

    // Lights
    const ambientLight = new THREE.AmbientLight("#fec96c", 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(-10, 10, -50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 160;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;

    const dirHelper = new THREE.DirectionalLightHelper(directionalLight);
    const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(dirHelper, shadowHelper);

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
    const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    loader.load('/environment/new_york_building.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.01, 0.01, 0.01);
        model.position.set(0, -1, 0);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/new_york_building.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.01, 0.01, 0.01);
        model.position.set(0, -1, 12);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/brooklyn_street_cornerhouse_low_poly.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5);
        model.position.set(-5, 0, 22);
        model.rotation.y = Math.PI / 2;
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/brooklyn_street_cornerhouse_low_poly.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5);
        model.position.set(2, 0, -26);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/rail_bridge_reworked.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(70, 70, 70);
        model.rotation.y = Math.PI / 2;

        const railBridgePositions = [
            { x: -17, y: 5, z: -40 },
            { x: -17, y: 5, z: 0 },
            { x: -17, y: 5, z: 40 },
            { x: -17, y: 5, z: 80 },
        ];

        railBridgePositions.forEach(pos => {
            const clone = model.clone();
            clone.position.set(pos.x, pos.y, pos.z);
            enableShadows(clone);
            scene.add(clone);
        });
    }, undefined, onError);

    loader.load('/environment/brooklyn_street_building_low_poly.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5);
        model.position.set(-45, 0, 0);
        model.rotation.y = degToRad(180);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/billboard_.psd_layered_texture_maps_included.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(5, 5, 5);
        model.position.set(-30, 0, -40);
        model.rotation.y = degToRad(45);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/cartoon_cyberpunk_building.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(5, 5, 5);
        model.position.set(-35, 0, -50);
        model.rotation.y = degToRad(-90);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/whitehall_building.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.7, 0.7, 0.7);
        model.position.set(5, 0, 55);
        model.rotation.y = degToRad(90);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/new_york_buildings.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(15, 15, 15);
        model.position.set(20, 0, -60);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/brooklyn_street_building_low_poly.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5);
        model.position.set(-5, 0, -70);
        model.rotation.y = degToRad(180);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/subway_train.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(80, 80, 80);
        model.position.set(-12.5, 7, -20);
        model.rotation.y = degToRad(-1);
        enableShadows(model);
        scene.add(model);
        models.push(model);
    }, undefined, onError);
}
