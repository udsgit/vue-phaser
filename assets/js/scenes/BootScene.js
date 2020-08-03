class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.loadFonts();
    this.loadImages();
    this.loadSpriteSheets();
    this.loadAudio();
  }

  loadFonts() {
    this.load.bitmapFont("EightBitsOfDoom", "assets/fonts/8bits.fnt");
  }

  loadImages() {
    this.load.image("start", "assets/images/ui/start.png");
    this.load.image("startHold", "assets/images/ui/start-hold.png");
    this.load.image("move", "assets/images/ui/move.png");
    this.load.image("run", "assets/images/ui/run.png");
    this.load.image("character", "assets/images/character.png");
    this.load.image("background", "assets/images/background.png");
  }

  loadSpriteSheets() {
    this.load.spritesheet("items", "assets/images/items.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("walls", "assets/images/walls.png", {
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
