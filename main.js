import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SCENE_LIST } from './scenes/config';
import { clearScene } from './helpers/functionHelper';

let scene, camera, renderer, controls;
let models = [];
let mixers = [];
let sceneAnimator = null;
const startScene = 9;

function switchScene(sceneID) {
    clearScene(scene, models, mixers, camera, controls);

    const selected = SCENE_LIST[sceneID];
    if (!selected) {
        console.warn(`Scene ${sceneID} not found`);
        return;
    }

    selected.load(scene, models, mixers, camera, controls);
    sceneAnimator = (delta) => {
        if (selected.animate) {
            selected.animate(models, scene, camera, controls, delta);
        }
    };

    console.log(`Switched to Scene ${sceneID}`);
}

function init() {
    /* Scene */
    scene = new THREE.Scene();

    /* Camera */
    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 5000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    /* Renderer */
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    /* Controls */
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    /* Models */
    switchScene(startScene);

    /* Event Listeners */
    window.addEventListener('resize', onWindowResize);

    const input = document.getElementById("scene-input");
    const btn = document.getElementById("scene-btn");
    let sceneBtnClicked = 0;

    input.max = Object.keys(SCENE_LIST).length;

    btn.addEventListener("click", () => {
        if (sceneBtnClicked == 0) {
            sceneBtnClicked++;
            btn.innerText = "Click 2 More Times";
        } else if (sceneBtnClicked == 1) {
            sceneBtnClicked++;
            btn.innerText = "Click 1 More Time";
        } else if (sceneBtnClicked == 2) {
            sceneBtnClicked++;
            btn.innerText = "Click 3 More Times";
            sceneBtnClicked = 0;
        }
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
let lastLog = 0;

function animate() {
    controls.update();

    const delta = clock.getDelta();

    lastLog += delta;
    if (lastLog >= 1) {
        console.log("Camera", camera.position);
        console.log("Controls", controls.target);
        
        lastLog = 0;
    }

    if (scene.userData.directionalLightHelper) {
        scene.userData.directionalLightHelper.update();
    }
    if (scene.userData.shadowHelper) {
        scene.userData.shadowHelper.update();
    }

    /* Animation */
    if (mixers.length > 0) {
        for (let i = 0; i < mixers.length; i++) {
            mixers[i].update(delta);
        }
    }

    if (sceneAnimator) {
        sceneAnimator(delta);
    }

    renderer.render(scene, camera);
}

init();
renderer.setAnimationLoop(animate);