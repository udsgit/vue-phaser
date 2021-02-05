import { Physics } from 'phaser';

export default class Image extends Physics.Arcade.Image {
    constructor(scene, x, y, key, name, frame) {
        super(scene, x, y, key, frame);
        this.name = name;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
    }


}