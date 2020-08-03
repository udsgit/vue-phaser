class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.loadImages();
    this.loadSpriteSheets();
    this.loadAudio();
  }

  loadImages() {
    this.load.image("button1", "assets/images/ui/blue_button01.png");
    this.load.image("button2", "assets/images/ui/blue_button02.png");
    this.load.spritesheet("items", "assets/images/items.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  loadSpriteSheets() {
    this.load.spritesheet("characters", "assets/images/characters.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  loadAudio() {
    this.load.audio("goldSound", ["assets/audio/tin.mp3"]);
  }

  create() {
    this.scene.start("Title");
  }
}
