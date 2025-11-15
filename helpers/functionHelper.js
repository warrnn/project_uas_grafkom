export const onError = err => console.error(err);

export const enableShadows = (obj) => {
    obj.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
};