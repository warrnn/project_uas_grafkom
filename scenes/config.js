import { loadAnimationScene1, loadScene1 } from "./scene1";
import { loadAnimationScene2, loadScene2 } from "./scene2";
import { loadAnimationScene3, loadScene3 } from "./scene3";
import { loadAnimationScene4, loadScene4 } from "./scene4";
import { loadAnimationScene5, loadScene5 } from "./scene5";

export const SCENE_LIST = {
    // 1: { load: loadScene1, animate: loadAnimationScene1 },
    // 2: { load: loadScene2, animate: loadAnimationScene2 },0
    // 3: { load: loadScene3, animate: loadAnimationScene3 },
    // 4: { load: loadScene4, animate: loadAnimationScene4 },
    1: { load: loadScene5, animate: loadAnimationScene5 },
};