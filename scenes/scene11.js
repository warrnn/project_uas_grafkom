import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { enableShadows, onError } from '../helpers/functionHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ColorGUIHelper, FogGUIHelper } from '../helpers/classHelper';
import { degToRad } from 'three/src/math/MathUtils.js';

const initCameraPosition = {
    x: 26.234010026312617,
    y: -35.160469685479576,
    z: 76.82257080358606
}

const initControlTarget = {
    x: -5.859465987329522,
    y: -22.23690042600154,
    z: 1.560147010783976
}

const initDirectionalLightPosition = {
    x: 100,
    y: 200,
    z: -67
}

export function loadScene11(scene, models, mixers, camera, controls) {
    const loader = new GLTFLoader();
    const gui = new GUI();

    /* Fog */
    const fogNear = 0.1;
    const fogFar = 1000;
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
    textureLoader.load('/backgrounds/bg_scene_6.jpg', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
    });

    /* Lights */
    const ambientLight = new THREE.AmbientLight("#ffda24", 0.1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 7.5);
    directionalLight.position.set(initDirectionalLightPosition.x, initDirectionalLightPosition.y, initDirectionalLightPosition.z);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    scene.userData.directionalLight = directionalLight;

    directionalLight.shadow.mapSize.width = 2048 * 3;
    directionalLight.shadow.mapSize.height = 2048 * 3;

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
    dirFolder.add(directionalLight.position, "y", 0, 200, 0.1);
    dirFolder.add(directionalLight.position, "z", -100, 100, 0.1);

    /* 3D Object Loads */
    loader.load('/environment/abandoned_factory.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(10, 10, 10);
        model.position.set(0, 0, 0);

        // enableShadows(model);

        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                // Material transparan ATAU nama mesh mengandung kata 'glass'/'window'
                const isGlass = child.material.transparent === true ||
                    child.material.opacity < 1.0 ||
                    child.name.toLowerCase().includes('glass') ||
                    child.name.toLowerCase().includes('window') ||
                    child.name.toLowerCase().includes('kaca');

                if (isGlass) {
                    child.castShadow = false;
                    child.material.side = THREE.DoubleSide;
                    // child.material.depthWrite = false; 
                }
            }
        });

        scene.add(model);
    }, undefined, onError);
}

export function loadAnimationScene11(models, scene, camera, controls, delta) {
    const directionalLight = scene.userData.directionalLight;

    camera.position.x -= 0.1;
    directionalLight.position.x -= 0.5;
    if (directionalLight.position.x <= -100) {
        camera.position.set(initCameraPosition.x, initCameraPosition.y, initCameraPosition.z);
        controls.target.set(initControlTarget.x, initControlTarget.y, initControlTarget.z);
        directionalLight.position.set(initDirectionalLightPosition.x, initDirectionalLightPosition.y, initDirectionalLightPosition.z);
    }
}
