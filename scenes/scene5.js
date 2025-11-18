import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { enableShadows, onError } from '../helpers/functionHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ColorGUIHelper } from '../helpers/classHelper';
import { degToRad } from 'three/src/math/MathUtils.js';
import { directionToColor } from 'three/tsl';

const initCameraPosition = {
    x: -49.7877424540999,
    y: 28.33825913226577,
    z: 126.02614938612629
}

const initControlTarget = {
    x: 29.23791713683823,
    y: 77.57198668771619,
    z: 34.32771986500659
}

const initAmbientLightColor = {
    r: 255,
    g: 216,
    b: 60
}

const initDirectionalLightPosition = {
    x: 100,
    y: 13.9,
    z: 79.1
}

export function loadScene5(scene, models, mixers, camera, controls) {
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
    const ambientLight = new THREE.AmbientLight(`rgba(${initAmbientLightColor.r}, ${initAmbientLightColor.g}, ${initAmbientLightColor.b}, 1)`, 0.5);
    scene.add(ambientLight);
    scene.userData.ambientLight = ambientLight;

    const directionalLight = new THREE.DirectionalLight(`rgba(255, 255, 255, 1)`, 7.5);
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

    loader.load('/environment/church.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(3, 3, 3);
        model.position.set(0, 0, 0);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/modern_office_building_2.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(275, 275, 325);
        model.position.set(140, 0, 60);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/brooklyn_street_building_low_poly.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(7, 7, 7);
        model.position.set(65, 0, -60);
        model.rotation.y = Math.PI / 2;
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/skyscaper_low_poly.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(4, 4, 4);
        model.position.set(-50, -15, -90);
        model.rotation.y = Math.PI / 2;
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/trees_low_poly.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.04, 0.04, 0.04);
        model.position.set(30, 0, 70);
        model.rotation.y = degToRad(45);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/trees_low_poly.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.04, 0.04, 0.04);
        model.position.set(-60, 0, 50);
        model.rotation.y = degToRad(90);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);
}

export function loadAnimationScene5(models, scene, camera, controls, delta) {
    const ambientLight = scene.userData.ambientLight;
    const directionalLight = scene.userData.directionalLight;

    if (ambientLight && directionalLight) {
        const moveSpeed = 20 * delta;
        const colorSpeed = 0.1 * delta;

        if (ambientLight.color.g < 1.0) ambientLight.color.g += colorSpeed;
        if (ambientLight.color.b < 1.0) ambientLight.color.b += colorSpeed;

        directionalLight.position.x -= moveSpeed;

        if (scene.userData.directionalLightHelper) {
            scene.userData.directionalLightHelper.update();
        }

        if (directionalLight.position.x <= -100) {
            directionalLight.position.x = initDirectionalLightPosition.x;
            ambientLight.color.set(`rgb(${initAmbientLightColor.r}, ${initAmbientLightColor.g}, ${initAmbientLightColor.b})`);
            camera.position.set(initCameraPosition.x, initCameraPosition.y, initCameraPosition.z);  
            controls.target.set(initControlTarget.x, initControlTarget.y, initControlTarget.z);
        }
    }
}
