import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { degToRad } from 'three/src/math/MathUtils.js';
import { enableShadows, onError } from '../helpers/functionHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ColorGUIHelper } from '../helpers/classHelper';

export function loadScene3(scene, models, mixers) {
    const loader = new GLTFLoader();
    const gui = new GUI();

    // Background
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/backgrounds/drakensberg_solitary_mountain_puresky_2k.jpg', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
    });

    // Lights
    const ambientLight = new THREE.AmbientLight("#e2bf60", 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(97.4, 81.7, 97.4);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const carPointLight1 = new THREE.PointLight("#fe0000", 5, 100);
    carPointLight1.position.set(-31, 1, 3.7);
    const carPointLight2 = new THREE.PointLight("#fe0000", 5, 100);
    carPointLight2.position.set(-31, 1, 5.4);
    scene.add(carPointLight1, carPointLight2);

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
    const pointLightHelper = new THREE.PointLightHelper(carPointLight1, 1);
    // scene.add(dirHelper, shadowHelper, pointLightHelper);

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

    const pointFolder = lightFolder.addFolder("Point Light");
    pointFolder.add(carPointLight1, "intensity", 0, 10, 0.1);
    pointFolder.add(carPointLight1.position, "x", -100, 100, 0.1);
    pointFolder.add(carPointLight1.position, "y", -100, 100, 0.1);
    pointFolder.add(carPointLight1.position, "z", -100, 100, 0.1);

    const pointFolder2 = lightFolder.addFolder("Point Light 2");
    pointFolder2.add(carPointLight2, "intensity", 0, 10, 0.1);
    pointFolder2.add(carPointLight2.position, "x", -100, 100, 0.1);
    pointFolder2.add(carPointLight2.position, "y", -100, 100, 0.1);
    pointFolder2.add(carPointLight2.position, "z", -100, 100, 0.1);

    // 3D Object Loads
    loader.load('/environment/city.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(2, 2, 2);
        model.position.set(0, 0, 0);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/things/carter_98_-_low_poly_model.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.4, 1.4, 1.4);
        model.position.set(-20, 0, 0.75);
        model.rotation.y = degToRad(180);
        enableShadows(model);
        scene.add(model);
        models.push(model);
    }, undefined, onError);

    loader.load('/things/carter_98_-_low_poly_model.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.4, 1.4, 1.4);
        model.position.set(-15, 0, 0.75);
        model.rotation.y = degToRad(-90);
        enableShadows(model);
        scene.add(model);
        models.push(model);
    }, undefined, onError);

    loader.load('/things/carter_98_-_low_poly_model.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.4, 1.4, 1.4);
        model.position.set(-27.5, 0, 4.5);
        model.rotation.y = degToRad(0);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);
}

export function loadAnimationScene3(models) {
    if (models.length < 2) return;
    const main_car = models[0];
    const other_car1 = models[1];
    if (main_car && other_car1) {
        main_car.position.x -= 0.1;
        other_car1.position.z += 0.05;
        if (main_car.position.x < -50) {
            main_car.position.x = -20;
            other_car1.position.z = -10;
        }
    }
}