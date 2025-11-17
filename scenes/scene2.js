import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { degToRad } from 'three/src/math/MathUtils.js';
import { enableShadows, onError } from '../helpers/functionHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ColorGUIHelper } from '../helpers/classHelper';

export function loadScene2(scene, models, mixers) {
    const loader = new GLTFLoader();
    const gui = new GUI();

    /* Background */
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/backgrounds/bg_scene_2.jpg', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
    });

    /* Lights */
    const ambientLight = new THREE.AmbientLight("#ffffff", 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(-100, 21.5, -45.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    directionalLight.shadow.mapSize.width = 2048 * 3;
    directionalLight.shadow.mapSize.height = 2048 * 3;

    directionalLight.shadow.camera.near = -500;
    directionalLight.shadow.camera.far = 1000;
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
    loader.load('/environment/american_road.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.1, 0.1, 0.1);
        model.position.set(0, -20, 0);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/animated_roller_coaster.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.2, 1.2, 1.2);
        model.position.set(-120, 1, 40);
        model.rotation.x = degToRad(-2);
        model.rotation.y = degToRad(180);
        model.rotation.z = degToRad(1);
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: "#ffffff",
                    metalness: 1.0,
                    roughness: 0.3
                });
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        scene.add(model);
        const mixer = new THREE.AnimationMixer(model);
        const clip = THREE.AnimationClip.findByName(gltf.animations, "Scene");
        if (clip) mixer.clipAction(clip).play();
        mixers.push(mixer);
    }, undefined, onError);

    loader.load('/things/generic_sedan_car.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(3, 3, 3);
        model.position.set(10, -3.3, -10);
        model.rotation.x = degToRad(-1);
        model.rotation.y = degToRad(180);
        enableShadows(model);
        scene.add(model);
        models.push(model);
    }, undefined, onError);

    loader.load('/characters/6e604109b07b4c789776535a8beabf0b.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(2, 2, 2);
        const parent = new THREE.Group();
        parent.add(model);
        parent.scale.set(2, 2, 2);
        parent.position.set(0, -2.5, 0);
        model.traverse((child) => {
            if (child.isMesh) {
                if (child.material) {
                    child.material.color.multiplyScalar(0.6);
                    child.material.needsUpdate = true;
                }
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        enableShadows(model);
        scene.add(parent);
        models.push(parent);
        const mixer = new THREE.AnimationMixer(model);
        const clip = THREE.AnimationClip.findByName(gltf.animations, "Take 001");
        if (clip) {
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopRepeat);
            action.play();
        }
        mixers.push(mixer);
    }, undefined, onError);

    loader.load('/characters/unarmed_walk_forward_2.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        const parent = new THREE.Group();
        parent.add(model);
        parent.scale.set(2, 2, 2);
        parent.position.set(0, -2.5, -5);
        model.traverse((child) => {
            if (child.isMesh) {
                if (child.material) {
                    child.material.color.multiplyScalar(0.4);
                    child.material.needsUpdate = true;
                }
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        enableShadows(model);
        scene.add(parent);
        models.push(parent);
        const mixer = new THREE.AnimationMixer(model);
        const clip = THREE.AnimationClip.findByName(gltf.animations, "mixamo.com");
        if (clip) {
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopRepeat);
            action.play();
        }
        mixers.push(mixer);
    }, undefined, onError);
}

export function loadAnimationScene2(models, scene) {
    const car = models[0];
    const walking_man_1 = models[1];
    const walking_man_2 = models[2];
    if (car && walking_man_1 && walking_man_2) {
        car.position.y += 0.006;
        car.position.z += 0.2;
        car.rotation.x -= 0.000009;
        walking_man_1.position.y += 0.002;
        walking_man_1.position.z += 0.1;
        walking_man_2.position.y += 0.002;
        walking_man_2.position.z += 0.1;
        if (car.position.z > 70) {
            car.position.set(10, -3.3, -10);
            car.rotation.x = degToRad(-1);
            walking_man_1.position.set(0, -2.5, 0);
            walking_man_2.position.set(0, -2.5, -5);
        }
    }
}