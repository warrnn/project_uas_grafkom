import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadAnimationScene1, loadScene1 } from './scenes/scene1';
import { loadAnimationScene2, loadScene2 } from './scenes/scene2';
import { degToRad } from 'three/src/math/MathUtils.js';

let scene, camera, renderer, controls;
let models = [];
let mixers = [];

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
    loadScene2(scene, models, mixers);
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
    if (mixers.length > 0) {
        for (let i = 0; i < mixers.length; i++) {
            mixers[i].update(delta);
        }
    }

    // Scene 1
    // loadAnimationScene1(models);

    // Scene 2
    loadAnimationScene2(models);

    renderer.render(scene, camera);
}

init();
renderer.setAnimationLoop(animate);