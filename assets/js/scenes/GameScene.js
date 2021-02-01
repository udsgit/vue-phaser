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
        this.corners = this.physics.add.staticGroup();
        this.grass = this.physics.add.staticGroup();
        this.wallPositions = [];

        let MAX_X = this.cameras.main.centerX * 2;
        let MAX_Y = this.cameras.main.centerY * 2;


        //100% grass center
        for(let x = 0; x < MAX_X; x+=16){
            for(let y = 0; y < MAX_Y; y+=16){
                this.grass.create(x,y, "corners", "terrain_grass_center.png");
            }
        }


        let px = 32;

        //corner west and east
        while (px < MAX_Y - 64) {
            this.corners.create(0, px, "corners", "terrain_corner_west_f1.png");
            this.corners.create(MAX_X, px, "corners", "terrain_corner_east_f1.png");

            px += 48;
        }

        px = 48;

        //corner north and south
        while (px < MAX_X - 32) {
            this.corners.create(px, 0, "corners", "terrain_corner_north_f1.png");
            this.corners.create(px, MAX_Y, "corners", "terrain_corner_south_f1.png");
            px += 48;
        }

        //corner north west
        this.corners.create(0, 0, "corners", "terrain_corner_north_west_f1.png");
        this.corners.create(32, 0, "corners", "terrain_corner_north_west_right_f1.png");
        this.grass.create(32,16, "corners", "terrain_grass_north_west_f1.png");

        //corner north east
        this.corners.create(MAX_X, 0, "corners", "terrain_corner_north_east_f1.png");
        this.corners.create(MAX_X - 32, 0, "corners", "terrain_corner_north_east_left_f1.png");
        this.grass.create(MAX_X - 32, 16, "corners", "terrain_grass_north_east_f1.png");

        //corner south west
        this.corners.create(0, MAX_Y, "corners", "terrain_corner_south_west_f1.png");
        this.corners.create(0, MAX_Y - 32, "corners", "terrain_corner_south_west_up_f1.png");
        this.corners.create(32, MAX_Y, "corners", "terrain_corner_south_west_right_f1.png");
        this.grass.create(32, MAX_Y - 32, "corners", "terrain_grass_south_west_f1.png");

        //corner south east
        this.corners.create(MAX_X, MAX_Y, "corners", "terrain_corner_south_east_f1.png");
        this.corners.create(MAX_X, MAX_Y - 32, "corners", "terrain_corner_south_east_up_f1.png");
        this.corners.create(MAX_X - 32, MAX_Y, "corners", "terrain_corner_south_east_left_f1.png");
        this.grass.create(MAX_X - 32, MAX_Y - 32, "corners", "terrain_grass_south_east_f1.png");


        // let terrain_corner_north = this.add.sprite(0,0, "corners", "terrain_corner_north_f1.png");
        // let terrain_corner_west = this.add.sprite(0,0, "corners", "terrain_corner_west_f1.png");
        // let terrain_corner_south = this.add.sprite(0,0, "corners", "terrain_corner_south_f1.png");
        // let terrain_corner_east = this.add.sprite(0,0, "corners", "terrain_corner_east_f1.png");

        const terrains = [
            "terrain_corner_north_west",
            "terrain_corner_north",
            "terrain_corner_north_east",
            "terrain_corner_west",
            "terrain_corner_south_west",
            "terrain_corner_south",
            "terrain_corner_south_east",
            "terrain_corner_east"
        ];


        terrains.forEach(terrain => {
            this.createTerrainAnimations(terrain, 2, -1);
        });


    }

    createTerrainAnimations(key, framerate, repeat) {
        this.anims.create({
            key: key,
            frames: [
                {key: "corners", frame: `${key}_f1.png`},
                {key: "corners", frame: `${key}_f2.png`},
                {key: "corners", frame: `${key}_f3.png`},
                {key: "corners", frame: `${key}_f2.png`},
            ],
            frameRate: framerate,
            repeat: repeat
        })
    }

    createInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    addCollisions() {
        this.physics.add.collider(this.player, this.corners);
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
