import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { enableShadows, onError } from '../helpers/functionHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ColorGUIHelper, FogGUIHelper } from '../helpers/classHelper';
import { degToRad } from 'three/src/math/MathUtils.js';

const initCameraPosition = {
    x: -104.58017853321374,
    y: 70.4597582949414,
    z: 139.12282531625027
}
const initControlTarget = {
    x: -16.139746220212395,
    y: 122.26380292087225,
    z: 4.8940326643477166
}

const initDirectionalLightPosition = {
    x: -20,
    y: -50,
    z: 100
}

export function loadScene9(scene, models, mixers, camera, controls) {
    const loader = new GLTFLoader();
    const gui = new GUI();

    /* Fog */
    const fogNear = 0.1;
    const fogFar = 600;
    const fogColor = new THREE.Color("rgba(153, 153, 153, 1)");
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
    controls.maxDistance = 2000;
    controls.enablePan = true;
    controls.update();

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

export function loadAnimationScene9(models, scene, camera, controls, delta) {
    const directionalLight = scene.userData.directionalLight;

    directionalLight.position.y += 0.2;

    if (directionalLight.position.y > 100) {
        directionalLight.position.set(initDirectionalLightPosition.x, initDirectionalLightPosition.y, initDirectionalLightPosition.z);
    }
}
