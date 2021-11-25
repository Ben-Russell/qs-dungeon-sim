import { Fighter as FighterData, FighterClasses } from "../datamodels/fighter";
import { Fightergear } from "../datamodels/fightergear";
import { config } from "./config";
import RNG from "./RNG";

export class Fighter {
    public Health: number = 200;
    public MHealth: number = 500;
    public Defense: number = 25;
    public Damage: number = 100;
    public CritDamage: number = 0;
    public Hit: number = 50;
    public Dodge: number = 50;

    public BlockRate: number = 0.4;
    public BlockChance: number = 0;
    public RoundHealing: number = 0;
    public AllAttributes: number = 0;

    public Lookup: number = 0;
    public Type: number = 0;

    private Data: FighterData;
    private Item: Fightergear | null = null;
    public CritCount: number = 0;
    public StunCount: number = 0;

    constructor(data: FighterData, item: Fightergear | null = null) {
        this.Data = data;
        this.Type = this.Data.type;
        if (item !== null) {
            this.Item = item;
        }
        if (this.Type !== FighterClasses.Monster) {
            this.LoadData();
        }
    }

    private LoadData(): void {
        Object.keys(this.Data).forEach((stat: string) => {
            let value = Math.max(0, this.Data[stat]);
            switch (stat) {
                case "health":
                    this.Health =
                        250 + config.uniqueMultiplier * (value * 100 + 400);
                    break;
                case "defense":
                    this.Defense =
                        20 + config.uniqueMultiplier * (value * 10 + 15);
                    break;
                case "damage":
                    this.Damage =
                        50 + config.uniqueMultiplier * (value * 25 + 75);
                    break;
                case "critdamage":
                    this.CritDamage = config.uniqueMultiplier * (value * 0.25);
                    break;
                case "hit":
                    this.Hit = 100 + config.uniqueMultiplier * (value * 50);
                    if (this.Type === FighterClasses.Cavalry) {
                        this.Hit *= 2;
                    }
                    break;
                case "dodge":
                    this.Dodge = 100 + config.uniqueMultiplier * (value * 50);
                    break;
            }
        });

        if (this.Type === FighterClasses.Knight) {
            this.BlockRate = 0.4;
        }

        if (this.Item !== null) {
            //   console.log(this.Item);
            this.Health += this.Item.health + this.Item.all_attributes;
            this.Defense += this.Item.defense + this.Item.all_attributes;
            this.Damage += this.Item.damage + this.Item.all_attributes;
            this.CritDamage += this.Item.crit_damage;
            this.Hit += this.Item.hit + this.Item.all_attributes;
            this.Dodge += this.Item.dodge + this.Item.all_attributes;

            this.BlockChance += this.Item.block;
            this.RoundHealing += this.Item.round_healing;
        }

        // Todo handle items

        this.MHealth = this.Health;
    }

    public SelectTargets(fighters: Fighter[], monsters: Fighter[]): (Fighter | null)[] {
        switch (this.Type) {
            case FighterClasses.Monster:
                return [
                    fighters.find((tf: Fighter) => {
                        if (tf.Health > 0) {
                            return true;
                        }
                        return false;
                    }) ?? null
                ];
                break;
            case FighterClasses.Healer:
                return [
                    fighters.reduce((lowest: Fighter | null, tf: Fighter) => {
                        if (tf.Health <= 0) {
                            return null;
                        }
                        if (lowest === null) {
                            return tf;
                        }
                        if (
                            lowest.MHealth / lowest.Health <
                            tf.MHealth / tf.Health
                        ) {
                            return tf;
                        }
                        return lowest;
                    }, null)
                ];
                break;
            case FighterClasses.Assassin:
                let reorder: any[] = [];
                if (monsters.length > 3) {
                    reorder.push(monsters.slice(3));
                }

                reorder.push(monsters.slice(0, 3));
                //console.log(reorder.flat());

                return [
                    reorder.flat().find((tf: Fighter) => {
                        if (tf.Health > 0) {
                            return true;
                        }
                        return false;
                    })
                ];
                break;

            default:
                return [
                    monsters.find((tf: Fighter) => {
                        if (tf.Health > 0) {
                            return true;
                        }
                        return false;
                    }) ?? null
                ];
                break;
        }
    }

    public TakeAttack(attacker: Fighter) {
        let hitChance = (100 * attacker.Hit) / (attacker.Hit + this.Dodge);

        /*
        console.log(
            "Attacker",
            attacker.Type,
            "Defender",
            this.Type,
            "HitChance",
            hitChance
        );
        */

        let isHit = RNG.RollChance(hitChance);
        let damage = attacker.Damage;

        if (isHit) {
            attacker.CritCount++;
            let isCrit = attacker.CritCount >= 10;

            if (isCrit) {
                attacker.CritCount = 0;
                damage *= 1 + attacker.CritDamage / 100;
            }
            damage = Math.max(0, damage - this.Defense);
            let blockrate = 0;
            if (this.Type === FighterClasses.Knight) {
                blockrate += this.BlockRate;
            }
            if (RNG.RollChance(this.BlockChance * 100)) {
                blockrate += this.BlockRate;
            }
            damage *= 1 - blockrate;

            if (attacker.Type === FighterClasses.Warrior) {
                // Special Warrior
                let stunHit = RNG.RollChance(10);
                if (stunHit) {
                    this.StunCount = 2;
                }
            }
            this.Health -= damage;
        }
    }

    public TakeHeal(healer: Fighter) {
        let healamount = healer.Damage * 0.75;

        healer.CritCount++;
        let isCrit = healer.CritCount >= 10;

        if (isCrit) {
            healer.CritCount = 0;
            healamount *= 1 + healer.CritDamage / 100;
        }

        this.Health += healamount;
        this.Health = Math.min(this.Health, this.MHealth);
    }
}
