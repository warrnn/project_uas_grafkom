import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadScene1 } from './scenes/scene1';
import { loadScene2 } from './scenes/scene2';

let scene, camera, renderer, controls;
let models = [];

function init() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(-20, 40, 100);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);

    // Models
    loadModels();

    // Event Listeners
    window.addEventListener('resize', onWindowResize);
}

function loadModels() {
    // 00:00 - 00:04
    // loadScene1(scene, models);

    // 00:05 - 00:08
    loadScene2(scene, models);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const clock = new THREE.Clock();

function animate() {
    controls.update();

    if (scene.userData.directionalLightHelper) {
        scene.userData.directionalLightHelper.update();
    }
    if (scene.userData.shadowHelper) {
        scene.userData.shadowHelper.update();
    }

    const delta = clock.getDelta();

    // Animation
    if (scene.userData.mixer) {
        scene.userData.mixer.update(delta);
    }

    // Scene 1
    if (models[0]) {
        models[0].position.z += 0.2;
        if (models[0].position.z > 70) {
            models[0].position.z = -20;
        }
    }

    // Scene 2
    // ...

    renderer.render(scene, camera);
}

init();
renderer.setAnimationLoop(animate);