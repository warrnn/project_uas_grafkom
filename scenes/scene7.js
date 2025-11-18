import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { enableShadows, onError } from '../helpers/functionHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ColorGUIHelper } from '../helpers/classHelper';
import { degToRad } from 'three/src/math/MathUtils.js';

const initCameraPosition = {
    x: -6.279307144445831,
    y: 216.8653212232441,
    z: 123.74911888094493
}
const initControlTarget = {
    x: 56.96193866054978,
    y: 315.0435254510628,
    z: -34.87994566968157
}

const initAmbientLightColor = {
    r: 255,
    g: 187,
    b: 0
}

const initDirectionalLightPosition = {
    x: 30,
    y: 13.9,
    z: -100
}

export function loadScene7(scene, models, mixers, camera, controls) {
    const loader = new GLTFLoader();
    const gui = new GUI();

    /* Fog */
    const fogNear = 0.1;
    const fogFar = 1000;
    // scene.fog = new THREE.Fog("rgba(255, 255, 255, 1)", fogNear, fogFar);

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
    textureLoader.load('/backgrounds/bg_scene_6.jpg', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
    });

    /* Lights */
    const ambientLight = new THREE.AmbientLight(`rgba(${initAmbientLightColor.r}, ${initAmbientLightColor.g}, ${initAmbientLightColor.b}, 1)`, 1);
    scene.add(ambientLight);
    scene.userData.ambientLight = ambientLight;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(30, 13.9, -100);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    scene.userData.directionalLight = directionalLight;

    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    directionalLight.shadow.camera.near = -500;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -400;
    directionalLight.shadow.camera.right = 400;
    directionalLight.shadow.camera.top = 400;
    directionalLight.shadow.camera.bottom = -400;

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

    loader.load('/environment/chrysler_building.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(2, 2, 2);
        model.position.set(0, 0, 0);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);
}

export function loadAnimationScene7(models, scene, camera, controls, delta) {
    const ambientLight = scene.userData.ambientLight;
    const directionalLight = scene.userData.directionalLight;

    ambientLight.color.g += 0.001;
    ambientLight.color.b += 0.001;
    directionalLight.position.z += 0.3;
    if (directionalLight.position.z >= 100) {
        ambientLight.color.set(`rgb(${initAmbientLightColor.r}, ${initAmbientLightColor.g}, ${initAmbientLightColor.b})`);
        directionalLight.position.z = initDirectionalLightPosition.z;
    }
}
