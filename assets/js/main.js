let config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'phaser-example',
    width: '100%',
    height: '100%',
    min: {
      width: 640,
      height: 400
    },
    max: {
      width: 2560,
      height: 400
    }
  },
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

let game = new Phaser.Game(config);
