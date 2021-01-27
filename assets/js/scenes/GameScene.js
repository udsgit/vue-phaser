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
        this.add.image(0, 0, "background").setAlpha(0.0);
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
                x = (Math.floor(Math.random() * 80) + 0.5) * 32;
                y = (Math.floor(Math.random() * 12.5) + 1.5) * 32;
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

        //x this.cameras.main.centerX * 2
        //y this.cameras.main.centerY * 2
        let BLOCK_SIZE = 32
        let HALF_BLOCK = BLOCK_SIZE / 2;
        let MAX_X = this.cameras.main.centerX * 2;
        let MAX_Y = this.cameras.main.centerY * 2;

        let MAX_BLOCKS_X = (MAX_X - HALF_BLOCK) / 32 + 1;
        let MAX_BLOCKS_Y = (MAX_Y - HALF_BLOCK) / 32 + 1;


        const frame = Math.floor(Math.random() * 4);

        let x = -16;
        let y = 16;
        for (let i = 0; i < MAX_BLOCKS_X; i++) {
            this.walls.create(x, y, "walls", frame);
            this.walls.create(x, MAX_Y - 16, "walls", frame);
            x += BLOCK_SIZE;
        }

        x = 16;
        y = 16;
        for (let i = 0; i < MAX_BLOCKS_Y; i++) {
            this.walls.create(x, y, "walls", frame);
            this.walls.create(MAX_X, y - 16, "walls", frame);
            y += BLOCK_SIZE;
        }


        let NW = {x: 0 + HALF_BLOCK, y: 0 + HALF_BLOCK};
        let NE = {x: MAX_X - HALF_BLOCK, y: 0 + HALF_BLOCK};
        let SE = {x: MAX_X - HALF_BLOCK, y: MAX_Y - HALF_BLOCK};
        let SW = {x: 0 + HALF_BLOCK, y: MAX_Y - HALF_BLOCK};


        //this.walls.create(MAX_X - 16, MAX_Y - 16, "walls", frame);
        // this.walls.create(NW.x,NW.y, "walls", frame);
        // this.walls.create(NE.x,NE.y, "walls", frame);
        // this.walls.create(SE.x,SE.y, "walls", frame);
        // this.walls.create(SW.x,SW.y, "walls", frame);

        this.wallPositions.push([MAX_X, MAX_Y]);


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

    //x this.cameras.main.centerX * 2
    //y this.cameras.main.centerY * 2

    collectChest(player, chest) {
        console.log(this.cameras.main.centerX, this.cameras.main.centerY);
        this.goldPickupAudio.play(); // play gold pickup sound
        this.score += chest.coins; // update our score
        this.events.emit("updateScore", this.score); // update score in the ui
        chest.makeInactive(); // make chest game object inactive
        this.time.delayedCall(1000, this.spawnChest, [], this); // spawn a new chest
    }
}
