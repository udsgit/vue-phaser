import { Physics } from 'phaser';

export default class DeepWater extends Physics.Arcade.Image {
    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
    }
}