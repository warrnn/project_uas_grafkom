import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SCENE_LIST } from './scenes/config';
import { clearScene } from './helpers/functionHelper';

let scene, camera, renderer, controls;
let models = [];
let mixers = [];
let sceneAnimator = null;

function switchScene(sceneID) {
    clearScene(scene, models, mixers);

    const selected = SCENE_LIST[sceneID];
    if (!selected) {
        console.warn(`Scene ${sceneID} tidak ditemukan.`);
        return;
    }

    selected.load(scene, models, mixers);
    sceneAnimator = selected.animate || null;

    console.log(`Switched to Scene ${sceneID}`);
}

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
    switchScene(1);

    // Event Listeners
    window.addEventListener('resize', onWindowResize);

    const input = document.getElementById("scene-input");
    const btn = document.getElementById("scene-btn");

    input.max = Object.keys(SCENE_LIST).length;

    btn.addEventListener("click", () => {
        const id = Number(input.value);
        if (SCENE_LIST[id]) {
            switchScene(id);
        };
    });
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

    if (sceneAnimator) {
        sceneAnimator(models, mixers, delta);
    }

    renderer.render(scene, camera);
}

init();
renderer.setAnimationLoop(animate);