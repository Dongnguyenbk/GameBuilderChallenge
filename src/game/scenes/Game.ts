import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    spaceship: Phaser.Physics.Arcade.Image;
    plants: Phaser.Physics.Arcade.Group;
    meteorites: Phaser.Physics.Arcade.Group;
    gameOverText: Phaser.GameObjects.Image;
    timelifeText: Phaser.GameObjects.Text;
    scoreText: Phaser.GameObjects.Text;
    backText: Phaser.GameObjects.Image;
    timelife: number;
    score: number;

    constructor() {
        super("Game");
    }

    init() {
        this.score = 0;
        this.timelife = 0;
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, "bg-game");

        // Create the spaceship
        this.spaceship = this.physics.add
            .image(400, 300, "obj-spaceship")
            .setScale(0.25)
            .setDirectControl()
            .setImmovable();
        this.input.on("pointermove", (pointer: any) => {
            this.spaceship.setPosition(pointer.worldX, pointer.worldY);
        });

        // Create some plants
        this.plants = this.physics.add.group();
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(5, this.scale.width - 5);
            const y = Phaser.Math.Between(-this.scale.height / 2, 0);
            const velocityY = Phaser.Math.Between(100, 200);
            const index = (i % 5) + 1;
            const plant = this.plants.create(x, y, "obj-plant" + index);
            plant.setScale(0.3);
            plant.setVelocity(0, velocityY);
        }
        this.physics.add.overlap(
            this.spaceship,
            this.plants,
            this.hitStar,
            undefined,
            this
        );

        // Create some meteorites
        this.meteorites = this.physics.add.group();
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(5, this.scale.width - 5);
            const y = Phaser.Math.Between(-this.scale.height / 2, 0);
            const velocityY = Phaser.Math.Between(100, 200);
            const index = (i % 3) + 1;
            const meteorite = this.meteorites.create(
                x,
                y,
                "obj-meteorite" + index
            );
            meteorite.setScale(0.3);
            meteorite.setVelocity(0, velocityY);
        }
        this.physics.add.collider(
            this.spaceship,
            this.meteorites,
            this.hitBomb,
            undefined,
            this
        );

        // Create the score text
        this.scoreText = this.add
            .text(100, 100, "Score: 0", {
                fontFamily: "Arial Black",
                fontSize: 24,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        // Create the timelife text
        this.timelifeText = this.add
            .text(100, 150, "Time life: 0", {
                fontFamily: "Arial Black",
                fontSize: 24,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        // Create the gameover text
        this.gameOverText = this.add
            .image(512, 300, "txt-gameover")
            .setDepth(100)
            .setVisible(false);

        // Create the back text
        this.backText = this.add
            .image(512, 460, "txt-back")
            .setDepth(100)
            .setVisible(false);
        this.backText.setInteractive();
        this.backText.on("pointerdown", this.changeScene, this);
        this.backText.on("pointerover", () => {
            this.backText.scale = 1.1;
        });
        this.backText.on("pointerout", () => {
            this.backText.scale = 1.0;
        });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("MainMenu");
    }

    update(_time: number, _delta: number): void {
        if (this.physics.world.isPaused) {
            return;
        }
        this.timelife += _delta;
        this.timelifeText.setText(
            "Time life: " + Math.floor(this.timelife / 1000)
        );
        this.plants.children.iterate((star: any) => {
            if (star.y > this.scale.height) {
                const x = Phaser.Math.Between(5, this.scale.width - 5);
                const y = Phaser.Math.Between(-this.scale.height / 2, 0);
                const velocityY = Phaser.Math.Between(100, 200);
                star.setPosition(x, y);
                star.setVelocity(0, velocityY);
            }
            return true;
        });

        this.meteorites.children.iterate((bomb: any) => {
            if (bomb.y > this.scale.height) {
                const x = Phaser.Math.Between(5, this.scale.width - 5);
                const y = Phaser.Math.Between(-this.scale.height / 2, 0);
                const velocityY = Phaser.Math.Between(100, 200);
                bomb.setPosition(x, y);
                bomb.setVelocity(0, velocityY);
            }
            return true;
        });
    }

    hitStar(_aircraft: any, star: any) {
        this.score += 10;
        this.scoreText.setText("Score: " + this.score);
        const x = Phaser.Math.Between(5, this.scale.width - 5);
        const y = Phaser.Math.Between(-this.scale.height / 2, 0);
        const velocityY = Phaser.Math.Between(100, 200);
        star.setPosition(x, y);
        star.setVelocity(0, velocityY);
    }

    hitBomb(_aircraft: any, _bomb: any) {
        this.physics.pause();
        this.input.off("pointermove");
        this.spaceship.setTint(0xFF9D23);
        this.gameOverText.setVisible(true);
        this.backText.setVisible(true);
    }
}
