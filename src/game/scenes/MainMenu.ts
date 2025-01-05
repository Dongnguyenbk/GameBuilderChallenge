import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    logo: GameObjects.Image;
    background: GameObjects.Image;
    playText: GameObjects.Image;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.background = this.add.image(512, 384, "bg-main");

        this.logo = this.add.image(512, 300, "logo").setDepth(100);
        this.playText = this.add
            .image(512, 460, "txt-play")
            .setDepth(100)
            .setInteractive();
        this.playText.on("pointerdown", this.changeScene, this);
        this.playText.on("pointerover", () => {
            this.playText.scale = 1.1;
        });
        this.playText.on("pointerout", () => {
            this.playText.scale = 1.0;
        });
        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("Game");
    }
}
