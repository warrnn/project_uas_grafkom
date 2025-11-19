import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { enableShadows, generateRandomTaxiPositions, onError } from '../helpers/functionHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ColorGUIHelper, FogGUIHelper } from '../helpers/classHelper';
import { degToRad } from 'three/src/math/MathUtils.js';

const initCameraPosition = {
    x: 15.2996996560379,
    y: 1.3345650279707628,
    z: 15.444631613771353
}

const initControlTarget = {
    x: 15.159468850559618,
    y: 2.4753949611665518,
    z: -5.260446826811867
}

const initDirectionalLightPosition = {
    x: -100,
    y: 22.5,
    z: 100
}

const taxisCount = 10;
const taxiPosition = generateRandomTaxiPositions(taxisCount);

export function loadScene12(scene, models, mixers, camera, controls) {
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
    const ambientLight = new THREE.AmbientLight("#fefbec", 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
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
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: "rgba(100, 100, 100, 1)",
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, -0.8, 0);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    loader.load('/environment/intersectioncrossroadperempatan.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);
        model.rotation.y = degToRad(-90);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/time_square_building.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.08, 0.08, 0.08);
        model.position.set(16, 0, -11.6);
        model.rotation.y = degToRad(-90);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/fenton_movie_theater_-_by_papermau.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.3, 0.3, 0.3);
        model.position.set(31, -2, -16.1);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/whitehall_building copy.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.4, 0.4);
        model.position.set(-4.2, -0.5, -19);
        model.rotation.y = degToRad(-90);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/time_square_building.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.08, 0.08, 0.08);
        model.position.set(55.5, 0, -16.4);
        model.rotation.y = degToRad(0);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    taxiPosition.forEach((position) => {
        loader.load('/things/illinois_90_taxi_1_-_low_poly_model.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(position.x, position.y, position.z);
            model.rotation.y = degToRad(position.rotate);
            enableShadows(model);
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material.transparent = true;
                    child.material.opacity = position.opacity;
                }
            });
            scene.add(model);
            models.push(model)
        }, undefined, onError);
    });

}

export function loadAnimationScene12(models, scene, camera, controls, delta) {
    const taxis = models

    if (taxis.length < taxisCount) return;

    taxis.forEach((taxi, index) => {
        const speed = 0.4 + index * 0.1;
        if (taxi.rotation.y === 0) {
            taxi.position.x += speed;
        } else {
            taxi.position.x -= speed;
        }

        if (taxi.position.x > 40 || taxi.position.x < -2) {
            const newPos = generateRandomTaxiPositions(1)[0];

            taxi.position.set(newPos.x, newPos.y, newPos.z);
            taxi.rotation.y = degToRad(newPos.rotate);

            taxi.traverse((child) => {
                if (child.isMesh) {
                    child.material.opacity = newPos.opacity;
                }
            });
        }
    });
}
