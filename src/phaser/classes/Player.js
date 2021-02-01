import { Physics } from 'phaser';

export default class Player extends Physics.Arcade.Image {
  constructor(scene, x, y, key, frame) {
    super(scene, x, y, key, frame);
    this.scene = scene; // the scene this container will be added to
    this.velocity = 300; // the velocity when moving our player
    this.scene.physics.world.enable(this); // enable physics
    this.setImmovable(false); // set immovable if another object collides with our player
    this.body.setCollideWorldBounds(true); // collide with world bounds
    this.setScale(0.8); // scale the player
    this.scene.add.existing(this); // add the player to our existing scene
  }

  update(cursors) {
    this.body.setVelocity(0);

    if (cursors.left.isDown) {
      this.body.setVelocityX(-this.velocity);
    } else if (cursors.right.isDown) {
      this.body.setVelocityX(this.velocity);
    }

    if (cursors.up.isDown) {
      this.body.setVelocityY(-this.velocity);
    } else if (cursors.down.isDown) {
      this.body.setVelocityY(this.velocity);
    }

    const shift = this.scene.input.keyboard.addKey("SHIFT"); // Get key object
    if (shift.isDown) {
      this.velocity = 1000;
    } else {
      this.velocity = 300;
      this.setScale(0.9);
    }
  }
}
