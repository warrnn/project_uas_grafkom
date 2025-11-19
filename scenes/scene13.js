import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { enableShadows, onError } from '../helpers/functionHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ColorGUIHelper, FogGUIHelper } from '../helpers/classHelper';
import { degToRad } from 'three/src/math/MathUtils.js';

const initCameraPosition = {
    x: 47.2175565064213,
    y: 72.94352936837986,
    z: 19.922710747347658
}

const initControlTarget = {
    x: -36.683805726224655,
    y: 6.572388730472909,
    z: -43.88103005457823
}

const initDirectionalLightPosition = {
    x: 32.1,
    y: 100,
    z: -7
}

export function loadScene13(scene, models, mixers, camera, controls) {
    const loader = new GLTFLoader();
    const gui = new GUI();

    /* Fog */
    const fogNear = 0.1;
    const fogFar = 1000;
    const fogColor = new THREE.Color("rgba(255, 255, 255, 1)");
    scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
    const fogGUIHelper = new FogGUIHelper(scene.fog);
    const fogFolder = gui.addFolder('Fog');
    fogFolder.add(fogGUIHelper, 'near', fogNear, 1000).listen();
    fogFolder.add(fogGUIHelper, 'far', fogNear, 1000).listen();

    /* Camera */
    camera.position.set(initCameraPosition.x, initCameraPosition.y, initCameraPosition.z);

    /* Controls */
    controls.target.set(initControlTarget.x, initControlTarget.y, initControlTarget.z);
    controls.minDistance = 0.1;
    controls.maxDistance = 3000;
    controls.enablePan = true;
    controls.update();

    /* Background */
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/backgrounds/bg_scene_6.jpg', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
    });

    /* Lights */
    const ambientLight = new THREE.AmbientLight("#fffbe5", 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(initDirectionalLightPosition.x, initDirectionalLightPosition.y, initDirectionalLightPosition.z);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    scene.userData.directionalLight = directionalLight;

    directionalLight.shadow.mapSize.width = 2048 * 3;
    directionalLight.shadow.mapSize.height = 2048 * 3;

    directionalLight.shadow.camera.near = -1500;
    directionalLight.shadow.camera.far = 1500;
    directionalLight.shadow.camera.left = -1500;
    directionalLight.shadow.camera.right = 1500;
    directionalLight.shadow.camera.top = 1500;
    directionalLight.shadow.camera.bottom = -1500;

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
    dirFolder.add(directionalLight.position, "y", 0, 200, 0.1);
    dirFolder.add(directionalLight.position, "z", -100, 100, 0.1);

    /* 3D Object Loads */
    const waterTextureLoader = new THREE.TextureLoader();
    const groundTexture = waterTextureLoader.load('/textures/water-viewed-from.jpg');
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(1, 1);

    const planeGeometry = new THREE.PlaneGeometry(2500, 2500);
    const planeMaterial = new THREE.MeshStandardMaterial({
        map: groundTexture,
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, -35, 0);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    loader.load('/environment/san_francisco_bridge.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/san_francisco_bridge.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, -45);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    // 1
    loader.load('/things/lct_3000_95_-_low_poly_model.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(2, 2, 2);
        model.position.set(-30, 33.5, 4);
        enableShadows(model);
        scene.add(model);
        models[0] = model;
    }, undefined, onError);

    // 2
    loader.load('/things/illinois_90_taxi_1_-_low_poly_model.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(2, 2, 2);
        model.position.set(0, 33.5, -4);
        enableShadows(model);
        scene.add(model);
        models[1] = model;
    }, undefined, onError);

    // 3
    loader.load('/things/lct_3000_95_-_low_poly_model.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(2, 2, 2);
        model.position.set(20, 33.5, -49);
        model.rotation.y = degToRad(180);
        enableShadows(model);
        scene.add(model);
        models[2] = model;
    }, undefined, onError);

    // 4
    loader.load('/things/illinois_90_taxi_1_-_low_poly_model.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(2, 2, 2);
        model.position.set(30, 33.5, -41);
        model.rotation.y = degToRad(180);
        enableShadows(model);
        scene.add(model);
        models[3] = model;
    }, undefined, onError);
}

export function loadAnimationScene13(models, scene, camera, controls, delta) {
    const directionalLight = scene.userData.directionalLight;

    directionalLight.position.y -= 0.5;
    directionalLight.position.z += 0.3;

    camera.position.x += 0.1;
    controls.target.x += 0.1;

    models.forEach(car => {
        if (car.rotation.y != degToRad(180)) {
            car.position.x += 0.15;
        } else {
            car.position.x -= 0.15;
        }
    });

    if (models[0].position.x >= 20) {
        directionalLight.position.set(initDirectionalLightPosition.x, initDirectionalLightPosition.y, initDirectionalLightPosition.z);
        camera.position.set(initCameraPosition.x, initCameraPosition.y, initCameraPosition.z);
        controls.target.set(initControlTarget.x, initControlTarget.y, initControlTarget.z);
        models[0].position.set(-30, 33.5, 4);
        models[1].position.set(0, 33.5, -4);
        models[2].position.set(20, 33.5, -49);
        models[3].position.set(30, 33.5, -41);
    }
}
