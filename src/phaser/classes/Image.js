import { GameObjects } from 'phaser';

export default class Image extends GameObjects.Image {
    constructor(scene, x, y, key, name, frame) {
        super(scene, x, y, key, frame);
        this.name = name;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
    }



}