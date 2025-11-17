import { loadAnimationScene1, loadScene1 } from "./scene1";
import { loadAnimationScene2, loadScene2 } from "./scene2";
import { loadAnimationScene3, loadScene3 } from "./scene3";

export const SCENE_LIST = {
    1: { load: loadScene1, animate: loadAnimationScene1 },
    2: { load: loadScene2, animate: loadAnimationScene2 },
    1: { load: loadScene3, animate: loadAnimationScene3 },
};