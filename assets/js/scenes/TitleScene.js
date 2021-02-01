class TitleScene extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  create() {
    // create title text
    this.titleText = this.add.text(
      this.scale.width / 2,
      this.scale.height * 0.15,
      "Chest Collector",
      { fontFamily: "EightBitsOfDoom", fontSize: "64px", color: "#fff" }
    );
    this.titleText.setOrigin(0.5);

    this.add
      .image(this.scale.width * 0.15, this.scale.height * 0.6, "move")
      .setScale(0.5);

    this.add
      .image(this.scale.width * 0.85, this.scale.height * 0.6, "run")
      .setScale(0.5);

    // create play game button
    this.startGameButton = new UiButton(
      this,
      this.scale.width / 2,
      this.scale.height * 0.6,
      "start",
      "startHold",
      "Start",
      this.startScene.bind(this, "Game")
    );
  }

  startScene(targetScene) {
    this.scene.start(targetScene);
  }
}
