import {Scene, Game} from 'phaser';
import Chest from '@/phaser/classes/Chest';
import Player from '@/phaser/classes/Player';
import Link from "@/phaser/classes/Link";
import Image from "@/phaser/classes/Image.js";
import Sprite from "@/phaser/classes/Sprite";

export default class    MapScene extends Scene {
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

        function createCornersGrasses(scene) {
            const {grasses, maxPositionX, maxPositionY} = scene;

            grasses.addMultiple([
                grasses.create(32, 16, "textures", "terrain_grass_north_west.png"),
                grasses.create(maxPositionX - 32, 16, "textures", "terrain_grass_north_east.png"),
                grasses.create(32, maxPositionY - 32, "textures", "terrain_grass_south_west.png"),
                grasses.create(maxPositionX - 32, maxPositionY - 32, "textures", "terrain_grass_south_east.png")
            ]);
        }

    }

    createMap(){
        this.createDeepOceanTiles();
        this.createGrassTiles();
        this.createBeachTiles();
    }

    createDeepOceanTiles(){
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
    createGrassTiles(){
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
    createBeachTiles(){

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





    }

    createBeachCornerNorthEastEdgeNorthSprites(){
        const coords = this.getCoords();

        coords[0].push(...this.col(63,78,98,117));
        coords[2].push(...this.col(85));
        coords[3].push(...this.col(120));
        coords[5].push(...this.col(132));
        coords[7].push(...this.col(67));
        coords[11].push(...this.col(87));
        coords[13].push(...this.col(90));
        coords[14].push(...this.col(63,69,123));
        coords[16].push(...this.col(35,92));
        coords[17].push(...this.col(71));
        coords[20].push(...this.col(42));

        this.createSprites(coords, "textures", "beach_corner_northeast_edge_north", 2, -1, true);
    }
    createBeachCornerNorthEastCenterSprites(){
        const coords = this.getCoords();

        coords[0].push(...this.col(64,79,99,118));
        coords[2].push(...this.col(86));
        coords[3].push(...this.col(121));
        coords[5].push(...this.col(133));
        coords[7].push(...this.col(68));
        coords[11].push(...this.col(88));
        coords[13].push(...this.col(91));
        coords[14].push(...this.col(64,70,124));
        coords[16].push(...this.col(36,93));
        coords[17].push(...this.col(72));
        coords[20].push(...this.col(43));

        this.createSprites(coords, "textures", "beach_corner_northeast_center", 2, -1, true);
    }
    createBeachCornerNorthEastEdgeEastFirstSprites(){
        const coords = this.getCoords();

        coords[1].push(...this.col(64,79,99,118));
        coords[3].push(...this.col(86));
        coords[4].push(...this.col(121));
        coords[6].push(...this.col(133));
        coords[8].push(...this.col(68));
        coords[12].push(...this.col(88));
        coords[14].push(...this.col(91));
        coords[15].push(...this.col(64,70,124));
        coords[17].push(...this.col(36,93));
        coords[18].push(...this.col(72));
        coords[21].push(...this.col(43));

        this.createSprites(coords, "textures", "beach_corner_northeast_edge_east_first", 2, -1, true);
    }
    createBeachCornerNorthEastEdgeEastSecondSprites(){
        const coords = this.getCoords();

        coords[1].push(...this.col(65,80,100,119));
        coords[3].push(...this.col(87));
        coords[4].push(...this.col(122));
        coords[6].push(...this.col(134));
        coords[8].push(...this.col(69));
        coords[12].push(...this.col(89));
        coords[14].push(...this.col(92));
        coords[15].push(...this.col(65,71,125));
        coords[17].push(...this.col(37,94));
        coords[18].push(...this.col(73));
        coords[21].push(...this.col(44));

        this.createSprites(coords, "textures", "beach_corner_northeast_edge_east_second", 2, -1, true);
    }

    createBeachCornerNorthWestEdgeNorthSprites(){
        const coords = this.getCoords();

        coords[0].push(...this.col(49,76,95,110));
        coords[2].push(...this.col(42,92));
        coords[4].push(...this.col(39));
        coords[5].push(...this.col(131));
        coords[7].push(...this.col(65));
        coords[11].push(...this.col(85));
        coords[13].push(...this.col(82));
        coords[14].push(...this.col(61,68,102));
        coords[15].push(...this.col(79));
        coords[16].push(...this.col(32,56,98));
        coords[18].push(...this.col(29,51));
        coords[19].push(...this.col(76));
        coords[20].push(...this.col(41));

        this.createSprites(coords, "textures", "beach_corner_northwest_edge_north", 2, -1, true);
    }
    createBeachCornerNorthWestCenterSprites(){
        const coords = this.getCoords();

        coords[0].push(...this.col(48,75,94,109));
        coords[2].push(...this.col(41,91));
        coords[4].push(...this.col(38));
        coords[5].push(...this.col(130));
        coords[7].push(...this.col(64));
        coords[11].push(...this.col(84));
        coords[13].push(...this.col(81));
        coords[14].push(...this.col(60,67,101));
        coords[15].push(...this.col(78));
        coords[16].push(...this.col(31,55,97));
        coords[18].push(...this.col(28,50));
        coords[19].push(...this.col(75));
        coords[20].push(...this.col(40));

        this.createSprites(coords, "textures", "beach_corner_northwest_center", 2, -1, true);
    }
    createBeachCornerNorthWestEdgeWestFirstSprites(){
        const coords = this.getCoords();

        coords[1].push(...this.col(48,75,94,109));
        coords[3].push(...this.col(41,91));
        coords[5].push(...this.col(38));
        coords[6].push(...this.col(130));
        coords[8].push(...this.col(64));
        coords[12].push(...this.col(84));
        coords[14].push(...this.col(81));
        coords[15].push(...this.col(60,67,101));
        coords[16].push(...this.col(78));
        coords[17].push(...this.col(31,55,97));
        coords[19].push(...this.col(28,50));
        coords[20].push(...this.col(75));
        coords[21].push(...this.col(40));

        this.createSprites(coords, "textures", "beach_corner_northwest_edge_west_first", 2, -1, true);
    }
    createBeachCornerNorthWestEdgeWestSecondSprites(){
        const coords = this.getCoords();

        coords[1].push(...this.col(47,74,93,108));
        coords[3].push(...this.col(40,90));
        coords[5].push(...this.col(37));
        coords[6].push(...this.col(129));
        coords[8].push(...this.col(63));
        coords[12].push(...this.col(83));
        coords[14].push(...this.col(80));
        coords[15].push(...this.col(59,66,100));
        coords[16].push(...this.col(77));
        coords[17].push(...this.col(30,54,96));
        coords[19].push(...this.col(27,49));
        coords[20].push(...this.col(74));
        coords[21].push(...this.col(39));

        this.createSprites(coords, "textures", "beach_corner_northwest_edge_west_second", 2, -1, true);
    }

    createBeachCornerSouthEastEdgeEastFirstSprites(){
        const coords = this.getCoords();

        coords[4].push(...this.col(86));
        coords[5].push(...this.col(121));
        coords[7].push(...this.col(61,81,133));
        coords[9].push(...this.col(101,107,117));
        coords[10].push(...this.col(68,76));
        coords[12].push(...this.col(50));
        coords[16].push(...this.col(124));
        coords[18].push(...this.col(36));
        coords[21].push(...this.col(34));
        coords[22].push(...this.col(43,61,72,92,115));

        this.createSprites(coords, "textures", "beach_corner_southeast_edge_east_first", 2, -1, true);
    }
    createBeachCornerSouthEastEdgeEastSecondSprites(){
        const coords = this.getCoords();

        coords[4].push(...this.col(87));
        coords[5].push(...this.col(122));
        coords[7].push(...this.col(62,82,134));
        coords[9].push(...this.col(102,108,118));
        coords[10].push(...this.col(69,77));
        coords[12].push(...this.col(51));
        coords[16].push(...this.col(125));
        coords[18].push(...this.col(37));
        coords[21].push(...this.col(35));
        coords[22].push(...this.col(44,62,73,93,116));

        this.createSprites(coords, "textures", "beach_corner_southeast_edge_east_second", 2, -1, true);
    }
    createBeachCornerSouthEastEdgeSouthFirstSprites(){
        const coords = this.getCoords();

        coords[5].push(...this.col(85));
        coords[6].push(...this.col(120));
        coords[8].push(...this.col(60,80,132));
        coords[10].push(...this.col(55,100,106,116));
        coords[11].push(...this.col(67,75));
        coords[13].push(...this.col(49));
        coords[17].push(...this.col(123));
        coords[19].push(...this.col(35,118));
        coords[22].push(...this.col(33));
        coords[23].push(...this.col(42,60,71,91,114));

        this.createSprites(coords, "textures", "beach_corner_southeast_edge_south_first", 2, -1, true);
    }
    createBeachCornerSouthEastCenterSprites(){
        const coords = this.getCoords();

        coords[5].push(...this.col(86));
        coords[6].push(...this.col(121));
        coords[8].push(...this.col(61,81,133));
        coords[10].push(...this.col(56,101,107,117));
        coords[11].push(...this.col(68,76));
        coords[13].push(...this.col(50));
        coords[17].push(...this.col(124));
        coords[19].push(...this.col(36,119));
        coords[22].push(...this.col(34));
        coords[23].push(...this.col(43,61,72,92,115));

        this.createSprites(coords, "textures", "beach_corner_southeast_center", 2, -1, true);
    }
    createBeachCornerSouthEastEastSprites(){
        const coords = this.getCoords();

        coords[5].push(...this.col(87));
        coords[6].push(...this.col(122));
        coords[8].push(...this.col(62,82,134));
        coords[10].push(...this.col(57,102,108,118));
        coords[11].push(...this.col(69,77));
        coords[13].push(...this.col(51));
        coords[17].push(...this.col(125));
        coords[19].push(...this.col(37,120));
        coords[22].push(...this.col(35));
        coords[23].push(...this.col(44,62,73,93,116));

        this.createSprites(coords, "textures", "beach_corner_southeast_east", 2, -1, true);
    }
    createBeachCornerSouthEastEdgeSouthSecondSprites(){
        const coords = this.getCoords();

        coords[6].push(...this.col(85));
        coords[7].push(...this.col(120));
        coords[9].push(...this.col(60,80,132));
        coords[11].push(...this.col(55,100,106,116));
        coords[12].push(...this.col(67,75));
        coords[14].push(...this.col(49));
        coords[18].push(...this.col(123));
        coords[20].push(...this.col(35,118));
        coords[23].push(...this.col(33));
        coords[24].push(...this.col(42,60,71,91,114));

        this.createSprites(coords, "textures", "beach_corner_southeast_edge_south_second", 2, -1, true);
    }
    createBeachCornerSouthEastSouthSprites(){
        const coords = this.getCoords();

        coords[6].push(...this.col(86));
        coords[7].push(...this.col(121));
        coords[9].push(...this.col(61,81,133));
        coords[11].push(...this.col(56,101,107,117));
        coords[12].push(...this.col(68,76));
        coords[14].push(...this.col(50));
        coords[18].push(...this.col(124));
        coords[20].push(...this.col(36,119));
        coords[23].push(...this.col(34));
        coords[24].push(...this.col(43,61,72,92,115));

        this.createSprites(coords, "textures", "beach_corner_southeast_south", 2, -1, true);
    }

    createBeachCornerSouthWestEdgeWestFirstSprites(){
        const coords = this.getCoords();

        coords[6].push(...this.col(91));
        coords[7].push(...this.col(71,130));
        coords[9].push(...this.col(94,104,110));
        coords[10].push(...this.col(38,64,73));
        coords[20].push(...this.col(50));
        coords[21].push(...this.col(28));
        coords[22].push(...this.col(40,64,75,97));

        this.createSprites(coords, "textures", "beach_corner_southwest_edge_west_first", 2, -1, true);
    }
    createBeachCornerSouthWestEdgeWestSecondSprites(){
        const coords = this.getCoords();

        coords[6].push(...this.col(90));
        coords[7].push(...this.col(70,129));
        coords[9].push(...this.col(93,103,109));
        coords[10].push(...this.col(37,63,72));
        coords[20].push(...this.col(49));
        coords[21].push(...this.col(27));
        coords[22].push(...this.col(39,63,74,96));

        this.createSprites(coords, "textures", "beach_corner_southwest_edge_west_second", 2, -1, true);
    }
    createBeachCornerSouthWestEdgeSouthFirstSprites(){
        const coords = this.getCoords();

        coords[7].push(...this.col(92));
        coords[8].push(...this.col(72,131));
        coords[10].push(...this.col(95,105,111));
        coords[11].push(...this.col(39,65,74));
        coords[13].push(...this.col(44));
        coords[21].push(...this.col(51));
        coords[22].push(...this.col(29));
        coords[23].push(...this.col(41,56,65,76,98));

        this.createSprites(coords, "textures", "beach_corner_southwest_edge_south_first", 2, -1, true);
    }
    createBeachCornerSouthWestCenterSprites(){
        const coords = this.getCoords();

        coords[7].push(...this.col(91));
        coords[8].push(...this.col(71,130));
        coords[10].push(...this.col(94,104,110));
        coords[11].push(...this.col(38,64,73));
        coords[13].push(...this.col(43));
        coords[21].push(...this.col(50));
        coords[22].push(...this.col(28));
        coords[23].push(...this.col(40,55,64,75,97));

        this.createSprites(coords, "textures", "beach_corner_southwest_center", 2, -1, true);
    }
    createBeachCornerSouthWestWestSprites(){
        const coords = this.getCoords();

        coords[7].push(...this.col(90));
        coords[8].push(...this.col(70,129));
        coords[10].push(...this.col(93,103,109));
        coords[11].push(...this.col(37,63,72));
        coords[13].push(...this.col(42));
        coords[21].push(...this.col(49));
        coords[22].push(...this.col(27));
        coords[23].push(...this.col(39,54,63,74,96));

        this.createSprites(coords, "textures", "beach_corner_southwest_west", 2, -1, true);
    }
    createBeachCornerSouthWestEdgeSouthSecondSprites(){
        const coords = this.getCoords();

        coords[8].push(...this.col(92));
        coords[9].push(...this.col(131));
        coords[11].push(...this.col(95,105,111));
        coords[12].push(...this.col(39,65,74));
        coords[14].push(...this.col(44));
        coords[22].push(...this.col(51));
        coords[23].push(...this.col(29));
        coords[24].push(...this.col(41,56,65,76,98));

        this.createSprites(coords, "textures", "beach_corner_southwest_edge_south_second", 2, -1, true);
    }
    createBeachCornerSouthWestSouthSprites(){
        const coords = this.getCoords();

        coords[8].push(...this.col(91));
        coords[9].push(...this.col(130));
        coords[11].push(...this.col(94,104,110));
        coords[12].push(...this.col(38,64,73));
        coords[14].push(...this.col(43));
        coords[22].push(...this.col(50));
        coords[23].push(...this.col(28));
        coords[24].push(...this.col(40,55,64,75,97));

        this.createSprites(coords, "textures", "beach_corner_southwest_south", 2, -1, true);
    }





    createGrassCenterImages(){
        const coords = this.getCoords();

        coords[2].push(...this.col(...this.stripe(50,62),77,96,97,...this.stripe(111,116)));
        coords[3].push(...this.col(...this.stripe(49,63),...this.stripe(76,78),95,96,...this.stripe(111,116)));
        coords[4].push(...this.col(...this.stripe(43,60),...this.stripe(72,80),...this.stripe(93,95),...this.stripe(110,117)));
        coords[5].push(...this.col(...this.stripe(42,59),...this.stripe(73,79),...this.stripe(93,95),...this.stripe(100,116)));
        coords[6].push(...this.col(...this.stripe(40,59),...this.stripe(73,79),95,100,105,106,...this.stripe(111,115)));
        coords[7].push(...this.col(...this.stripe(40,55),74,75,96,...this.stripe(112,115)));
        coords[8].push(...this.col(...this.stripe(40,54),...this.stripe(96,99),...this.stripe(112,115)));
        coords[9].push(...this.col(...this.stripe(40,49),66));
        coords[10].push(...this.col(...this.stripe(44,48)));
        coords[11].push(...this.col(...this.stripe(45,48)));
        coords[13].push(...this.col(86));
        coords[14].push(...this.col(...this.stripe(85,87)));
        coords[15].push(...this.col(...this.stripe(83,89)));
        coords[16].push(...this.col(62,...this.stripe(82,89),...this.stripe(103,118)));
        coords[17].push(...this.col(61,62,80,...this.stripe(84,91),...this.stripe(102,117)));
        coords[18].push(...this.col(33,...this.stripe(57,63),68,69,...this.stripe(85,91),...this.stripe(99,114)));
        coords[19].push(...this.col(32,...this.stripe(56,60),...this.stripe(65,70),...this.stripe(85,91),...this.stripe(98,113)));
        coords[20].push(...this.col(...this.stripe(30,32),...this.stripe(56,59),...this.stripe(66,70),79,...this.stripe(85,90),...this.stripe(99,113)));
        coords[21].push(...this.col(...this.stripe(57,59),...this.stripe(66,70),...this.stripe(77,79),...this.stripe(85,90),...this.stripe(99,113)));

        this.createImages(coords,"textures", "grass_center");
    }
    createGrassCornerNorthEastImages(){
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

        this.createImages(coords,"textures", "grass_corner_northeast");
    }
    createGrassCornerNorthWestImages(){
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

        this.createImages(coords,"textures", "grass_corner_northwest");
    }
    createGrassCornerSouthEastImages(){
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

        this.createImages(coords,"textures", "grass_corner_southeast");
    }
    createGrassCornerSouthWestImages(){
        const coords = this.getCoords();

        coords[6].push(...this.col(92));
        coords[7].push(...this.col(72, 131));
        coords[9].push(...this.col(95, 105, 111));
        coords[10].push(...this.col(39, 65, 74));
        coords[12].push(...this.col(44));
        coords[20].push(...this.col(51));
        coords[21].push(...this.col(29));
        coords[22].push(...this.col(41, 56, 65, 76, 98));

        this.createImages(coords,"textures", "grass_corner_southwest");
    }

    createGrassEdgeEastAImages(){
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

        this.createImages(coords,"textures", "grass_edge_east_a");
    }
    createGrassEdgeEastBImages(){
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

        this.createImages(coords,"textures", "grass_edge_east_b");
    }
    createGrassEdgeNorthAImages(){
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

        this.createImages(coords,"textures", "grass_edge_north_a");
    }
    createGrassEdgeNorthBImages(){
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

        this.createImages(coords,"textures", "grass_edge_north_b");
    }
    createGrassEdgeSouthAImages(){
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

        this.createImages(coords,"textures", "grass_edge_south_a");
    }
    createGrassEdgeSouthBImages(){
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

        this.createImages(coords,"textures", "grass_edge_south_b");
    }
    createGrassEdgeWestAImages(){
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

        this.createImages(coords,"textures", "grass_edge_west_a");
    }
    createGrassEdgeWestBImages(){
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

        this.createImages(coords,"textures", "grass_edge_west_b");
    }



    createDeepOceanCenterImages() {
        const coords = this.getCoords();

        coords[0].push(...this.col(...this.stripe(0,38),...this.stripe(103,105),...this.stripe(122,159)));
        coords[1].push(...this.col(...this.stripe(0,37),...this.stripe(124,159)));
        coords[2].push(...this.col(...this.stripe(0,35),...this.stripe(125,159)));
        coords[3].push(...this.col(...this.stripe(0,34),...this.stripe(125,127),...this.stripe(136,159)));
        coords[4].push(...this.col(...this.stripe(0,34),125,126,...this.stripe(137,159)));
        coords[5].push(...this.col(...this.stripe(0,34),125,126,...this.stripe(137,159)));
        coords[6].push(...this.col(...this.stripe(0,34),125,126,...this.stripe(137,159)));
        coords[7].push(...this.col(...this.stripe(0,34),125,126,...this.stripe(137,159)));
        coords[8].push(...this.col(...this.stripe(0,34),125,126,...this.stripe(137,159)));
        coords[9].push(...this.col(...this.stripe(0,34),...this.stripe(124,127),...this.stripe(137,159)));
        coords[10].push(...this.col(...this.stripe(0,34),...this.stripe(121,127),...this.stripe(137,159)));
        coords[11].push(...this.col(...this.stripe(0,34),...this.stripe(121,127),...this.stripe(136,159)));
        coords[12].push(...this.col(...this.stripe(0,34),...this.stripe(127,159)));
        coords[13].push(...this.col(...this.stripe(0,34),...this.stripe(128,159)));
        coords[14].push(...this.col(...this.stripe(0,28),...this.stripe(128,159)));
        coords[15].push(...this.col(...this.stripe(0,27),...this.stripe(128,159)));
        coords[16].push(...this.col(...this.stripe(0,25),...this.stripe(128,159)));
        coords[17].push(...this.col(...this.stripe(0,24),...this.stripe(40,46),...this.stripe(128,159)));
        coords[18].push(...this.col(...this.stripe(0,24),46,...this.stripe(128,159)));
        coords[19].push(...this.col(...this.stripe(0,24),...this.stripe(128,159)));
        coords[20].push(...this.col(...this.stripe(0,24),...this.stripe(127,159)));
        coords[21].push(...this.col(...this.stripe(0,24),...this.stripe(123,159)));
        coords[22].push(...this.col(...this.stripe(0,24),...this.stripe(122,159)));
        coords[23].push(...this.col(...this.stripe(0,24),...this.stripe(119,159)));
        coords[24].push(...this.col(...this.stripe(0,24),47,...this.stripe(119,159)));

        this.createImages(coords,"textures", "deep_ocean_center");
    }

    createDeepOceanCornerInnerNorthEastSprites(){
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

        this.createSprites(coords, "textures", "deep_ocean_corner_inner_northeast", 2, -1, true);
    }
    createDeepOceanCornerInnerNorthWestSprites(){
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

        this.createSprites(coords, "textures", "deep_ocean_corner_inner_northwest", 2, -1, true);
    }
    createDeepOceanCornerInnerSouthEastSprites(){
        const coords = this.getCoords();

        coords[8].push(...this.col(124));
        coords[9].push(...this.col(123));
        coords[10].push(...this.col(136));
        coords[11].push(...this.col(135));
        coords[19].push(...this.col(127));
        coords[20].push(...this.col(126));
        coords[21].push(...this.col(122));
        coords[22].push(...this.col(121));

        this.createSprites(coords, "textures", "deep_ocean_corner_inner_southeast", 2, -1, true);
    }
    createDeepOceanCornerInnerSouthWestSprites(){
        const coords = this.getCoords();

        coords[11].push(...this.col(128));
        coords[13].push(...this.col(35));
        coords[16].push(...this.col(40));
        coords[23].push(...this.col(47));
        coords[24].push(...this.col(25, 48));

        this.createSprites(coords, "textures", "deep_ocean_corner_inner_southwest", 2, -1, true);
    }

    createDeepOceanCornerNorthEastSprites(){
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

        this.createSprites(coords, "textures", "deep_ocean_corner_northeast", 2, -1, true);
    }
    createDeepOceanCornerNorthWestSprites(){
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

        this.createSprites(coords, "textures", "deep_ocean_corner_northwest", 2, -1, true);
    }
    createDeepOceanCornerSouthEastSprites(){
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

        this.createSprites(coords, "textures", "deep_ocean_corner_southeast", 2, -1, true);
    }
    createDeepOceanCornerSouthWestSprites(){
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

        this.createSprites(coords, "textures", "deep_ocean_corner_southwest", 2, -1, true);
    }

    createDeepOceanEdgeEastSprites(){
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

        this.createSprites(coords, "textures", "deep_ocean_edge_east", 2, -1, true);
    }
    createDeepOceanEdgeNorthSprites(){
        const coords = this.getCoords();

        coords[8].push(...this.col(85, 86, 87));
        coords[9].push(...this.col(121, 122));
        coords[11].push(...this.col(60, 129, 130, 131, 132, 133, 134));
        coords[13].push(...this.col(54, 55, 56, 95, 96, 97));
        coords[16].push(...this.col(41, 42, 43, 44, 45, 46, 47));
        coords[20].push(...this.col(123, 124, 125));
        coords[22].push(...this.col(119, 120));
        coords[24].push(...this.col(49, 50, 51));

        this.createSprites(coords, "textures", "deep_ocean_edge_north", 2, -1, true);
    }
    createDeepOceanEdgeSouthSprites(){
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

        this.createSprites(coords, "textures", "deep_ocean_edge_south", 2, -1, true);
    }
    createDeepOceanEdgeWestSprites(){
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

        this.createSprites(coords, "textures", "deep_ocean_edge_west", 2, -1, true);
    }


    getCoords(){
        const coords = new Array(25);

        for(let i = 0; i < coords.length; i++){
            coords[i] = new Array();
        }

        return coords;
    }

    stripe(initial, end){
        let numbers = new Array();
        for(let i = initial; i <= end; i++){
            numbers.push(i);
        }
        return numbers;
    }

    col(...cols){
        return cols.map(y => y * 16);
    }


    createImages(coords,texture, frame){
        coords.forEach((row, y) => {
            row.forEach(x => {
                this.add.image(x, this.col(y)[0], texture, frame)
            })
        })
    }

    createSprites(coords, texture, frame, frameRate, repeat, playAnimation) {
        coords.forEach((row, y) => {
            row.forEach(x => {
                new Sprite(this, x, this.col(y)[0], texture, frame, frameRate, repeat, playAnimation);
            })
        })
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
