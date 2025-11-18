import { loadAnimationScene1, loadScene1 } from "./scene1";
import { loadAnimationScene2, loadScene2 } from "./scene2";
import { loadAnimationScene3, loadScene3 } from "./scene3";
import { loadAnimationScene4, loadScene4 } from "./scene4";
import { loadAnimationScene5, loadScene5 } from "./scene5";
import { loadAnimationScene6, loadScene6 } from "./scene6";
import { loadAnimationScene7, loadScene7 } from "./scene7";
import { loadAnimationScene8, loadScene8 } from "./scene8";
import { loadAnimationScene9, loadScene9 } from "./scene9";

export const SCENE_LIST = {
    1: { load: loadScene1, animate: loadAnimationScene1 },
    2: { load: loadScene2, animate: loadAnimationScene2 },
    3: { load: loadScene3, animate: loadAnimationScene3 },
    4: { load: loadScene4, animate: loadAnimationScene4 },
    5: { load: loadScene5, animate: loadAnimationScene5 },
    6: { load: loadScene6, animate: loadAnimationScene6 },
    7: { load: loadScene7, animate: loadAnimationScene7 },
    8: { load: loadScene8, animate: loadAnimationScene8 },
    9: { load: loadScene9, animate: loadAnimationScene9 },
};