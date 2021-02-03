import {Scene, Game} from 'phaser';
import Chest from '@/phaser/classes/Chest';
import Player from '@/phaser/classes/Player';
import Link from "@/phaser/classes/Link";
import DeepWater from "@/phaser/classes/DeepWater";

export default class MapScene extends Scene {
    constructor(emit) {
        super("Map");
        this.emit = emit;
        this.moveCam = false;
    }

    init() {
        this.scene.launch("Ui");
        this.score = 0;
    }

    preload() {
        this.maxPositionX = 2560;
        this.maxPositionY = 400;
        this.loadAnimations();
    }

    create() {


        this.createBackgroundImage();
        this.createAudio();
        this.createWalls();
        this.createChests();
        this.createLinks();
        this.createPlayer();
        this.addCollisions();
        this.createInput();
        this.createDeepWater();

        this.cameras.main.setBounds(0, 0, 2560, 400);
        this.physics.world.setBounds(0, 0, 2560, 400);
        this.cameras.main.startFollow(this.player, true);


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
        //this.add.image(1280, 200, "background");
    }

    createLinks() {
        this.links = this.physics.add.group([
            new Link("aboutMe", this, 100, 100, "items", 1),
            new Link("blog", this, 100, 150, "items", 1)
        ]);
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

    createBeaches() {
        this.beaches = this.physics.add.staticGroup();

        createAllGrass(this);
        createNorthSouthEastAndWestBeaches(this);
        createCornerBeaches(this);

        function createNorthSouthEastAndWestBeaches(scene) {
            const {beaches, maxPositionX, maxPositionY} = scene;
            let x = 48;
            let y = 32;

            while (y < maxPositionY - 64) {
                beaches.create(scene.add.sprite(0, y, "corners").play("terrain_corner_west"));
                beaches.create(scene.add.sprite(maxPositionX, y, "corners").play("terrain_corner_east"));
                y += 48;
            }

            while (x < maxPositionX - 32) {
                scene.beaches.create(scene.add.sprite(x, 0, "corners").play("terrain_corner_north"));
                scene.beaches.create(scene.add.sprite(x, maxPositionY, "corners").play("terrain_corner_south"));
                x += 48;
            }
        }

        function createCornerBeaches(scene) {
            const {beaches, maxPositionX, maxPositionY} = scene;
            const tileSize = 32;

            beaches.addMultiple([
                scene.add.sprite(0, 0, "corners").play("terrain_corner_north_west"),
                scene.add.sprite(tileSize, 0, "corners").play("terrain_corner_north_west_right"),
                scene.add.sprite(tileSize, 0, "corners").play("terrain_corner_north_west_right"),
                scene.add.sprite(maxPositionX, 0, "corners").play("terrain_corner_north_east"),
                scene.add.sprite(maxPositionX - tileSize, 0, "corners").play("terrain_corner_north_east_left"),
                scene.add.sprite(0, maxPositionY, "corners").play("terrain_corner_south_west"),
                scene.add.sprite(0, maxPositionY - tileSize, "corners").play("terrain_corner_south_west_up"),
                scene.add.sprite(tileSize, maxPositionY, "corners").play("terrain_corner_south_west_right"),
                scene.add.sprite(maxPositionX, maxPositionY, "corners").play("terrain_corner_south_east"),
                scene.add.sprite(maxPositionX, maxPositionY - tileSize, "corners").play("terrain_corner_south_east_up"),
                scene.add.sprite(maxPositionX - tileSize, maxPositionY, "corners").play("terrain_corner_south_east_left")
            ]);

        }

        function createAllGrass(scene) {
            const {grasses, maxPositionX, maxPositionY} = scene;
            const tileSize = 16;

            for (let x = 0; x < maxPositionX; x += tileSize) {
                for (let y = 0; y < maxPositionY; y += tileSize) {
                    grasses.create(x, y, "corners", "terrain_grass_center.png");
                }
            }
        }

        function createCornersGrasses(scene) {
            const {grasses, maxPositionX, maxPositionY} = scene;

            grasses.addMultiple([
                grasses.create(32, 16, "corners", "terrain_grass_north_west.png"),
                grasses.create(maxPositionX - 32, 16, "corners", "terrain_grass_north_east.png"),
                grasses.create(32, maxPositionY - 32, "corners", "terrain_grass_south_west.png"),
                grasses.create(maxPositionX - 32, maxPositionY - 32, "corners", "terrain_grass_south_east.png")
            ]);
        }

    }

    createDeepWater() {
        const tileSize = 16;
        const coords = [];

        addCoords();
        createDeepWaterFromCoords(this);

        function addCoords(){
            for (let i = 0; i < 25; i++) {
                coords.push([]);
            }

            let row = 0;
            for (let x = 0; x < 39; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 103; x < 106; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 122; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 1;
            for (let x = 0; x < 38; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 124; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 2;
            for (let x = 0; x < 36; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 125; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 3;
            for (let x = 0; x < 35; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 125; x < 128; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 136; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            [4,5,6,7,8].forEach(row => {
                for (let x = 0; x < 35; x++) {
                    coords[row].push(x * tileSize);
                }
                for (let x = 125; x < 127; x++) {
                    coords[row].push(x * tileSize);
                }
                for (let x = 137; x < 160; x++) {
                    coords[row].push(x * tileSize);
                }
            })

            row = 9;
            for (let x = 0; x < 35; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 124; x < 128; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 137; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 10;
            for (let x = 0; x < 35; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 121; x < 128; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 137; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 11;
            for (let x = 0; x < 35; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 121; x < 128; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 136; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 12;
            for (let x = 0; x < 35; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 127; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 13;
            for (let x = 0; x < 35; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 128 ; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 14;
            for (let x = 0; x < 29; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 128 ; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 15;
            for (let x = 0; x < 28; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 128 ; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 16;
            for (let x = 0; x < 26; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 128 ; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 17;
            for (let x = 0; x < 25; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 40; x < 47; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 128 ; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 18;
            for (let x = 0; x < 25; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 46; x < 47; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 128; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 19;
            for (let x = 0; x < 25; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 128; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 20;
            for (let x = 0; x < 25; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 127 ; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 21;
            for (let x = 0; x < 25; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 123 ; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 22;
            for (let x = 0; x < 25; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 122 ; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 23;
            for (let x = 0; x < 25; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 119; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

            row = 24;
            for (let x = 0; x < 25; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 47; x < 48; x++) {
                coords[row].push(x * tileSize);
            }
            for (let x = 119; x < 160; x++) {
                coords[row].push(x * tileSize);
            }

        }
        function createDeepWaterFromCoords(scene){
            coords.forEach((row, y) => {
                row.forEach(x => {
                    new DeepWater(scene, x, y * tileSize, "corners", "deep_ocean.png");
                })
            })
        }
    }

    createWalls() {
        this.walls = this.physics.add.staticGroup();
        this.beaches = this.physics.add.staticGroup();
        this.grass = this.physics.add.staticGroup();
        this.wallPositions = [];

        const MAX_X = this.maxPositionX;
        const MAX_Y = this.maxPositionY;

        // //100% grass center
        //
        // for (let x = 0; x < MAX_X; x += 16) {
        //     for (let y = 0; y < MAX_Y; y += 16) {
        //         this.grass.create(x, y, "corners", "terrain_grass_center.png");
        //     }
        // }


    }

    loadAnimations() {
        [
            "terrain_corner_north",
            "terrain_corner_north_west",
            "terrain_corner_north_west_right",
            "terrain_corner_north_east",
            "terrain_corner_north_east_left",
            "terrain_corner_north_east_up",
            "terrain_corner_south",
            "terrain_corner_south_west",
            "terrain_corner_south_west_right",
            "terrain_corner_south_west_up",
            "terrain_corner_south_east",
            "terrain_corner_south_east_left",
            "terrain_corner_south_east_up",
            "terrain_corner_west",
            "terrain_corner_east"
        ].forEach(terrain => {
            this.createTerrainAnimations(terrain, 4, -1);
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
        this.physics.add.collider(this.player, this.beaches);
        this.physics.add.overlap(
            this.player,
            this.chests,
            this.collectChest,
            null,
            this
        );
        this.physics.add.overlap(
            this.player,
            this.links,
            this.enterLink,
            null,
            this
        );
    }


    enterLink(player, link) {
        this.links.getChildren()
            .filter(link => !link.active)
            .forEach(inactive => {
                if (inactive !== undefined) {
                    inactive.setActive(true);
                }
            });
        this.emit("link", link.name);
        link.setActive(false);
    }


    collectChest(player, chest) {
        this.goldPickupAudio.play(); // play gold pickup sound
        this.score += chest.coins; // update our score
        this.events.emit("updateScore", this.score); // update score in the ui
        chest.makeInactive(); // make chest game object inactive
        this.time.delayedCall(1000, this.spawnChest, [], this); // spawn a new chest
    }


}
