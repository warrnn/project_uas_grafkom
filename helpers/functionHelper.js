export const onError = err => console.error(err);

export const enableShadows = (obj) => {
    obj.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
};

export function clearScene(scene, models, mixers, camera, controls) {

    // Clear Mixers
    mixers.forEach(m => m.uncacheRoot(m.getRoot()));
    mixers.length = 0;

    // Clear Models
    models.forEach(obj => {
        scene.remove(obj);

        obj.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    });
    models.length = 0;


    // REMOVE ALL LIGHTS
    scene.traverse((child) => {
        if (child.isLight) {
            scene.remove(child);
            if (child.dispose) child.dispose();
        }
    });


    // REMOVE ALL NON-CAMERA CHILDREN (meshes, helpers, grids)
    [...scene.children].forEach(child => {
        if (child.type !== "PerspectiveCamera" && !child.isLight) {
            scene.remove(child);
            if (child.dispose) {
                try { child.dispose(); } catch { }
            }
        }
    });

    // REMOVE LIGHT HELPERS
    if (scene.userData.directionalLightHelper) {
        scene.remove(scene.userData.directionalLightHelper);
        scene.userData.directionalLightHelper.dispose?.();
        scene.userData.directionalLightHelper = null;
    }

    if (scene.userData.shadowHelper) {
        scene.remove(scene.userData.shadowHelper);
        scene.userData.shadowHelper.dispose?.();
        scene.userData.shadowHelper = null;
    }

    if (scene.userData.hemisphereLightHelper) {
        scene.remove(scene.userData.hemisphereLightHelper);
        scene.userData.hemisphereLightHelper.dispose?.();
        scene.userData.hemisphereLightHelper = null;
    }

    // DESTROY GUI
    if (scene.userData.gui) {
        try { scene.userData.gui.destroy(); }
        catch (e) { console.warn("GUI destroy failed:", e); }
        scene.userData.gui = null;
    }
}

export function generateRandomTaxiPositions(count) {
    const positions = [];

    const half = Math.floor(count / 2);
    const remainder = count % 2;

    // --- 50% z list ---
    const zList = [
        ...Array(half).fill(-1.5),
        ...Array(half).fill(3.5),
    ];

    // Jika ganjil, 1 random
    if (remainder === 1) {
        zList.push(Math.random() < 0.5 ? -1.5 : 3.5);
    }

    // --- 50% opacity list ---
    const opacityList = [
        ...Array(half).fill(1.0),
        ...Array(half).fill(0.5),
    ];

    if (remainder === 1) {
        opacityList.push(Math.random() < 0.5 ? 1.0 : 0.5);
    }

    // Acak kedua list agar tidak berurutan
    zList.sort(() => Math.random() - 0.5);
    opacityList.sort(() => Math.random() - 0.5);

    for (let i = 0; i < count; i++) {
        const z = zList[i];
        const opacity = opacityList[i];
        const rotate = opacity === 1.0 ? 0 : 180;

        positions.push({
            x: parseFloat((Math.random() * 20).toFixed(2)),
            y: -0.7,
            z,
            rotate,
            opacity,
        });
    }

    return positions;
}
