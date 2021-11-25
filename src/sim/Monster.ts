import { Fighter } from "./Fighter";
import { FighterClasses, createFighter } from "../datamodels/fighter";

export class Monster extends Fighter {
    public Level: number;

    constructor(level: number) {
        let data = createFighter(999);
        super({ ...data, type: FighterClasses.Monster });
        this.Level = level;

        this.Health = 100 + this.ScaleStat(400);
        this.Defense = 20 + this.ScaleStat(10);
        this.Damage = 60 + this.ScaleStat(40);
        this.CritDamage = 100;
        this.Hit = 50 + this.ScaleStat(30);
        this.Dodge = 50 + this.ScaleStat(30);
        this.MHealth = this.Health;
    }

    private ScaleStat(scale) {
        let cscale = scale;
        let total = Math.min(600, this.Level) * cscale;
        if (this.Level > 600) {
            let scalelvl = this.Level - 600;
            while (scalelvl > 0) {
                cscale += scale;
                let bracket = Math.min(200, scalelvl);
                total += bracket * cscale;
                scalelvl -= 200;
            }
        }
        return total;
    }
}
