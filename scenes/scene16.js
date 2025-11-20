import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { enableShadows, onError } from '../helpers/functionHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ColorGUIHelper } from '../helpers/classHelper';
import { degToRad } from 'three/src/math/MathUtils.js';

const initCameraPosition = {
    x: 6.600253713569913,
    y: 1.398718853890755,
    z: 1.1931117080100324
}

const initControlTarget = {
    x: 43.497700387591024,
    y: 1.1531623659259078,
    z: -2.285297834986216
}

const initDirectionalLightPosition = {
    x: -100,
    y: -22.7,
    z: -43
}

export function loadScene16(scene, models, mixers, camera, controls) {
    const loader = new GLTFLoader();
    const gui = new GUI();

    /* Fog */
    const fogNear = 0.1;
    const fogFar = 100;
    scene.fog = new THREE.Fog("rgba(115, 115, 115, 1)", fogNear, fogFar);

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
    const ambientLight = new THREE.AmbientLight("#fefcbe", 3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
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
    dirFolder.add(directionalLight.position, "y", -100, 100, 0.1);
    dirFolder.add(directionalLight.position, "z", -100, 100, 0.1);

    /* 3D Object Loads */
    // const waterTextureLoader = new THREE.TextureLoader();
    // const groundTexture = waterTextureLoader.load('/textures/close-up-dark-wavy-water.jpg');
    // groundTexture.wrapS = THREE.RepeatWrapping;
    // groundTexture.wrapT = THREE.RepeatWrapping;
    // groundTexture.repeat.set(1, 1);

    // const planeGeometry = new THREE.PlaneGeometry(2500, 2500);
    // const planeMaterial = new THREE.MeshStandardMaterial({
    //     map: groundTexture,
    //     roughness: 1,
    //     metalness: 0,
    //     side: THREE.DoubleSide
    // });

    // const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.position.set(0, -12, 0);
    // plane.rotation.x = -Math.PI / 2;
    // plane.receiveShadow = true;
    // scene.add(plane);

    loader.load('/environment/brooklyn_bridge.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/characters/Walking Niko Bellic.glb', (gltf) => {
        const model = gltf.scene;

        model.scale.set(10, 10, 10);

        const parent = new THREE.Group();
        parent.add(model);
        parent.scale.set(10, 10, 10);
        parent.position.set(11, 0, -0.3);
        parent.rotation.y = degToRad(90);

        model.traverse(obj => {
            if (obj.isMesh) {
                obj.frustumCulled = false;
            }
        });

        enableShadows(model);
        scene.add(parent);
        models.push(parent);

        const mixer = new THREE.AnimationMixer(model);
        const clip = THREE.AnimationClip.findByName(gltf.animations, "walk");

        if (clip) {
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopRepeat);
            action.play();
        }

        mixers.push(mixer);
    }, undefined, onError);
}

let sceneTimer = 0;

export function loadAnimationScene16(models, scene, camera, controls, delta) {
    const niko_bellic = models[0];
    const directionalLight = scene.userData.directionalLight;

    sceneTimer += delta;

    camera.position.x += 0.007;
    niko_bellic.position.x += 0.015;
    directionalLight.position.z -= 0.1;
    if (sceneTimer >= 8) {
        camera.position.set(initCameraPosition.x, initCameraPosition.y, initCameraPosition.z);
        niko_bellic.position.set(11, 0, -0.3);
        directionalLight.position.set(initDirectionalLightPosition.x, initDirectionalLightPosition.y, initDirectionalLightPosition.z);
        // controls.target.set(initControlTarget.x, initControlTarget.y, initControlTarget.z);

        sceneTimer = 0;
    }
}
