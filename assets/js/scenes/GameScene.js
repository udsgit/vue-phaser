class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init() {
    this.scene.launch("Ui");
    this.score = 0;
  }

  create() {
    this.createBackgroundImage();
    this.createAudio();
    this.createWalls();
    this.createChests();
    this.createPlayer();
    this.addCollisions();
    this.createInput();
  }

  update() {
    this.player.update(this.cursors);
  }

  createAudio() {
    this.goldPickupAudio = this.sound.add("goldSound", {
      loop: false,
      volume: 0.2,
    });
  }

  createPlayer() {
    this.player = new Player(this, 32, 32, "character");
    this.player.setPosition(400, 0);
  }

  createBackgroundImage() {
    this.add.image(0, 0, "background").setScale(2);
  }

  createChests() {
    //create a chest group
    this.chests = this.physics.add.group();
    //specify the max number of chest we can have
    this.maxNumberOfChests = 5;

    //create chest positions array
    this.newChestPosition();

    //spawn a chest
    for (let i = 0; i < this.maxNumberOfChests; i++) {
      this.spawnChest();
    }
  }

  newChestPosition() {
    this.chestPositions = [];
    let x;
    let y;

    while (this.chestPositions.length < this.maxNumberOfChests) {
      do {
        x = (Math.floor(Math.random() * 25) + 0.5) * 32;
        y = (Math.floor(Math.random() * 18) + 1.5) * 32;
      } while (
        !this.wallPositions.every(
          (e) => JSON.stringify(e) !== JSON.stringify([x, y])
        )
      );
      this.chestPositions.push([x, y]);
    }
  }

  spawnChest() {
    this.newChestPosition();
    const location = this.chestPositions[
      Math.floor(Math.random() * this.chestPositions.length)
    ];
    let chest = this.chests.getFirstDead();
    if (!chest) {
      const chest = new Chest(this, location[0], location[1], "items", 0);
      // add chest to chests group
      this.chests.add(chest);
    } else {
      chest.setPosition(location[0], location[1]);
      chest.makeActive();
    }
  }

  createWalls() {
    this.walls = this.physics.add.staticGroup();
    this.wallPositions = [];

    for (let i = 0; i < 100; i++) {
      const x = (Math.floor(Math.random() * 25) + 0.5) * 32;
      const y = (Math.floor(Math.random() * 18) + 1.5) * 32;
      const frame = Math.floor(Math.random() * 4);

      this.walls.create(x, y, "walls", frame);

      this.wallPositions.push([x, y]);
    }
    console.log(this.wallPositions);
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  addCollisions() {
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.overlap(
      this.player,
      this.chests,
      this.collectChest,
      null,
      this
    );
  }

  collectChest(player, chest) {
    this.goldPickupAudio.play(); // play gold pickup sound
    this.score += chest.coins; // update our score
    this.events.emit("updateScore", this.score); // update score in the ui
    chest.makeInactive(); // make chest game object inactive
    this.time.delayedCall(1000, this.spawnChest, [], this); // spawn a new chest
  }
}
