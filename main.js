import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object;
        this.prop = prop;
    }
    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}

// Scene
const scene = new THREE.Scene();

// Camera
const fov = 45;
const aspect = 2;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// 3D Model Loader
const loader = new GLTFLoader();

// GUI Helper
const gui = new GUI();

loader.load('/characters/michael_de_santa_-_gta_v.glb', function (gltf) {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    scene.add(model);
}, undefined, function (error) {
    console.error(error);
});

let color = 0xFFFFFF;
let intensity = 1;
let light = new THREE.AmbientLight(color, intensity);
scene.add(light);

color = 0xFFFFFF;
intensity = 3;
light = new THREE.DirectionalLight(color, intensity);
light.position.set(1, 1, 1);
scene.add(light);

// let helper = new THREE.DirectionalLightHelper(light);
// scene.add(helper)

camera.position.z = 5;

function animate() {
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);