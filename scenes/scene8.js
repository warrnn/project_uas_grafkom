import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { enableShadows, onError } from '../helpers/functionHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ColorGUIHelper } from '../helpers/classHelper';
import { degToRad } from 'three/src/math/MathUtils.js';

const initCameraPosition = {
    x: 205.3169959514357,
    y: -102.32972364777385,
    z: 82.11725984229953
}
const initControlTarget = {
    x: 41.062166589083596,
    y: 14.40585807157217,
    z: 40.21068483743733
}

const initDirectionalLightPosition = {
    x: -100,
    y: 13.9,
    z: 100
}

const initDirectionalLightColor = {
    r: 255,
    g: 216,
    b: 60
}

export function loadScene8(scene, models, mixers, camera, controls) {
    const loader = new GLTFLoader();
    const gui = new GUI();

    /* Fog */
    const fogNear = 0.1;
    const fogFar = 1000;
    scene.fog = new THREE.Fog("rgba(255, 255, 255, 1)", fogNear, fogFar);

    /* Camera */
    camera.position.set(initCameraPosition.x, initCameraPosition.y, initCameraPosition.z);

    /* Controls */
    controls.target.set(initControlTarget.x, initControlTarget.y, initControlTarget.z);
    controls.minDistance = 0.1;
    controls.maxDistance = 1000;
    controls.enablePan = true;
    controls.update();

    /* Background */
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/backgrounds/bg_scene_5.jpg', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
    });

    /* Lights */
    const ambientLight = new THREE.AmbientLight("#ffda24", 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(`rgba(${initDirectionalLightColor.r}, ${initDirectionalLightColor.g}, ${initDirectionalLightColor.b}, 1)`, 2);
    directionalLight.position.set(initDirectionalLightPosition.x, initDirectionalLightPosition.y, initDirectionalLightPosition.z);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    scene.userData.directionalLight = directionalLight;

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
    loader.load('/environment/flatiron_building.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(-75, 75, 75);
        model.position.set(0, 0, 0);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);
}

export function loadAnimationScene8(models, scene, camera, controls, delta) {
    const directionalLight = scene.userData.directionalLight;

    const moveSpeed = 20 * delta;
    directionalLight.position.x += moveSpeed;

    const colorChangeSpeed = 0.5 * delta;

    if (directionalLight.color.g < 1.0) {
        directionalLight.color.g += colorChangeSpeed * 0.2;
    }

    if (directionalLight.color.b < 1.0) {
        directionalLight.color.b += colorChangeSpeed;
    }

    controls.target.z -= 0.03;

    if (directionalLight.position.x >= 100) {
        // Reset Posisi
        directionalLight.position.set(
            initDirectionalLightPosition.x,
            initDirectionalLightPosition.y,
            initDirectionalLightPosition.z
        );

        controls.target.set(initControlTarget.x, initControlTarget.y, initControlTarget.z);

        // R: 255 -> 1.0
        // G: 216 -> 0.847
        // B: 60  -> 0.235
        directionalLight.color.setRGB(1.0, 0.847, 0.235);
    }
}
