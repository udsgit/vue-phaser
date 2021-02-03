import {Scene, Game} from 'phaser';
import character from '@/assets/images/character.png'
import background from "@/assets/images/background.png"
import corners from "@/assets/images/terrain/terrain_corner.png"
import cornersJSON from "@/assets/images/terrain/terrain_corner.json";
import goldSound from "@/assets/audio/tin.mp3";
import items from "@/assets/images/items.png";

export default class BootScene extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        this.loadImages();
        this.loadSpriteSheets();
        this.loadAudio();
    }

    loadImages() {
        this.load.image("character", character);
        this.load.image("background", background);
    }

    loadSpriteSheets() {
        this.load.atlas("corners", corners, cornersJSON)

        this.load.spritesheet("items", items, {
            frameWidth: 32,
            frameHeight: 32,
        });
    }

    loadAudio() {
        this.load.audio("goldSound", goldSound);
    }

    create() {
        this.scene.start("Map");
    }
}