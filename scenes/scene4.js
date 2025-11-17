import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { enableShadows, onError } from '../helpers/functionHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ColorGUIHelper } from '../helpers/classHelper';
import { degToRad } from 'three/src/math/MathUtils.js';

export function loadScene4(scene, models, mixers) {
    const loader = new GLTFLoader();
    const gui = new GUI();

    /* Background */
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/backgrounds/bg_scene_4.jpg', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
    });

    /* Lights */
    const ambientLight = new THREE.AmbientLight("#e2bf60", 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(97.4, 81.7, 97.4);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

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
    const planeGeometry = new THREE.PlaneGeometry(2500, 2500);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: "rgba(80, 46, 4, 1)",
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(600, -90, 0);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    loader.load('/environment/ferry_terminal_bridge.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(2, 2, 2);
        model.position.set(600, -90, 0);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    loader.load('/environment/water_wave_for_ar.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(3, 5, 10);
        model.position.set(1400, 320, 1000);
        model.rotation.y = Math.PI / 2;
        scene.add(model);
        const mixer = new THREE.AnimationMixer(model);
        const clip = THREE.AnimationClip.findByName(gltf.animations, 'Object_0');
        if (clip) {
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopRepeat);
            action.clampWhenFinished = true;
            action.play();
        }
        mixers.push(mixer);
    }, undefined, onError);

    for (let x = 460; x <= 1560; x += 100) {
        loader.load('/environment/metal_sheet.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(-x, -185, -80);
            enableShadows(model);
            scene.add(model);
        }, undefined, onError);
    }

    for (let x = 460; x <= 1560; x += 100) {
        loader.load('/environment/metal_sheet.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(-x, -185, -310);
            enableShadows(model);
            scene.add(model);
        }, undefined, onError);
    }

    for (let x = 460; x <= 1560; x += 100) {
        loader.load('/environment/metal_sheet.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(-x, -185, 140);
            enableShadows(model);
            scene.add(model);
        }, undefined, onError);
    }

    for (let x = 460; x <= 1560; x += 100) {
        loader.load('/environment/metal_sheet.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(-x, -185, -565);
            enableShadows(model);
            scene.add(model);
        }, undefined, onError);
    }

    for (let x = 460; x <= 1560; x += 100) {
        loader.load('/environment/metal_sheet.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(-x, -185, 400);
            enableShadows(model);
            scene.add(model);
        }, undefined, onError);
    }

    loader.load('/things/animated_yacht.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(110, 110, 110);
        model.position.set(180, -30, 300);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    const zSewerPosition = [290, 520, 40, -190, -200, -420, -650]

    zSewerPosition.forEach((z) => {
        loader.load('/environment/sewer.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(3, 5, 3);
            model.position.set(-200, -250, z);
            model.rotation.y = -Math.PI / 2;
            model.traverse((child) => {
                if (child.isMesh) {
                    if (child.material) {
                        child.material.color.multiplyScalar(0.2);
                        child.material.needsUpdate = true;
                    }
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            enableShadows(model);
            scene.add(model);
        }, undefined, onError);
    });

    loader.load('/environment/2_new_york_building.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(200, 250, 200);
        model.position.set(1200, -40, 1000);
        model.rotation.y = degToRad(90);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);

    const R = 400; // radius
    const Y = -450; // ketinggian Y tetap

    const points = [];
    for (let angle = 0; angle <= Math.PI / 2; angle += Math.PI / 10) {
        const x = -R * Math.cos(angle);
        const z = R * Math.sin(angle);
        points.push(new THREE.Vector3(x, Y, z));
    }

    const birdPath = new THREE.CatmullRomCurve3(points);

    birdPath.curveType = "catmullrom";
    birdPath.closed = false;

    scene.userData.birdPath = birdPath;
    scene.userData.birdProgress = 0;

    loader.load('/animals/dove_bird_rigged.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(3, 3, 3);
        const parent = new THREE.Group();
        parent.add(model);
        parent.position.copy(scene.userData.birdPath.getPoint(0));
        // parent.position.set(-100, Y, -500);
        parent.rotation.y = degToRad(45);
        enableShadows(model);
        scene.add(parent);
        scene.userData.birdParent = parent;
        models.push(parent);
        const mixer = new THREE.AnimationMixer(model);
        const clip = THREE.AnimationClip.findByName(gltf.animations, 'Take 001');
        if (clip) {
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopRepeat);
            action.play();
        }
        mixers.push(mixer);
    }, undefined, onError);
}

export function loadAnimationScene4(models, scene) {
    const path = scene.userData.birdPath;
    const parent = scene.userData.birdParent;

    if (!path || !parent) return;

    scene.userData.birdProgress += 0.004;
    if (scene.userData.birdProgress > 1) scene.userData.birdProgress = 0;

    const t = scene.userData.birdProgress;

    const point = path.getPoint(t);

    const offset = new THREE.Vector3(400, 0, -400);
    const finalPos = point.clone().add(offset);

    parent.position.copy(finalPos);

    const tangent = path.getTangent(t).normalize();

    const target = finalPos.clone().add(tangent);
    parent.lookAt(target);

    let extraRotDeg;

    if (t < 0.5) {
        const localT = t / 0.5;
        extraRotDeg = 45 * localT;
    } else {
        const localT = (t - 0.5) / 0.5;
        extraRotDeg = 45 - (45 * localT);
    }

    parent.rotation.y += degToRad(extraRotDeg);
}
