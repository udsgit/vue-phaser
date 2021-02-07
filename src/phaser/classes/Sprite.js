import {GameObjects} from 'phaser';


export default class Sprite extends GameObjects.Sprite {
    constructor(scene, x, y, key, name, frameRate, repeat, playAnimation) {
        super(scene, x, y, key);
        this.name = name;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        this.scene.anims.create(
            {
                key: this.name,
                frames: [
                    {key: "textures", frame: `${this.name}_f1`},
                    {key: "textures", frame: `${this.name}_f2`},
                    {key: "textures", frame: `${this.name}_f3`},
                    {key: "textures", frame: `${this.name}_f2`},
                ],
                frameRate: frameRate,
                repeat: repeat
            }
        )

        playAnimation ? this.play(this.name) : undefined;

    }
}