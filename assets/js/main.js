var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 576,
  scene: [BootScene, TitleScene, GameScene, UiScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: {
        x: 0,
      },
    },
  },
};

var game = new Phaser.Game(config);
