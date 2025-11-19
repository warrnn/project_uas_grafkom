import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { enableShadows, onError } from '../helpers/functionHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ColorGUIHelper } from '../helpers/classHelper';
import { degToRad } from 'three/src/math/MathUtils.js';

const initCameraPosition = {
    x: -171.50909031672361,
    y: 30.128531322350725,
    z: -121.67721797933316
}

const initControlTarget = {
    x: 34.984055177969516,
    y: 109.42899991012222,
    z: -59.57485767000415
}

export function loadScene6(scene, models, mixers, camera, controls) {
    const loader = new GLTFLoader();
    const gui = new GUI();

    /* Fog */
    const fogNear = 0.1;
    const fogFar = 2000;
    scene.fog = new THREE.Fog("rgba(255, 255, 255, 1)", fogNear, fogFar);

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
    const ambientLight = new THREE.AmbientLight("rgba(255, 255, 255, 1)", 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(-100, -22.7, 100);
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
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: "rgba(100, 100, 100, 1)",
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 0, 0);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    loader.load('/environment/statue_of_liberty_low_poly.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.02, 0.02, 0.02);
        model.position.set(0, 0, 0);
        enableShadows(model);
        scene.add(model);
    }, undefined, onError);
}

export function loadAnimationScene6(models, scene, camera, controls, delta) {
    const center = new THREE.Vector3(0, 125, 0);

    const zoomSpeed = 3 * delta;
    const rotationSpeed = 0.5 * delta;

    // Hitung sudut orbit
    let currentAngle = Math.atan2(
        camera.position.x - center.x,
        camera.position.z - center.z
    );

    if (camera.userData.totalRotation === undefined)
        camera.userData.totalRotation = 0;

    const maxRotation = Math.PI * 2; // 360°

    if (Math.abs(camera.userData.totalRotation) < maxRotation) {

        // Zoom in
        if (camera.fov > 20) {
            camera.fov -= zoomSpeed;
            camera.updateProjectionMatrix();
        }

        // Orbit rotate
        const angleIncrement = rotationSpeed;
        currentAngle += angleIncrement;
        camera.userData.totalRotation += angleIncrement;

        const radius = Math.sqrt(
            Math.pow(camera.position.x - center.x, 2) +
            Math.pow(camera.position.z - center.z, 2)
        );

        camera.position.x = center.x + radius * Math.sin(currentAngle);
        camera.position.z = center.z + radius * Math.cos(currentAngle);

        camera.lookAt(center);

    } else {
        // Reset
        camera.userData.totalRotation = 0;

        // Reset FOV
        camera.fov = 45;
        camera.updateProjectionMatrix();

        // Reset camera position
        camera.position.set(
            initCameraPosition.x,
            initCameraPosition.y,
            initCameraPosition.z
        );

        // Reset controls target
        controls.target.copy(center);
        controls.update();

        // Reset lookAt
        camera.lookAt(
            initControlTarget.x,
            initControlTarget.y,
            initControlTarget.z
        );
    }

}
