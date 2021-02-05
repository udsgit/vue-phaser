import { AUTO, Scale, Game } from 'phaser';
import BootScene from './scenes/BootScene';
import MapScene from './scenes/MapScene';
import UiScene from './scenes/UiScene';

export default function createMap(emit){
    const config = {
        type: AUTO,
        scale: {
            mode: Scale.RESIZE,
            parent: 'phaser-example',
            width: '100%',
            height: '100%',
            min: {
                width: 640,
                height: 400
            },
            max: {
                width: 2560,
                height: 400
            }
        },
        scene: [BootScene, new MapScene(emit)],
        physics: {
            default: "arcade",
            arcade: {
                debug: false,
                gravity: {
                    x: 0,
                },
            },
        }
    };
    return new Game(config);
}