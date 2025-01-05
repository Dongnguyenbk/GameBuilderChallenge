import { Scene } from "phaser";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath("assets");

        this.load.image("logo", "logo.png");
        this.load.image("bg-main", "bg-main.png");
        this.load.image("bg-game", "bg-game.jpg");
        this.load.image("obj-plant1", "obj-plant1.png");
        this.load.image("obj-plant2", "obj-plant2.png");
        this.load.image("obj-plant3", "obj-plant3.png");
        this.load.image("obj-plant4", "obj-plant4.png");
        this.load.image("obj-plant5", "obj-plant5.png");
        this.load.image("obj-spaceship", "obj-spaceship.png");
        this.load.image("obj-meteorite1", "obj-meteorite1.png");
        this.load.image("obj-meteorite2", "obj-meteorite2.png");
        this.load.image("obj-meteorite3", "obj-meteorite3.png");
        this.load.image("txt-gameover", "txt-gameover.png");
        this.load.image("txt-play", "txt-play.png");
        this.load.image("txt-back", "txt-back.png");
    }

    create() {
        this.scene.start("Preloader");
    }
}
