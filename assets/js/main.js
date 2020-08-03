var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [BootScene, TitleScene, GameScene, UiScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: {
        x: 0,
      },
    },
  },
};

var game = new Phaser.Game(config);
