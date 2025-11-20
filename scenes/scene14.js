import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { enableShadows, onError } from '../helpers/functionHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ColorGUIHelper, FogGUIHelper } from '../helpers/classHelper';
import { degToRad } from 'three/src/math/MathUtils.js';

const initCameraPosition = {
    x: -8.06093913699187,
    y: 1.2216474566917073,
    z: -4.890258323003113
}

const initControlTarget = {
    x: -2.236312628355929,
    y: 2.8077787710725377,
    z: -5.3598373626552505
}

const initDirectionalLightPosition = {
    x: 100,
    y: 87.8,
    z: -1.8
}

export function loadScene14(scene, models, mixers, camera, controls) {
    const loader = new GLTFLoader();
    const gui = new GUI();

    /* Fog */
    const fogNear = 0.1;
    const fogFar = 30;
    const fogColor = new THREE.Color("rgba(255, 246, 180, 1)");
    scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
    const fogGUIHelper = new FogGUIHelper(scene.fog);
    const fogFolder = gui.addFolder('Fog');
    fogFolder.add(fogGUIHelper, 'near', fogNear, 1000).listen();
    fogFolder.add(fogGUIHelper, 'far', fogNear, 1000).listen();

    /* Camera */
    // camera.fov = 150;
    // camera.updateProjectionMatrix();
    camera.position.set(initCameraPosition.x, initCameraPosition.y, initCameraPosition.z);

    /* Controls */
    controls.target.set(initControlTarget.x, initControlTarget.y, initControlTarget.z);
    controls.minDistance = 0.1;
    controls.maxDistance = 2000;
    controls.enablePan = true;
    controls.update();

    /* Background */
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/backgrounds/Golden-Gate-San-Fran-1.jpg', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
    });

    /* Lights */
    const ambientLight = new THREE.AmbientLight("#ffda24", 5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
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
    dirFolder.add(directionalLight.position, "y", 0, 200, 0.1);
    dirFolder.add(directionalLight.position, "z", -100, 100, 0.1);

    /* 3D Object Loads */
    loader.load('/environment/park.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);
        model.rotation.y = degToRad(30);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/characters/Sarcastic Head Nod Niko Bellic.glb', (gltf) => {
        const model = gltf.scene;

        model.scale.set(10, 10, 10);

        const parent = new THREE.Group();
        parent.add(model);
        parent.scale.set(10, 10, 10);
        parent.position.set(-7, 0, -5);
        parent.rotation.y = degToRad(-70);

        model.traverse(obj => {
            if (obj.isMesh) {
                obj.frustumCulled = false;
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });

        enableShadows(model);
        scene.add(parent);
        models.push(parent);

        const mixer = new THREE.AnimationMixer(model);
        const clip = THREE.AnimationClip.findByName(gltf.animations, "head_turn");

        if (clip) {
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopRepeat);
            action.play();
        }

        mixers.push(mixer);
    }, undefined, onError);

    loader.load('/environment/hl._anna.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(2, 2, 2);
        model.position.set(-3.5, -0.5, -9);
        model.rotation.y = degToRad(30);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);
}

let sceneTimer = 0;

export function loadAnimationScene14(models, scene, camera, controls, delta) {
    sceneTimer += delta;

    camera.position.z += 0.001;
    controls.target.z -= 0.003;

    if (sceneTimer >= 6) {
        camera.position.set(initCameraPosition.x, initCameraPosition.y, initCameraPosition.z);
        controls.target.set(initControlTarget.x, initControlTarget.y, initControlTarget.z);

        sceneTimer = 0;
    }
}
