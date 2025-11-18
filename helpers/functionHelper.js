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

