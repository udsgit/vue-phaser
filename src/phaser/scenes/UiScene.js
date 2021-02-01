import {Scene} from 'phaser';

export default class UiScene extends Scene {
    constructor() {
        super("Ui");
    }

    preload() {
    }

    init() {
        // grab a reference to the game scene
        this.mapScene = this.scene.get("Map");
    }

    create() {
        this.setupUiElements();
        this.setupEvents();
    }

    setupUiElements() {
        // create the score text game object
        this.scoreText = this.add.text(40, 8, "COINS: 0", {
            fontFamily: "EightBitsOfDoom",
            fontSize: "20px",
            fill: "#fff",
        });
        //create coin icon
        this.coinIcon = this.add.image(20, 18, "items", 1);
    }

    setupEvents() {
        // listen for the updateScore event from the game scene
        this.mapScene.events.on("updateScore", (score) => {
            this.scoreText.setText(`COINS: ${score}`);
        });
    }
}
