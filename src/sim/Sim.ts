import { Fighter } from "./Fighter";
import { Fighter as FighterData, FighterClasses } from "../datamodels/fighter";
import { Monster } from "./Monster";
import { config } from "./config";
import RNG from "./RNG";
import { Fightergear } from "../datamodels/fightergear";

export class Sim {
    private Fighters: Fighter[] = [];
    private Fightergears: Fightergear[] = [];
    private Monsters: Monster[] = [];

    private HitOrder: Fighter[] = [];
    private RoundCounts: number[] = [];

    private DungeonLevel: number;
    private SimType: "dungeon" | "cave";

    public Wins: number = 0;
    public Losses: number = 0;
    public SimCount: number = 0;
    public Winrate: number = 0;
    public Time: number = 0;

    constructor(
        fighterdata: FighterData[],
        fightergears,
        simType: "dungeon" | "cave",
        dungeonlevel: number
    ) {
        this.SimType = simType;
        this.Fightergears = fightergears;
        fighterdata.forEach((fdata: FighterData) => {
            let item = null;
            if (fdata.item_id !== null && typeof fdata.item_id !== "undefined") {
                item = this.Fightergears[fdata.item_id];
            }
            if (this.IsCave()) {
                fdata.type = FighterClasses.CaveFighter;
            }
            this.Fighters.push(new Fighter(fdata, item));
        });

        this.DungeonLevel = dungeonlevel;
        if (this.IsCave()) {
            this.DungeonLevel *= 100;
            this.DungeonLevel += 50;
        }
    }

    private Battle(): void {
        this.Round();
        let rcount = 1;
        let isbattleover = this.IsBattleOver();
        while (!isbattleover) {
            this.Round();
            rcount++;
            isbattleover = this.IsBattleOver();
            if (rcount >= 150) {
                isbattleover = true;
                this.Losses++;
            }
        }
        this.RoundCounts.push(rcount);
        // console.log(rcount);
    }

    private CountAlive(): number[] {
        let fcount = this.Fighters.filter((f: Fighter) => f.Health > 0).length;
        let mcount = this.Monsters.filter((m: Monster) => m.Health > 0).length;

        return [fcount, mcount];
    }

    private CreateMonsters(): void {
        let mcount = 1;
        if (this.DungeonLevel < 51) {
            mcount = 1;
        } else if (this.DungeonLevel < 101) {
            mcount = 2;
        } else if (this.DungeonLevel < 151) {
            mcount = 3;
        } else if (this.DungeonLevel < 201) {
            mcount = 4;
        } else if (this.DungeonLevel < 251) {
            mcount = 5;
        } else {
            mcount = 6;
        }

        for (let i = 0; i < mcount; i++) {
            let m = new Monster(this.DungeonLevel - i * 25);
            this.Monsters.push(m);
        }
    }

    private IsBattleOver(): boolean {
        let alive = this.CountAlive();
        // [fcount, mcount]
        //console.log(alive);
        if (alive[0] > 0) {
            if (alive[1] > 0) {
                return false;
            }
            this.Wins++;
        } else {
            this.Losses++;
        }

        return true;
    }

    private IsCave(): boolean {
        return this.SimType === "cave";
    }
    private IsDungeon(): boolean {
        return this.SimType === "dungeon";
    }

    public Ready(): void {
        const hitorder: Fighter[] = [];
        this.HitOrder = hitorder.concat(this.Fighters, this.Monsters);
        this.HitOrder.sort((a, b) => b.Hit - a.Hit);
    }

    public Reset(): void {
        this.HitOrder.forEach((f: Fighter) => {
            if (this.IsDungeon() || f.Type === FighterClasses.Monster) {
                f.Health = f.MHealth;
            }
            f.CritCount = 0;
        });
    }

    private Round(): void {
        this.HitOrder.forEach((f: Fighter) => {
            if (f.Health <= 0) {
                return;
            }

            if (f.Type === FighterClasses.Knight) {
                // Knights can't attack.
                return;
            }

            if (f.StunCount > 0) {
                f.StunCount--;
                return;
            }

            let targets: (Fighter | null)[]= f.SelectTargets(
                this.Fighters,
                this.Monsters
            );

            if (
                targets.length === 0 ||
                targets[0] === null ||
                typeof targets[0] === "undefined"
            ) {
                // Failed to find any valid targets
                return;
            }

            if (f.Type === FighterClasses.Healer) {
                targets.forEach((t) => {
                    if(t !== null) {
                        t.TakeHeal(f);
                    }
                });
            } else {
                targets.forEach((t) => {
                    if(t !== null) {
                        t.TakeAttack(f);
                    }
                });
            }

            if (f.Type === FighterClasses.Priest && RNG.RollChance(10)) {
                let dead = this.Fighters.filter((tf: Fighter) => {
                    if (tf.Health <= 0) {
                        return true;
                    }
                    return false;
                });
                if (dead.length > 0) {
                    let rez = dead[Math.floor(Math.random() * dead.length)];
                    rez.Health = rez.MHealth;
                    //  console.log('rezzed', rez, f);
                }
            }
        });
        // Round healing seems to be at the end
        this.Fighters.forEach(function (f: Fighter) {
            if (f.RoundHealing > 0 && f.Health > 0) {
                f.Health += f.RoundHealing;
                f.Health = Math.min(f.Health, f.MHealth);
            }
        });
        /*    console.log(
            JSON.parse(JSON.stringify(this.Fighters)),
            JSON.parse(JSON.stringify(this.Monsters))
        );
        */
    }

    public Sim(): void {
        let start = Date.now();
        while (this.SimCount < config.iterations) {
            this.Reset();
            this.Battle();
            this.SimCount++;
        }
        let end = Date.now();
        this.Time = end - start;
    }

    public Start(): void {
        this.CreateMonsters();
        this.Ready();
        this.Sim();
        this.Winrate =
            Math.round((this.Wins / this.SimCount) * 1000000) / 10000;
        console.log("Sim Ended: " + this.Time + " milliseconds", this);
    }
}
