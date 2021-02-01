import { Physics } from 'phaser';

export default class Link extends Physics.Arcade.Image {
    constructor(name, scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        this.name = name;
        this.scene = scene;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
    }
}