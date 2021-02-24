import {Scene} from 'phaser';
import Chest from '@/phaser/classes/Chest';
import Player from '@/phaser/classes/Player';
import Link from "@/phaser/classes/Link";

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
    }

    create() {

        this.createAudio();
        this.createMap();
        this.createWalls();
        this.createChests();
        this.createLinks();
        this.createPlayer();
        this.addCollisions();
        this.createInput();


        this.cameras.main.setZoom(1);
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
                beaches.create(scene.add.sprite(0, y, "textures").play("terrain_corner_west"));
                beaches.create(scene.add.sprite(maxPositionX, y, "textures").play("terrain_corner_east"));
                y += 48;
            }

            while (x < maxPositionX - 32) {
                scene.beaches.create(scene.add.sprite(x, 0, "textures").play("terrain_corner_north"));
                scene.beaches.create(scene.add.sprite(x, maxPositionY, "textures").play("terrain_corner_south"));
                x += 48;
            }
        }

        function createCornerBeaches(scene) {
            const {beaches, maxPositionX, maxPositionY} = scene;
            const tileSize = 32;

            beaches.addMultiple([
                scene.add.sprite(0, 0, "textures").play("terrain_corner_north_west"),
                scene.add.sprite(tileSize, 0, "textures").play("terrain_corner_north_west_right"),
                scene.add.sprite(tileSize, 0, "textures").play("terrain_corner_north_west_right"),
                scene.add.sprite(maxPositionX, 0, "textures").play("terrain_corner_north_east"),
                scene.add.sprite(maxPositionX - tileSize, 0, "textures").play("terrain_corner_north_east_left"),
                scene.add.sprite(0, maxPositionY, "textures").play("terrain_corner_south_west"),
                scene.add.sprite(0, maxPositionY - tileSize, "textures").play("terrain_corner_south_west_up"),
                scene.add.sprite(tileSize, maxPositionY, "textures").play("terrain_corner_south_west_right"),
                scene.add.sprite(maxPositionX, maxPositionY, "textures").play("terrain_corner_south_east"),
                scene.add.sprite(maxPositionX, maxPositionY - tileSize, "textures").play("terrain_corner_south_east_up"),
                scene.add.sprite(maxPositionX - tileSize, maxPositionY, "textures").play("terrain_corner_south_east_left")
            ]);

        }

        function createAllGrass(scene) {
            const {grasses, maxPositionX, maxPositionY} = scene;
            const tileSize = 16;

            for (let x = 0; x < maxPositionX; x += tileSize) {
                for (let y = 0; y < maxPositionY; y += tileSize) {
                    grasses.create(x, y, "textures", "terrain_grass_center.png");
                }
            }
        }

    }

    createMap() {
        this.createDeepOceanTiles();
        this.createGrassTiles();
        this.createBeachTiles();
        this.createOceanTiles();
        this.createLagoonTiles();
    }

    createLagoonTiles() {
        this.createLagoonCornerNorthWestImages();
        this.createLagoonCornerNorthEastImages();
        this.createLagoonCornerSouthWestImages();
        this.createLagoonCornerSouthEastImages();

        this.createLagoonEdgeWestImages();
        this.createLagoonEdgeEastImages();
        this.createLagoonEdgeNorthImages();
        this.createLagoonEdgeSouthImages();

        this.createLagoonNorthImages();
        this.createLagoonCenterImages();
        this.createLagoonWestImages();
        this.createLagoonEastImages();
    }

    createLagoonCornerNorthWestImages() {
        const coords = this.getCoords();

        coords[4].push(...this.col(97));
        coords[18].push(...this.col(81));

        this.createImages(coords, "textures", "lagoon_corner_northwest");
    }

    createLagoonCornerNorthEastImages() {
        const coords = this.getCoords();

        coords[4].push(...this.col(99));
        coords[18].push(...this.col(83));

        this.createImages(coords, "textures", "lagoon_corner_northeast");
    }

    createLagoonCornerSouthWestImages() {
        const coords = this.getCoords();

        coords[6].push(...this.col(97));
        coords[21].push(...this.col(81));


        this.createImages(coords, "textures", "lagoon_corner_southwest");
    }

    createLagoonCornerSouthEastImages() {
        const coords = this.getCoords();

        coords[6].push(...this.col(99));
        coords[21].push(...this.col(83));

        this.createImages(coords, "textures", "lagoon_corner_southeast");
    }

    createLagoonEdgeWestImages() {
        const coords = this.getCoords();

        coords[5].push(...this.col(97));
        coords[19].push(...this.col(81));

        this.createImages(coords, "textures", "lagoon_edge_west");
    }

    createLagoonEdgeEastImages() {
        const coords = this.getCoords();

        coords[5].push(...this.col(99));
        coords[19].push(...this.col(83));


        this.createImages(coords, "textures", "lagoon_edge_east");
    }

    createLagoonEdgeNorthImages() {
        const coords = this.getCoords();

        coords[4].push(...this.col(98));
        coords[18].push(...this.col(82));

        this.createImages(coords, "textures", "lagoon_edge_north");
    }

    createLagoonEdgeSouthImages() {
        const coords = this.getCoords();

        coords[6].push(...this.col(98));
        coords[21].push(...this.col(82));

        this.createImages(coords, "textures", "lagoon_edge_south");
    }

    createLagoonNorthImages() {
        const coords = this.getCoords();

        coords[5].push(...this.col(98));
        coords[19].push(...this.col(82));

        this.createImages(coords, "textures", "lagoon_north");
    }

    createLagoonCenterImages() {
        const coords = this.getCoords();

        coords[20].push(...this.col(82));

        this.createImages(coords, "textures", "lagoon_center");
    }

    createLagoonWestImages() {
        const coords = this.getCoords();

        coords[20].push(...this.col(81));

        this.createImages(coords, "textures", "lagoon_west");
    }

    createLagoonEastImages() {
        const coords = this.getCoords();

        coords[20].push(...this.col(83));

        this.createImages(coords, "textures", "lagoon_east");
    }


    createDeepOceanTiles() {
        this.createDeepOceanCenterImages();

        this.createDeepOceanCornerInnerNorthEastSprites();
        this.createDeepOceanCornerInnerNorthWestSprites();
        this.createDeepOceanCornerInnerSouthEastSprites();
        this.createDeepOceanCornerInnerSouthWestSprites();

        this.createDeepOceanCornerNorthEastSprites();
        this.createDeepOceanCornerNorthWestSprites();
        this.createDeepOceanCornerSouthEastSprites();
        this.createDeepOceanCornerSouthWestSprites();

        this.createDeepOceanEdgeEastSprites();
        this.createDeepOceanEdgeNorthSprites();
        this.createDeepOceanEdgeSouthSprites();
        this.createDeepOceanEdgeWestSprites();
    }

    createOceanTiles() {
        this.createOceanCenterImages();
    }

    createOceanCenterImages() {
        const coords = this.getCoords();

        coords[0].push(...this.col(46, 47, 65, 66, 73, 74, 80, 81, 92, 93, 100, 101, 107, 108, 119, 120));
        coords[1].push(...this.col(...this.stripe(40, 46), ...this.stripe(66, 73), ...this.stripe(81, 87), 90, 91, 92, 101, 107, 120));
        coords[2].push(...this.col(39, 40, ...this.stripe(87, 90), ...this.stripe(101, 107), 120, 121, 122));
        coords[3].push(...this.col(37, 38, 39, 88, 89, 122, 123));
        coords[4].push(...this.col(36, 37, 88, 89, 123, ...this.stripe(129, 134)));
        coords[5].push(...this.col(36, 37, 88, 89, 123, 128, 129, 134, 135));
        coords[6].push(...this.col(36, 87, 88, 89, 123, 128, 135));
        coords[7].push(...this.col(36, 63, 69, ...this.stripe(83, 89), 122, 123, 128, 135));
        coords[8].push(...this.col(36, 83, 89, 90, ...this.stripe(119, 122), 128, 135));
        coords[9].push(...this.col(36, 62, 70, 82, 83, ...this.stripe(89, 92), 119, 128, 129, 134, 135));
        coords[10].push(...this.col(36, ...this.stripe(58, 62), 70, 71, ...this.stripe(78, 92), 119, ...this.stripe(129, 134)));
        coords[11].push(...this.col(36, 57, 58, 62, 70, 71, ...this.stripe(78, 83), ...this.stripe(89, 93), 102, 103, 108, 109, 118, 119));
        coords[12].push(...this.col(36, 37, ...this.stripe(52, 58), 62, 63, ...this.stripe(69, 72), ...this.stripe(77, 82), ...this.stripe(90, 119)));
        coords[13].push(...this.col(...this.stripe(37, 41), 52, ...this.stripe(58, 80), 92, 93, ...this.stripe(99, 125)));
        coords[14].push(...this.col(37, 38, 41, 42, 51, 52, 58, 59, 65, 66, ...this.stripe(71, 79), 93, 99, 100, 125, 126));
        coords[15].push(...this.col(...this.stripe(30, 38), ...this.stripe(41, 58), 72, 73, 76, 77, ...this.stripe(93, 99), 126));
        coords[16].push(...this.col(29, 30, 37, 38, ...this.stripe(49, 54), 72, 73, 76, 94, 95, 96, 126));
        coords[17].push(...this.col(27, 28, 29, 38, ...this.stripe(49, 53), ...this.stripe(73, 76), 95, 126));
        coords[18].push(...this.col(26, 27, 38, 48, 49, 74, 75, 76, 125, 126));
        coords[19].push(...this.col(26, ...this.stripe(38, 44), 48, 74, ...this.stripe(121, 125)));
        coords[20].push(...this.col(26, 37, 38, 39, 44, 45, 48, 120, 121));
        coords[21].push(...this.col(26, 36, 37, 38, 45, 48, ...this.stripe(117, 120)));
        coords[22].push(...this.col(26, 36, 37, 38, 45, 48, 49, 94, 95, 117));
        coords[23].push(...this.col(26, 27, ...this.stripe(35, 38), 45, ...this.stripe(49, 53), 94, 95, 117));
        coords[24].push(...this.col(...this.stripe(27, 35), 38, 39, 44, 45, 53, 54, 62, 63, 73, 74, ...this.stripe(93, 96), 116, 117));


        this.createImages(coords, "textures", "ocean_center");
    }


    createGrassTiles() {
        this.createGrassCenterImages();

        this.createGrassCornerNorthEastImages();
        this.createGrassCornerNorthWestImages();
        this.createGrassCornerSouthEastImages();
        this.createGrassCornerSouthWestImages();

        this.createGrassEdgeEastAImages();
        this.createGrassEdgeEastBImages();
        this.createGrassEdgeNorthAImages();
        this.createGrassEdgeNorthBImages();
        this.createGrassEdgeSouthAImages();
        this.createGrassEdgeSouthBImages();
        this.createGrassEdgeWestAImages();
        this.createGrassEdgeWestBImages();


    }

    createBeachTiles() {

        this.createBeachCornerNorthEastEdgeNorthSprites();
        this.createBeachCornerNorthEastCenterSprites();
        this.createBeachCornerNorthEastEdgeEastFirstSprites();
        this.createBeachCornerNorthEastEdgeEastSecondSprites();

        this.createBeachCornerNorthWestEdgeNorthSprites();
        this.createBeachCornerNorthWestCenterSprites();
        this.createBeachCornerNorthWestEdgeWestFirstSprites();
        this.createBeachCornerNorthWestEdgeWestSecondSprites();

        this.createBeachCornerSouthEastEdgeEastFirstSprites();
        this.createBeachCornerSouthEastEdgeEastSecondSprites();
        this.createBeachCornerSouthEastEdgeSouthFirstSprites();
        this.createBeachCornerSouthEastCenterSprites();
        this.createBeachCornerSouthEastEastSprites();
        this.createBeachCornerSouthEastEdgeSouthSecondSprites();
        this.createBeachCornerSouthEastSouthSprites();

        this.createBeachCornerSouthWestEdgeWestFirstSprites();
        this.createBeachCornerSouthWestEdgeWestSecondSprites();
        this.createBeachCornerSouthWestEdgeSouthFirstSprites();
        this.createBeachCornerSouthWestCenterSprites();
        this.createBeachCornerSouthWestWestSprites();
        this.createBeachCornerSouthWestEdgeSouthSecondSprites();
        this.createBeachCornerSouthWestSouthSprites();

        this.createBeachEdgeEastAFirstSprites();
        this.createBeachEdgeEastASecondSprites();
        this.createBeachEdgeEastBFirstSprites();
        this.createBeachEdgeEastBSecondSprites();

        this.createBeachEdgeNorthASprites();
        this.createBeachEdgeNorthBSprites();

        this.createBeachEdgeSouthAFirstSprites();
        this.createBeachEdgeSouthASecondSprites();
        this.createBeachEdgeSouthBFirstSprites();
        this.createBeachEdgeSouthBSecondSprites();

        this.createBeachEdgeWestAFirstSprites();
        this.createBeachEdgeWestASecondSprites();
        this.createBeachEdgeWestBFirstSprites();
        this.createBeachEdgeWestBSecondSprites();

        this.createBeachCornerInnerNorthEastCenterSprites();
        this.createBeachCornerInnerNorthEastCornerSprites();
        this.createBeachCornerInnerNorthEastSouthSprites();
        this.createBeachCornerInnerNorthEastWestSprites();

        this.createBeachCornerInnerNorthWestCenterSprites();
        this.createBeachCornerInnerNorthWestCornerSprites();
        this.createBeachCornerInnerNorthWestSouthSprites();
        this.createBeachCornerInnerNorthWestEastSprites();

        this.createBeachCornerInnerSouthEastCenterSprites();
        this.createBeachCornerInnerSouthEastWestSprites();

        this.createBeachCornerInnerSouthWestCenterSprites();
        this.createBeachCornerInnerSouthWestEastSprites();


    }

    createBeachCornerInnerNorthEastCenterSprites() {
        const coords = this.getCoords();

        coords[5].push(...this.col(71));
        coords[7].push(...this.col(94, 104, 110));
        coords[8].push(...this.col(73));
        coords[11].push(...this.col(43));
        coords[20].push(...this.col(64, 97));
        coords[21].push(...this.col(55));

        this.createSprites(coords, "textures", "beach_corner_inner_northeast_center", 2, -1);
    }

    createBeachCornerInnerNorthEastCornerSprites() {
        const coords = this.getCoords();


        coords[6].push(...this.col(70));
        coords[8].push(...this.col(93, 103, 109));
        coords[9].push(...this.col(72));
        coords[12].push(...this.col(42));
        coords[21].push(...this.col(63, 96));
        coords[22].push(...this.col(54));

        this.createSprites(coords, "textures", "beach_corner_inner_northeast_corner", 2, -1);
    }

    createBeachCornerInnerNorthEastSouthSprites() {
        const coords = this.getCoords();

        coords[6].push(...this.col(71));
        coords[8].push(...this.col(94, 104, 110));
        coords[9].push(...this.col(73));
        coords[12].push(...this.col(43));
        coords[21].push(...this.col(64, 97));
        coords[22].push(...this.col(55));

        this.createSprites(coords, "textures", "beach_corner_inner_northeast_south", 2, -1);
    }

    createBeachCornerInnerNorthEastWestSprites() {
        const coords = this.getCoords();

        coords[5].push(...this.col(70));
        coords[7].push(...this.col(93, 103, 109));
        coords[8].push(...this.col(72));
        coords[11].push(...this.col(42))
        coords[20].push(...this.col(63, 96));
        coords[21].push(...this.col(54));

        this.createSprites(coords, "textures", "beach_corner_inner_northeast_west", 2, -1);
    }

    createBeachCornerInnerNorthWestCenterSprites() {
        const coords = this.getCoords();

        coords[5].push(...this.col(61, 81));
        coords[6].push(...this.col(117));
        coords[7].push(...this.col(101, 107));
        coords[8].push(...this.col(56, 76));
        coords[10].push(...this.col(50));
        coords[17].push(...this.col(119));
        coords[19].push(...this.col(34, 115));
        coords[20].push(...this.col(61, 92));

        this.createSprites(coords, "textures", "beach_corner_inner_northwest_center", 2, -1);
    }

    createBeachCornerInnerNorthWestCornerSprites() {
        const coords = this.getCoords();


        coords[6].push(...this.col(62, 82));
        coords[7].push(...this.col(118));
        coords[8].push(...this.col(102, 108));
        coords[9].push(...this.col(57, 77));
        coords[11].push(...this.col(51));
        coords[18].push(...this.col(120));
        coords[20].push(...this.col(35, 116));
        coords[21].push(...this.col(62, 93));

        this.createSprites(coords, "textures", "beach_corner_inner_northwest_corner", 2, -1);
    }

    createBeachCornerInnerNorthWestSouthSprites() {
        const coords = this.getCoords();

        coords[6].push(...this.col(61, 81));
        coords[7].push(...this.col(117));
        coords[8].push(...this.col(101, 107));
        coords[9].push(...this.col(56, 76));
        coords[11].push(...this.col(50));
        coords[18].push(...this.col(119));
        coords[20].push(...this.col(34, 115));
        coords[21].push(...this.col(61, 92));

        this.createSprites(coords, "textures", "beach_corner_inner_northwest_south", 2, -1);
    }

    createBeachCornerInnerNorthWestEastSprites() {
        const coords = this.getCoords();

        coords[5].push(...this.col(62, 82));
        coords[6].push(...this.col(118));
        coords[7].push(...this.col(102, 108));
        coords[8].push(...this.col(57, 77));
        coords[10].push(...this.col(51));
        coords[17].push(...this.col(120));
        coords[19].push(...this.col(116));
        coords[20].push(...this.col(62, 93));

        this.createSprites(coords, "textures", "beach_corner_inner_northwest_east", 2, -1);
    }

    createBeachCornerInnerSouthEastCenterSprites() {
        const coords = this.getCoords();

        coords[2].push(...this.col(48, 75, 94));
        coords[3].push(...this.col(109));
        coords[4].push(...this.col(41));
        coords[13].push(...this.col(84));
        coords[15].push(...this.col(81));
        coords[16].push(...this.col(60, 101));
        coords[17].push(...this.col(67));
        coords[18].push(...this.col(31, 55, 97));
        coords[19].push(...this.col(78));

        this.createSprites(coords, "textures", "beach_corner_inner_southeast_center", 2, -1);
    }

    createBeachCornerInnerSouthEastWestSprites() {
        const coords = this.getCoords();

        coords[2].push(...this.col(47, 74, 93));
        coords[3].push(...this.col(108));
        coords[4].push(...this.col(40));
        coords[13].push(...this.col(83));
        coords[15].push(...this.col(80));
        coords[16].push(...this.col(59, 100));
        coords[17].push(...this.col(66));
        coords[18].push(...this.col(30, 54, 96));
        coords[19].push(...this.col(77));

        this.createSprites(coords, "textures", "beach_corner_inner_southeast_west", 2, -1);
    }

    createBeachCornerInnerSouthWestCenterSprites() {
        const coords = this.getCoords();

        coords[2].push(...this.col(64, 79));
        coords[3].push(...this.col(99, 118));
        coords[13].push(...this.col(88));
        coords[16].push(...this.col(91));
        coords[17].push(...this.col(64, 70));
        coords[18].push(...this.col(93));

        this.createSprites(coords, "textures", "beach_corner_inner_southwest_center", 2, -1);
    }

    createBeachCornerInnerSouthWestEastSprites() {
        const coords = this.getCoords();

        coords[2].push(...this.col(65, 80));
        coords[3].push(...this.col(100, 119));
        coords[13].push(...this.col(89));
        coords[16].push(...this.col(92));
        coords[17].push(...this.col(65));
        coords[18].push(...this.col(94));

        this.createSprites(coords, "textures", "beach_corner_inner_southwest_east", 2, -1);
    }

    createBeachEdgeEastAFirstSprites() {
        const coords = this.getCoords();

        coords[2].push(...this.col(99, 118));
        coords[8].push(...this.col(117));
        coords[9].push(...this.col(68));
        coords[15].push(...this.col(91));
        coords[16].push(...this.col(64, 70));
        coords[19].push(...this.col(72));
        coords[21].push(...this.col(72, 115));

        this.createSprites(coords, "textures", "beach_edge_east_a_first", 2, -1);
    }

    createBeachEdgeEastASecondSprites() {
        const coords = this.getCoords();

        coords[2].push(...this.col(100, 119));
        coords[8].push(...this.col(118));
        coords[9].push(...this.col(69));
        coords[15].push(...this.col(92));
        coords[16].push(...this.col(65, 71));
        coords[19].push(...this.col(73));
        coords[21].push(...this.col(73, 116));

        this.createSprites(coords, "textures", "beach_edge_east_a_second", 2, -1);
    }

    createBeachEdgeEastBFirstSprites() {
        const coords = this.getCoords();

        coords[20].push(...this.col(72));

        this.createSprites(coords, "textures", "beach_edge_east_b_first", 2, -1);
    }

    createBeachEdgeEastBSecondSprites() {
        const coords = this.getCoords();

        coords[20].push(...this.col(73));

        this.createSprites(coords, "textures", "beach_edge_east_a_second", 2, -1);
    }

    createBeachEdgeNorthASprites() {
        const coords = this.getCoords();

        coords[0].push(...this.col(50, 52, 54, 56, 58, 60, 62, 77, 96, 111, 113, 115));
        coords[2].push(...this.col(43, 45, 66, 68, 70, 72, 81, 83));
        coords[3].push(...this.col(101, 103, 105, 107));
        coords[7].push(...this.col(66));
        coords[11].push(...this.col(86));
        coords[14].push(...this.col(62, 103, 105, 107, 109, 111, 113, 115, 117, 119, 121));
        coords[16].push(...this.col(33, 57, 99));
        coords[18].push(...this.col(52, 95));

        this.createSprites(coords, "textures", "beach_edge_north_a", 2, -1);
    }

    createBeachEdgeNorthBSprites() {
        const coords = this.getCoords();

        coords[0].push(...this.col(51, 53, 55, 57, 59, 61, 97, 112, 114, 116));
        coords[2].push(...this.col(44, 46, 67, 69, 71, 73, 82, 84));
        coords[3].push(...this.col(102, 104, 106));
        coords[14].push(...this.col(104, 106, 108, 110, 112, 114, 116, 118, 120, 122));
        coords[16].push(...this.col(34, 58));
        coords[18].push(...this.col(53));

        this.createSprites(coords, "textures", "beach_edge_north_b", 2, -1);
    }

    createBeachEdgeSouthAFirstSprites() {
        const coords = this.getCoords();

        coords[5].push(...this.col(63, 65, 67, 69, 83));
        coords[6].push(...this.col(119));
        coords[8].push(...this.col(58, 78));
        coords[10].push(...this.col(52, 54, 96, 98, 112, 114));
        coords[11].push(...this.col(40, 66));
        coords[13].push(...this.col(45, 47));
        coords[17].push(...this.col(121));
        coords[19].push(...this.col(117));
        coords[20].push(...this.col(94));
        coords[21].push(...this.col(52));
        coords[22].push(...this.col(30, 32));
        coords[23].push(...this.col(57, 59, 66, 68, 70, 77, 79, 81, 83, 85, 87, 89, 99, 101, 103, 105, 107, 109, 111, 113));

        this.createSprites(coords, "textures", "beach_edge_south_a_first", 2, -1);
    }

    createBeachEdgeSouthASecondSprites() {
        const coords = this.getCoords();

        coords[6].push(...this.col(63, 65, 67, 69, 83));
        coords[7].push(...this.col(119));
        coords[9].push(...this.col(58, 78));
        coords[11].push(...this.col(52, 54, 96, 98, 112, 114));
        coords[12].push(...this.col(40, 66));
        coords[14].push(...this.col(45, 47));
        coords[18].push(...this.col(121));
        coords[20].push(...this.col(117));
        coords[21].push(...this.col(94));
        coords[22].push(...this.col(52));
        coords[23].push(...this.col(30, 32));
        coords[24].push(...this.col(57, 59, 66, 68, 70, 77, 79, 81, 83, 85, 87, 89, 99, 101, 103, 105, 107, 109, 111, 113));

        this.createSprites(coords, "textures", "beach_edge_south_a_second", 2, -1);
    }

    createBeachEdgeSouthBFirstSprites() {
        const coords = this.getCoords();


        coords[5].push(...this.col(64, 66, 68, 84));
        coords[8].push(...this.col(59, 79));
        coords[10].push(...this.col(53, 97, 99, 113, 115));
        coords[11].push(...this.col(41));
        coords[13].push(...this.col(46, 48));
        coords[17].push(...this.col(122));
        coords[20].push(...this.col(95));
        coords[21].push(...this.col(53));
        coords[22].push(...this.col(31));
        coords[23].push(...this.col(58, 67, 69, 78, 80, 82, 84, 86, 88, 90, 100, 102, 104, 106, 108, 110, 112));

        this.createSprites(coords, "textures", "beach_edge_south_b_first", 2, -1);
    }

    createBeachEdgeSouthBSecondSprites() {
        const coords = this.getCoords();

        coords[6].push(...this.col(64, 66, 68, 84));
        coords[9].push(...this.col(59, 79));
        coords[11].push(...this.col(53, 97, 99, 113, 115));
        coords[12].push(...this.col(41));
        coords[14].push(...this.col(46, 48));
        coords[18].push(...this.col(122));
        coords[21].push(...this.col(95));
        coords[22].push(...this.col(53));
        coords[23].push(...this.col(31));
        coords[24].push(...this.col(58, 67, 69, 78, 80, 82, 84, 86, 88, 90, 100, 102, 104, 106, 108, 110, 112));

        this.createSprites(coords, "textures", "beach_edge_south_b_second", 2, -1);
    }

    createBeachEdgeWestAFirstSprites() {
        const coords = this.getCoords();

        coords[2].push(...this.col(109));
        coords[4].push(...this.col(91));
        coords[6].push(...this.col(38));
        coords[8].push(...this.col(38));
        coords[9].push(...this.col(64));
        coords[16].push(...this.col(67));
        coords[18].push(...this.col(78));
        coords[20].push(...this.col(28));
        coords[21].push(...this.col(75));

        this.createSprites(coords, "textures", "beach_edge_west_a_first", 2, -1);
    }

    createBeachEdgeWestASecondSprites() {
        const coords = this.getCoords();

        coords[2].push(...this.col(108));
        coords[4].push(...this.col(90));
        coords[6].push(...this.col(37));
        coords[8].push(...this.col(37));
        coords[9].push(...this.col(63));
        coords[16].push(...this.col(66));
        coords[18].push(...this.col(77));
        coords[20].push(...this.col(27));
        coords[21].push(...this.col(74));

        this.createSprites(coords, "textures", "beach_edge_west_a_second", 2, -1);
    }

    createBeachEdgeWestBFirstSprites() {
        const coords = this.getCoords();


        coords[5].push(...this.col(91));
        coords[7].push(...this.col(38));
        coords[9].push(...this.col(38));

        coords[17].push(...this.col(78));

        this.createSprites(coords, "textures", "beach_edge_west_b_first", 2, -1);
    }

    createBeachEdgeWestBSecondSprites() {
        const coords = this.getCoords();

        coords[5].push(...this.col(90));
        coords[7].push(...this.col(37));
        coords[9].push(...this.col(37));
        coords[17].push(...this.col(77));

        this.createSprites(coords, "textures", "beach_edge_west_b_second", 2, -1);
    }

    createBeachCornerNorthEastEdgeNorthSprites() {
        const coords = this.getCoords();

        coords[0].push(...this.col(63, 78, 98, 117));
        coords[2].push(...this.col(85));
        coords[3].push(...this.col(120));
        coords[5].push(...this.col(132));
        coords[7].push(...this.col(67));
        coords[11].push(...this.col(87));
        coords[13].push(...this.col(90));
        coords[14].push(...this.col(63, 69, 123));
        coords[16].push(...this.col(35, 92));
        coords[17].push(...this.col(71));
        coords[20].push(...this.col(42));

        this.createSprites(coords, "textures", "beach_corner_northeast_edge_north", 2, -1);
    }

    createBeachCornerNorthEastCenterSprites() {
        const coords = this.getCoords();

        coords[0].push(...this.col(64, 79, 99, 118));
        coords[2].push(...this.col(86));
        coords[3].push(...this.col(121));
        coords[5].push(...this.col(133));
        coords[7].push(...this.col(68));
        coords[11].push(...this.col(88));
        coords[13].push(...this.col(91));
        coords[14].push(...this.col(64, 70, 124));
        coords[16].push(...this.col(36, 93));
        coords[17].push(...this.col(72));
        coords[20].push(...this.col(43));

        this.createSprites(coords, "textures", "beach_corner_northeast_center", 2, -1);
    }

    createBeachCornerNorthEastEdgeEastFirstSprites() {
        const coords = this.getCoords();

        coords[1].push(...this.col(64, 79, 99, 118));
        coords[3].push(...this.col(86));
        coords[4].push(...this.col(121));
        coords[6].push(...this.col(133));
        coords[8].push(...this.col(68));
        coords[12].push(...this.col(88));
        coords[14].push(...this.col(91));
        coords[15].push(...this.col(64, 70, 124));
        coords[17].push(...this.col(36, 93));
        coords[18].push(...this.col(72));
        coords[21].push(...this.col(43));

        this.createSprites(coords, "textures", "beach_corner_northeast_edge_east_first", 2, -1);
    }

    createBeachCornerNorthEastEdgeEastSecondSprites() {
        const coords = this.getCoords();

        coords[1].push(...this.col(65, 80, 100, 119));
        coords[3].push(...this.col(87));
        coords[4].push(...this.col(122));
        coords[6].push(...this.col(134));
        coords[8].push(...this.col(69));
        coords[12].push(...this.col(89));
        coords[14].push(...this.col(92));
        coords[15].push(...this.col(65, 71, 125));
        coords[17].push(...this.col(37, 94));
        coords[18].push(...this.col(73));
        coords[21].push(...this.col(44));

        this.createSprites(coords, "textures", "beach_corner_northeast_edge_east_second", 2, -1);
    }

    createBeachCornerNorthWestEdgeNorthSprites() {
        const coords = this.getCoords();

        coords[0].push(...this.col(49, 76, 95, 110));
        coords[2].push(...this.col(42, 92));
        coords[4].push(...this.col(39));
        coords[5].push(...this.col(131));
        coords[7].push(...this.col(65));
        coords[11].push(...this.col(85));
        coords[13].push(...this.col(82));
        coords[14].push(...this.col(61, 68, 102));
        coords[15].push(...this.col(79));
        coords[16].push(...this.col(32, 56, 98));
        coords[18].push(...this.col(29, 51));
        coords[19].push(...this.col(76));
        coords[20].push(...this.col(41));

        this.createSprites(coords, "textures", "beach_corner_northwest_edge_north", 2, -1);
    }

    createBeachCornerNorthWestCenterSprites() {
        const coords = this.getCoords();

        coords[0].push(...this.col(48, 75, 94, 109));
        coords[2].push(...this.col(41, 91));
        coords[4].push(...this.col(38));
        coords[5].push(...this.col(130));
        coords[7].push(...this.col(64));
        coords[11].push(...this.col(84));
        coords[13].push(...this.col(81));
        coords[14].push(...this.col(60, 67, 101));
        coords[15].push(...this.col(78));
        coords[16].push(...this.col(31, 55, 97));
        coords[18].push(...this.col(28, 50));
        coords[19].push(...this.col(75));
        coords[20].push(...this.col(40));

        this.createSprites(coords, "textures", "beach_corner_northwest_center", 2, -1);
    }

    createBeachCornerNorthWestEdgeWestFirstSprites() {
        const coords = this.getCoords();

        coords[1].push(...this.col(48, 75, 94, 109));
        coords[3].push(...this.col(41, 91));
        coords[5].push(...this.col(38));
        coords[6].push(...this.col(130));
        coords[8].push(...this.col(64));
        coords[12].push(...this.col(84));
        coords[14].push(...this.col(81));
        coords[15].push(...this.col(60, 67, 101));
        coords[16].push(...this.col(78));
        coords[17].push(...this.col(31, 55, 97));
        coords[19].push(...this.col(28, 50));
        coords[20].push(...this.col(75));
        coords[21].push(...this.col(40));

        this.createSprites(coords, "textures", "beach_corner_northwest_edge_west_first", 2, -1);
    }

    createBeachCornerNorthWestEdgeWestSecondSprites() {
        const coords = this.getCoords();

        coords[1].push(...this.col(47, 74, 93, 108));
        coords[3].push(...this.col(40, 90));
        coords[5].push(...this.col(37));
        coords[6].push(...this.col(129));
        coords[8].push(...this.col(63));
        coords[12].push(...this.col(83));
        coords[14].push(...this.col(80));
        coords[15].push(...this.col(59, 66, 100));
        coords[16].push(...this.col(77));
        coords[17].push(...this.col(30, 54, 96));
        coords[19].push(...this.col(27, 49));
        coords[20].push(...this.col(74));
        coords[21].push(...this.col(39));

        this.createSprites(coords, "textures", "beach_corner_northwest_edge_west_second", 2, -1);
    }

    createBeachCornerSouthEastEdgeEastFirstSprites() {
        const coords = this.getCoords();

        coords[4].push(...this.col(86));
        coords[5].push(...this.col(121));
        coords[7].push(...this.col(61, 81, 133));
        coords[9].push(...this.col(101, 107, 117));
        coords[10].push(...this.col(68, 76));
        coords[12].push(...this.col(50));
        coords[16].push(...this.col(124));
        coords[18].push(...this.col(36));
        coords[21].push(...this.col(34));
        coords[22].push(...this.col(43, 61, 72, 92, 115));

        this.createSprites(coords, "textures", "beach_corner_southeast_edge_east_first", 2, -1);
    }

    createBeachCornerSouthEastEdgeEastSecondSprites() {
        const coords = this.getCoords();

        coords[4].push(...this.col(87));
        coords[5].push(...this.col(122));
        coords[7].push(...this.col(62, 82, 134));
        coords[9].push(...this.col(102, 108, 118));
        coords[10].push(...this.col(69, 77));
        coords[12].push(...this.col(51));
        coords[16].push(...this.col(125));
        coords[18].push(...this.col(37));
        coords[21].push(...this.col(35));
        coords[22].push(...this.col(44, 62, 73, 93, 116));

        this.createSprites(coords, "textures", "beach_corner_southeast_edge_east_second", 2, -1);
    }

    createBeachCornerSouthEastEdgeSouthFirstSprites() {
        const coords = this.getCoords();

        coords[5].push(...this.col(85));
        coords[6].push(...this.col(120));
        coords[8].push(...this.col(60, 80, 132));
        coords[10].push(...this.col(55, 100, 106, 116));
        coords[11].push(...this.col(67, 75));
        coords[13].push(...this.col(49));
        coords[17].push(...this.col(123));
        coords[19].push(...this.col(35, 118));
        coords[22].push(...this.col(33));
        coords[23].push(...this.col(42, 60, 71, 91, 114));

        this.createSprites(coords, "textures", "beach_corner_southeast_edge_south_first", 2, -1);
    }

    createBeachCornerSouthEastCenterSprites() {
        const coords = this.getCoords();

        coords[5].push(...this.col(86));
        coords[6].push(...this.col(121));
        coords[8].push(...this.col(61, 81, 133));
        coords[10].push(...this.col(56, 101, 107, 117));
        coords[11].push(...this.col(68, 76));
        coords[13].push(...this.col(50));
        coords[17].push(...this.col(124));
        coords[19].push(...this.col(36, 119));
        coords[22].push(...this.col(34));
        coords[23].push(...this.col(43, 61, 72, 92, 115));

        this.createSprites(coords, "textures", "beach_corner_southeast_center", 2, -1);
    }

    createBeachCornerSouthEastEastSprites() {
        const coords = this.getCoords();

        coords[5].push(...this.col(87));
        coords[6].push(...this.col(122));
        coords[8].push(...this.col(62, 82, 134));
        coords[10].push(...this.col(57, 102, 108, 118));
        coords[11].push(...this.col(69, 77));
        coords[13].push(...this.col(51));
        coords[17].push(...this.col(125));
        coords[19].push(...this.col(37, 120));
        coords[22].push(...this.col(35));
        coords[23].push(...this.col(44, 62, 73, 93, 116));

        this.createSprites(coords, "textures", "beach_corner_southeast_east", 2, -1);
    }

    createBeachCornerSouthEastEdgeSouthSecondSprites() {
        const coords = this.getCoords();

        coords[6].push(...this.col(85));
        coords[7].push(...this.col(120));
        coords[9].push(...this.col(60, 80, 132));
        coords[11].push(...this.col(55, 100, 106, 116));
        coords[12].push(...this.col(67, 75));
        coords[14].push(...this.col(49));
        coords[18].push(...this.col(123));
        coords[20].push(...this.col(35, 118));
        coords[23].push(...this.col(33));
        coords[24].push(...this.col(42, 60, 71, 91, 114));

        this.createSprites(coords, "textures", "beach_corner_southeast_edge_south_second", 2, -1);
    }

    createBeachCornerSouthEastSouthSprites() {
        const coords = this.getCoords();

        coords[6].push(...this.col(86));
        coords[7].push(...this.col(121));
        coords[9].push(...this.col(61, 81, 133));
        coords[11].push(...this.col(56, 101, 107, 117));
        coords[12].push(...this.col(68, 76));
        coords[14].push(...this.col(50));
        coords[18].push(...this.col(124));
        coords[20].push(...this.col(36, 119));
        coords[23].push(...this.col(34));
        coords[24].push(...this.col(43, 61, 72, 92, 115));

        this.createSprites(coords, "textures", "beach_corner_southeast_south", 2, -1);
    }

    createBeachCornerSouthWestEdgeWestFirstSprites() {
        const coords = this.getCoords();

        coords[6].push(...this.col(91));
        coords[7].push(...this.col(71, 130));
        coords[9].push(...this.col(94, 104, 110));
        coords[10].push(...this.col(38, 64, 73));
        coords[20].push(...this.col(50));
        coords[21].push(...this.col(28));
        coords[22].push(...this.col(40, 64, 75, 97));

        this.createSprites(coords, "textures", "beach_corner_southwest_edge_west_first", 2, -1);
    }

    createBeachCornerSouthWestEdgeWestSecondSprites() {
        const coords = this.getCoords();

        coords[6].push(...this.col(90));
        coords[7].push(...this.col(70, 129));
        coords[9].push(...this.col(93, 103, 109));
        coords[10].push(...this.col(37, 63, 72));
        coords[20].push(...this.col(49));
        coords[21].push(...this.col(27));
        coords[22].push(...this.col(39, 63, 74, 96));

        this.createSprites(coords, "textures", "beach_corner_southwest_edge_west_second", 2, -1);
    }

    createBeachCornerSouthWestEdgeSouthFirstSprites() {
        const coords = this.getCoords();

        coords[7].push(...this.col(92));
        coords[8].push(...this.col(72, 131));
        coords[10].push(...this.col(95, 105, 111));
        coords[11].push(...this.col(39, 65, 74));
        coords[13].push(...this.col(44));
        coords[21].push(...this.col(51));
        coords[22].push(...this.col(29));
        coords[23].push(...this.col(41, 56, 65, 76, 98));

        this.createSprites(coords, "textures", "beach_corner_southwest_edge_south_first", 2, -1);
    }

    createBeachCornerSouthWestCenterSprites() {
        const coords = this.getCoords();

        coords[7].push(...this.col(91));
        coords[8].push(...this.col(71, 130));
        coords[10].push(...this.col(94, 104, 110));
        coords[11].push(...this.col(38, 64, 73));
        coords[13].push(...this.col(43));
        coords[21].push(...this.col(50));
        coords[22].push(...this.col(28));
        coords[23].push(...this.col(40, 55, 64, 75, 97));

        this.createSprites(coords, "textures", "beach_corner_southwest_center", 2, -1);
    }

    createBeachCornerSouthWestWestSprites() {
        const coords = this.getCoords();

        coords[7].push(...this.col(90));
        coords[8].push(...this.col(70, 129));
        coords[10].push(...this.col(93, 103, 109));
        coords[11].push(...this.col(37, 63, 72));
        coords[13].push(...this.col(42));
        coords[21].push(...this.col(49));
        coords[22].push(...this.col(27));
        coords[23].push(...this.col(39, 54, 63, 74, 96));

        this.createSprites(coords, "textures", "beach_corner_southwest_west", 2, -1);
    }

    createBeachCornerSouthWestEdgeSouthSecondSprites() {
        const coords = this.getCoords();

        coords[8].push(...this.col(92));
        coords[9].push(...this.col(131));
        coords[11].push(...this.col(95, 105, 111));
        coords[12].push(...this.col(39, 65, 74));
        coords[14].push(...this.col(44));
        coords[22].push(...this.col(51));
        coords[23].push(...this.col(29));
        coords[24].push(...this.col(41, 56, 65, 76, 98));

        this.createSprites(coords, "textures", "beach_corner_southwest_edge_south_second", 2, -1);
    }

    createBeachCornerSouthWestSouthSprites() {
        const coords = this.getCoords();

        coords[8].push(...this.col(91));
        coords[9].push(...this.col(71, 130));
        coords[11].push(...this.col(94, 104, 110));
        coords[12].push(...this.col(38, 64, 73));
        coords[14].push(...this.col(43));
        coords[22].push(...this.col(50));
        coords[23].push(...this.col(28));
        coords[24].push(...this.col(40, 55, 64, 75, 97));

        this.createSprites(coords, "textures", "beach_corner_southwest_south", 2, -1);
    }

    createGrassCenterImages() {
        const coords = this.getCoords();

        coords[2].push(...this.col(...this.stripe(50, 62), 77, 96, 97, ...this.stripe(111, 116)));
        coords[3].push(...this.col(...this.stripe(49, 63), ...this.stripe(76, 78), 95, 96, ...this.stripe(111, 116)));
        coords[4].push(...this.col(...this.stripe(43, 60), ...this.stripe(72, 80), ...this.stripe(93, 95), ...this.stripe(110, 117)));
        coords[5].push(...this.col(...this.stripe(42, 59), ...this.stripe(73, 79), ...this.stripe(93, 95), ...this.stripe(100, 116)));
        coords[6].push(...this.col(...this.stripe(40, 59), ...this.stripe(73, 79), 95, 100, 105, 106, ...this.stripe(111, 115)));
        coords[7].push(...this.col(...this.stripe(40, 55), 74, 75, 96, ...this.stripe(112, 115)));
        coords[8].push(...this.col(...this.stripe(40, 54), ...this.stripe(96, 99), ...this.stripe(112, 115)));
        coords[9].push(...this.col(...this.stripe(40, 49), 66));
        coords[10].push(...this.col(...this.stripe(44, 48)));
        coords[11].push(...this.col(...this.stripe(45, 48)));
        coords[13].push(...this.col(86));
        coords[14].push(...this.col(...this.stripe(85, 87)));
        coords[15].push(...this.col(...this.stripe(83, 89)));
        coords[16].push(...this.col(62, ...this.stripe(82, 89), ...this.stripe(103, 118)));
        coords[17].push(...this.col(61, 62, 80, ...this.stripe(84, 91), ...this.stripe(102, 117)));
        coords[18].push(...this.col(33, ...this.stripe(57, 63), 68, 69, ...this.stripe(85, 91), ...this.stripe(99, 114)));
        coords[19].push(...this.col(32, ...this.stripe(56, 60), ...this.stripe(65, 70), ...this.stripe(85, 91), ...this.stripe(98, 113)));
        coords[20].push(...this.col(...this.stripe(30, 32), ...this.stripe(56, 59), ...this.stripe(66, 70), 79, ...this.stripe(85, 90), ...this.stripe(99, 113)));
        coords[21].push(...this.col(...this.stripe(57, 59), ...this.stripe(66, 70), ...this.stripe(77, 79), ...this.stripe(85, 90), ...this.stripe(99, 113)));

        this.createImages(coords, "textures", "grass_center");
    }

    createGrassCornerNorthEastImages() {
        const coords = this.getCoords();

        coords[1].push(...this.col(63, 78, 98, 117));
        coords[3].push(...this.col(85));
        coords[4].push(...this.col(120));
        coords[6].push(...this.col(132));
        coords[8].push(...this.col(67));
        coords[12].push(...this.col(87));
        coords[14].push(...this.col(90));
        coords[15].push(...this.col(63, 69, 123));
        coords[17].push(...this.col(35, 92));
        coords[18].push(...this.col(71));
        coords[21].push(...this.col(42));

        this.createImages(coords, "textures", "grass_corner_northeast");
    }

    createGrassCornerNorthWestImages() {
        const coords = this.getCoords();

        coords[1].push(...this.col(49, 76, 95, 110));
        coords[3].push(...this.col(42, 92));
        coords[5].push(...this.col(39));
        coords[6].push(...this.col(131));
        coords[8].push(...this.col(65));
        coords[12].push(...this.col(85));
        coords[14].push(...this.col(82));
        coords[15].push(...this.col(61, 68, 102));
        coords[16].push(...this.col(79));
        coords[17].push(...this.col(32, 56, 98));
        coords[19].push(...this.col(29, 51));
        coords[20].push(...this.col(76));
        coords[21].push(...this.col(41));

        this.createImages(coords, "textures", "grass_corner_northwest");
    }

    createGrassCornerSouthEastImages() {
        const coords = this.getCoords();

        coords[4].push(...this.col(85));
        coords[5].push(...this.col(120));
        coords[7].push(...this.col(60, 80, 132));
        coords[9].push(...this.col(55, 100, 106, 116));
        coords[10].push(...this.col(67, 75));
        coords[12].push(...this.col(49));
        coords[16].push(...this.col(123));
        coords[18].push(...this.col(35, 118));
        coords[21].push(...this.col(33));
        coords[22].push(...this.col(42, 60, 71, 91, 114));

        this.createImages(coords, "textures", "grass_corner_southeast");
    }

    createGrassCornerSouthWestImages() {
        const coords = this.getCoords();

        coords[6].push(...this.col(92));
        coords[7].push(...this.col(72, 131));
        coords[9].push(...this.col(95, 105, 111));
        coords[10].push(...this.col(39, 65, 74));
        coords[12].push(...this.col(44));
        coords[20].push(...this.col(51));
        coords[21].push(...this.col(29));
        coords[22].push(...this.col(41, 56, 65, 76, 98));

        this.createImages(coords, "textures", "grass_corner_southwest");
    }

    createGrassEdgeEastAImages() {
        const coords = this.getCoords();

        coords[2].push(...this.col(63, 78, 98, 117));
        coords[4].push(...this.col(96));
        coords[6].push(...this.col(60, 96, 80, 116));
        coords[8].push(...this.col(55, 100, 106, 116));
        coords[9].push(...this.col(67, 75));
        coords[11].push(...this.col(49));
        coords[13].push(...this.col(87));
        coords[15].push(...this.col(90));
        coords[16].push(...this.col(63, 69));
        coords[17].push(...this.col(118));
        coords[18].push(...this.col(80, 92));
        coords[19].push(...this.col(33, 71, 114));
        coords[20].push(...this.col(60, 80));
        coords[21].push(...this.col(71, 91, 114));

        this.createImages(coords, "textures", "grass_edge_east_a");
    }

    createGrassEdgeEastBImages() {
        const coords = this.getCoords();

        coords[3].push(...this.col(98, 117));
        coords[5].push(...this.col(60, 96, 80));
        coords[7].push(...this.col(100, 106, 116));
        coords[8].push(...this.col(75));
        coords[10].push(...this.col(49));
        coords[16].push(...this.col(90));
        coords[17].push(...this.col(63, 69));
        coords[19].push(...this.col(80));
        coords[20].push(...this.col(33, 71, 91, 114));
        coords[21].push(...this.col(60, 80));

        this.createImages(coords, "textures", "grass_edge_east_b");
    }

    createGrassEdgeNorthAImages() {
        const coords = this.getCoords();

        coords[1].push(...this.col(50, 52, 54, 56, 58, 60, 62, 77, 96, 111, 113, 115));
        coords[3].push(...this.col(43, 45, 47, 64, 66, 68, 70, 72, 74, 79, 81, 83, 93));
        coords[4].push(...this.col(100, 102, 104, 106, 108, 119));
        coords[5].push(...this.col(40));
        coords[7].push(...this.col(97, 99));
        coords[8].push(...this.col(66));
        coords[12].push(...this.col(86));
        coords[14].push(...this.col(83, 88));
        coords[15].push(...this.col(62, 103, 105, 107, 109, 111, 113, 115, 117, 119, 121));
        coords[16].push(...this.col(80));
        coords[17].push(...this.col(33, 57, 59, 99, 101));
        coords[18].push(...this.col(64, 66, 70));
        coords[19].push(...this.col(30, 52, 54));
        coords[20].push(...this.col(77));

        this.createImages(coords, "textures", "grass_edge_north_a");
    }

    createGrassEdgeNorthBImages() {
        const coords = this.getCoords();

        coords[1].push(...this.col(51, 53, 55, 57, 59, 61, 97, 112, 114, 116));
        coords[3].push(...this.col(44, 46, 48, 65, 67, 69, 71, 73, 75, 80, 82, 84, 94));
        coords[4].push(...this.col(101, 103, 105, 107, 109, 118));
        coords[5].push(...this.col(41));
        coords[7].push(...this.col(98));
        coords[14].push(...this.col(84, 89));
        coords[15].push(...this.col(104, 106, 108, 110, 112, 114, 116, 118, 120, 122));
        coords[16].push(...this.col(81));
        coords[17].push(...this.col(34, 58, 60, 100));
        coords[18].push(...this.col(65, 67));
        coords[19].push(...this.col(31, 53, 55));
        coords[20].push(...this.col(78));

        this.createImages(coords, "textures", "grass_edge_north_b");
    }

    createGrassEdgeSouthAImages() {
        const coords = this.getCoords();

        coords[3].push(...this.col(97));
        coords[4].push(...this.col(61, 63, 65, 67, 69, 71, 81, 83));
        coords[5].push(...this.col(117, 119));
        coords[6].push(...this.col(93, 101, 103, 107, 109));
        coords[7].push(...this.col(56, 58, 73, 76, 78));
        coords[9].push(...this.col(50, 52, 54, 96, 98, 112, 114));
        coords[10].push(...this.col(40, 42, 66));
        coords[12].push(...this.col(45, 47));
        coords[16].push(...this.col(120, 122));
        coords[17].push(...this.col(81, 83));
        coords[18].push(...this.col(34, 115, 117));
        coords[19].push(...this.col(61, 63, 92, 94, 96));
        coords[20].push(...this.col(52, 54));
        coords[21].push(...this.col(30, 32));
        coords[22].push(...this.col(57, 59, 66, 68, 70, 77, 79, 81, 83, 85, 87, 89, 99, 101, 103, 105, 107, 109, 111, 113));

        this.createImages(coords, "textures", "grass_edge_south_a");
    }

    createGrassEdgeSouthBImages() {
        const coords = this.getCoords();

        coords[4].push(...this.col(62, 64, 66, 68, 70, 82, 84));
        coords[5].push(...this.col(118));
        coords[6].push(...this.col(94, 102, 104, 108, 110));
        coords[7].push(...this.col(57, 59, 77, 79));
        coords[9].push(...this.col(51, 53, 97, 99, 113, 115));
        coords[10].push(...this.col(41, 43));
        coords[12].push(...this.col(46, 48));
        coords[16].push(...this.col(121, 119));
        coords[17].push(...this.col(82));
        coords[18].push(...this.col(116));
        coords[19].push(...this.col(62, 64, 93, 95, 97));
        coords[20].push(...this.col(53, 55));
        coords[21].push(...this.col(31));
        coords[22].push(...this.col(58, 67, 69, 78, 80, 82, 84, 86, 88, 90, 100, 102, 104, 106, 108, 110, 112));

        this.createImages(coords, "textures", "grass_edge_south_b");
    }

    createGrassEdgeWestAImages() {
        const coords = this.getCoords();

        coords[2].push(...this.col(49, 76, 95, 110));
        coords[4].push(...this.col(42, 92));
        coords[6].push(...this.col(39, 72));
        coords[8].push(...this.col(95, 105, 111));
        coords[9].push(...this.col(65, 74));
        coords[8].push(...this.col(39));
        coords[11].push(...this.col(44));
        coords[13].push(...this.col(85));
        coords[15].push(...this.col(82));
        coords[16].push(...this.col(61, 68, 102));
        coords[17].push(...this.col(79));
        coords[18].push(...this.col(32, 56, 84, 98));
        coords[19].push(...this.col(79));
        coords[20].push(...this.col(29, 65, 84));
        coords[21].push(...this.col(56, 76, 98));

        this.createImages(coords, "textures", "grass_edge_west_a");
    }

    createGrassEdgeWestBImages() {
        const coords = this.getCoords();

        coords[3].push(...this.col(110));
        coords[5].push(...this.col(72, 92));
        coords[7].push(...this.col(39, 95, 105, 111));
        coords[8].push(...this.col(74));
        coords[9].push(...this.col(39));
        coords[17].push(...this.col(68));
        coords[18].push(...this.col(79));
        coords[19].push(...this.col(84));
        coords[20].push(...this.col(98));
        coords[21].push(...this.col(65, 84));

        this.createImages(coords, "textures", "grass_edge_west_b");
    }

    createDeepOceanCenterImages() {
        const coords = this.getCoords();

        coords[0].push(...this.col(...this.stripe(0, 38), ...this.stripe(103, 105), ...this.stripe(122, 159)));
        coords[1].push(...this.col(...this.stripe(0, 37), ...this.stripe(124, 159)));
        coords[2].push(...this.col(...this.stripe(0, 35), ...this.stripe(125, 159)));
        coords[3].push(...this.col(...this.stripe(0, 34), ...this.stripe(125, 127), ...this.stripe(136, 159)));
        coords[4].push(...this.col(...this.stripe(0, 34), 125, 126, ...this.stripe(137, 159)));
        coords[5].push(...this.col(...this.stripe(0, 34), 125, 126, ...this.stripe(137, 159)));
        coords[6].push(...this.col(...this.stripe(0, 34), 125, 126, ...this.stripe(137, 159)));
        coords[7].push(...this.col(...this.stripe(0, 34), 125, 126, ...this.stripe(137, 159)));
        coords[8].push(...this.col(...this.stripe(0, 34), 125, 126, ...this.stripe(137, 159)));
        coords[9].push(...this.col(...this.stripe(0, 34), ...this.stripe(124, 127), ...this.stripe(137, 159)));
        coords[10].push(...this.col(...this.stripe(0, 34), ...this.stripe(121, 127), ...this.stripe(137, 159)));
        coords[11].push(...this.col(...this.stripe(0, 34), ...this.stripe(121, 127), ...this.stripe(136, 159)));
        coords[12].push(...this.col(...this.stripe(0, 34), ...this.stripe(127, 159)));
        coords[13].push(...this.col(...this.stripe(0, 34), ...this.stripe(128, 159)));
        coords[14].push(...this.col(...this.stripe(0, 28), ...this.stripe(128, 159)));
        coords[15].push(...this.col(...this.stripe(0, 27), ...this.stripe(128, 159)));
        coords[16].push(...this.col(...this.stripe(0, 25), ...this.stripe(128, 159)));
        coords[17].push(...this.col(...this.stripe(0, 24), ...this.stripe(40, 46), ...this.stripe(128, 159)));
        coords[18].push(...this.col(...this.stripe(0, 24), 46, ...this.stripe(128, 159)));
        coords[19].push(...this.col(...this.stripe(0, 24), ...this.stripe(128, 159)));
        coords[20].push(...this.col(...this.stripe(0, 24), ...this.stripe(127, 159)));
        coords[21].push(...this.col(...this.stripe(0, 24), ...this.stripe(123, 159)));
        coords[22].push(...this.col(...this.stripe(0, 24), ...this.stripe(122, 159)));
        coords[23].push(...this.col(...this.stripe(0, 24), ...this.stripe(119, 159)));
        coords[24].push(...this.col(...this.stripe(0, 24), 47, ...this.stripe(119, 159)));

        this.createImages(coords, "textures", "deep_ocean_center");
    }

    createDeepOceanCornerInnerNorthEastSprites() {
        const coords = this.getCoords();

        coords[0].push(...this.col(88));
        coords[1].push(...this.col(123));
        coords[2].push(...this.col(124));
        coords[3].push(...this.col(135));
        coords[4].push(...this.col(136));
        coords[12].push(...this.col(126));
        coords[13].push(...this.col(127));
        coords[18].push(...this.col(45));
        coords[19].push(...this.col(46));

        this.createSprites(coords, "textures", "deep_ocean_corner_inner_northeast", 2, -1);
    }

    createDeepOceanCornerInnerNorthWestSprites() {
        const coords = this.getCoords();

        coords[0].push(...this.col(39, 89));
        coords[1].push(...this.col(38));
        coords[2].push(...this.col(36));
        coords[3].push(...this.col(35, 128));
        coords[4].push(...this.col(127));
        coords[14].push(...this.col(29));
        coords[15].push(...this.col(28));
        coords[16].push(...this.col(26));
        coords[17].push(...this.col(25, 47));

        this.createSprites(coords, "textures", "deep_ocean_corner_inner_northwest", 2, -1);
    }

    createDeepOceanCornerInnerSouthEastSprites() {
        const coords = this.getCoords();

        coords[8].push(...this.col(124));
        coords[9].push(...this.col(123));
        coords[10].push(...this.col(136));
        coords[11].push(...this.col(135));
        coords[19].push(...this.col(127));
        coords[20].push(...this.col(126));
        coords[21].push(...this.col(122));
        coords[22].push(...this.col(121));

        this.createSprites(coords, "textures", "deep_ocean_corner_inner_southeast", 2, -1);
    }

    createDeepOceanCornerInnerSouthWestSprites() {
        const coords = this.getCoords();

        coords[11].push(...this.col(128));
        coords[13].push(...this.col(35));
        coords[16].push(...this.col(40));
        coords[23].push(...this.col(47));
        coords[24].push(...this.col(25, 48));

        this.createSprites(coords, "textures", "deep_ocean_corner_inner_southwest", 2, -1);
    }

    createDeepOceanCornerNorthEastSprites() {
        const coords = this.getCoords();

        coords[8].push(...this.col(88));
        coords[10].push(...this.col(128));
        coords[11].push(...this.col(61));
        coords[13].push(...this.col(36, 57, 98));
        coords[14].push(...this.col(40));
        coords[15].push(...this.col(75));
        coords[16].push(...this.col(48));
        coords[23].push(...this.col(48));
        coords[24].push(...this.col(26, 37, 52));

        this.createSprites(coords, "textures", "deep_ocean_corner_northeast", 2, -1);
    }

    createDeepOceanCornerNorthWestSprites() {
        const coords = this.getCoords();

        coords[8].push(...this.col(84, 123));
        coords[9].push(...this.col(120));
        coords[10].push(...this.col(135));
        coords[11].push(...this.col(59));
        coords[13].push(...this.col(53, 94));
        coords[14].push(...this.col(39));
        coords[15].push(...this.col(74));
        coords[19].push(...this.col(126));
        coords[20].push(...this.col(122));
        coords[21].push(...this.col(121));
        coords[22].push(...this.col(118));
        coords[24].push(...this.col(36));

        this.createSprites(coords, "textures", "deep_ocean_corner_northwest", 2, -1);
    }

    createDeepOceanCornerSouthEastSprites() {
        const coords = this.getCoords();

        coords[0].push(...this.col(45, 72, 91));
        coords[1].push(...this.col(39, 89, 106));
        coords[2].push(...this.col(38));
        coords[3].push(...this.col(36));
        coords[4].push(...this.col(128));
        coords[9].push(...this.col(88));
        coords[12].push(...this.col(61));
        coords[14].push(...this.col(36, 57, 98));
        coords[15].push(...this.col(29));
        coords[16].push(...this.col(28, 75));
        coords[17].push(...this.col(26, 48));

        this.createSprites(coords, "textures", "deep_ocean_corner_southeast", 2, -1);
    }

    createDeepOceanCornerSouthWestSprites() {
        const coords = this.getCoords();

        coords[0].push(...this.col(67, 82));
        coords[1].push(...this.col(88, 102, 121));
        coords[2].push(...this.col(123));
        coords[4].push(...this.col(135));
        coords[9].push(...this.col(84));
        coords[12].push(...this.col(59, 120));
        coords[13].push(...this.col(126));
        coords[14].push(...this.col(53, 94));
        coords[16].push(...this.col(74));
        coords[18].push(...this.col(39));
        coords[19].push(...this.col(45));

        this.createSprites(coords, "textures", "deep_ocean_corner_southwest", 2, -1);
    }

    createDeepOceanEdgeEastSprites() {
        const coords = this.getCoords();

        coords[0].push(...this.col(106));
        coords[4].push(...this.col(35));
        coords[5].push(...this.col(35, 127));
        coords[6].push(...this.col(35, 127));
        coords[7].push(...this.col(35, 127));
        coords[8].push(...this.col(35, 127));
        coords[9].push(...this.col(35, 127));
        coords[10].push(...this.col(35));
        coords[11].push(...this.col(35));
        coords[12].push(...this.col(35));
        coords[15].push(...this.col(40));
        coords[18].push(...this.col(25, 47));
        coords[19].push(...this.col(25, 47));
        coords[20].push(...this.col(25, 47));
        coords[21].push(...this.col(25, 47));
        coords[22].push(...this.col(25, 47));
        coords[23].push(...this.col(25));

        this.createSprites(coords, "textures", "deep_ocean_edge_east", 2, -1);
    }

    createDeepOceanEdgeNorthSprites() {
        const coords = this.getCoords();

        coords[8].push(...this.col(85, 86, 87));
        coords[9].push(...this.col(121, 122));
        coords[11].push(...this.col(60, 129, 130, 131, 132, 133, 134));
        coords[13].push(...this.col(54, 55, 56, 95, 96, 97));
        coords[16].push(...this.col(41, 42, 43, 44, 45, 46, 47));
        coords[20].push(...this.col(123, 124, 125));
        coords[22].push(...this.col(119, 120));
        coords[24].push(...this.col(49, 50, 51));

        this.createSprites(coords, "textures", "deep_ocean_edge_north", 2, -1);
    }

    createDeepOceanEdgeSouthSprites() {
        const coords = this.getCoords();

        coords[0].push(...this.col(40, 41, 42, 43, 44, 68, 69, 70, 71, 83, 84, 85, 86, 87, 90));
        coords[1].push(...this.col(103, 104, 105, 122));
        coords[2].push(...this.col(37));
        coords[3].push(...this.col(129, 130, 131, 132, 133, 134));
        coords[9].push(...this.col(85, 86, 87));
        coords[12].push(...this.col(60, 121, 122, 123, 124, 125));
        coords[14].push(...this.col(30, 31, 32, 33, 34, 35, 54, 55, 56, 95, 96, 97));
        coords[16].push(...this.col(27));
        coords[18].push(...this.col(40, 41, 42, 43, 44));

        this.createSprites(coords, "textures", "deep_ocean_edge_south", 2, -1);
    }

    createDeepOceanEdgeWestSprites() {
        const coords = this.getCoords();

        coords[0].push(...this.col(102, 121));
        coords[3].push(...this.col(124));
        coords[4].push(...this.col(124));
        coords[5].push(...this.col(124, 136));
        coords[6].push(...this.col(124, 136));
        coords[7].push(...this.col(124, 136));
        coords[8].push(...this.col(136));
        coords[9].push(...this.col(136));
        coords[10].push(...this.col(120));
        coords[11].push(...this.col(120));
        coords[14].push(...this.col(127));
        coords[15].push(...this.col(39, 127));
        coords[16].push(...this.col(39, 127));
        coords[17].push(...this.col(39, 127));
        coords[18].push(...this.col(127));
        coords[20].push(...this.col(46));
        coords[21].push(...this.col(46));
        coords[22].push(...this.col(46));
        coords[23].push(...this.col(46, 118));
        coords[24].push(...this.col(46, 118));

        this.createSprites(coords, "textures", "deep_ocean_edge_west", 2, -1);
    }


    getCoords() {
        const coords = new Array(25);

        for (let i = 0; i < coords.length; i++) {
            coords[i] = [];
        }

        return coords;
    }

    stripe(initial, end) {
        let numbers = [];
        for (let i = initial; i <= end; i++) {
            numbers.push(i);
        }
        return numbers;
    }

    col(...cols) {
        return cols.map(y => y * 16);
    }


    createImages(coords, texture, frame) {
        coords.forEach((row, y) => {
            row.forEach(x => {
                this.add.image(x, Number(this.col(y)[0]), texture, frame)
            })
        })
    }

    createSprites(coords, texture, frame, frameRate, repeat) {
        let config = {
            key: `${frame}_f1`,
            frames: [
                {key: texture, frame: `${frame}_f1`},
                {key: texture, frame: `${frame}_f2`},
                {key: texture, frame: `${frame}_f3`},
                {key: texture, frame: `${frame}_f2`},
            ],
            frameRate: frameRate,
            repeat: repeat
        }

        this.anims.create(config);

        coords.forEach((row, y) => {
            row.forEach(x => {
                this.add.sprite(x, Number(this.col(y)[0]), texture, `${frame}_f1`).play(`${frame}_f1`);
            })
        })

    }

    createWalls() {
        this.walls = this.physics.add.staticGroup();
        this.beaches = this.physics.add.staticGroup();
        this.grass = this.physics.add.staticGroup();
        this.wallPositions = [];

        // //100% grass center
        //
        // for (let x = 0; x < MAX_X; x += 16) {
        //     for (let y = 0; y < MAX_Y; y += 16) {
        //         this.grass.create(x, y, "textures", "terrain_grass_center.png");
        //     }
        // }


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
        this.cameras.main.zoomTo(2,2000)
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
