import React, { ReactElement, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Grid
} from "@material-ui/core";

import { ImportFighters } from "./components/ImportFighters";
import { FightersPanel } from "./components/FightersPanel";
import { Fighter, FighterClasses } from "./datamodels/fighter";

import { actions as settingsactions } from "./store/settingsReducer";

import { storeType } from "./store/store";

import { Sim } from "./sim/Sim";
import { ResultsBox } from "./components/ResultsBox";

const fightersSelector = ({ fighters }: storeType) => fighters;
const fightergearsSelector = ({ fightergears }: storeType) => fightergears;
const settingsSelector = ({ settings }: storeType) => settings;

const createSim = () => {
    const worker = new Worker("/worker.js");

    console.log("worker", worker);

    worker.onmessage = (e) => {
        console.log("outside worker onmsg");
        console.log(e.data); // "hiya!"
    };

    worker.postMessage({ type: "test", msg: "hello" });
};

createSim();

export const AppLayout: FC = () => {
    const fighters = useSelector(fightersSelector);
    const fightergears = useSelector(fightergearsSelector);
    const settings = useSelector(settingsSelector);
    const dispatch = useDispatch();

    // const [dlvl, setDlvl] = useState(1550);
    const [clvl, setClvl] = useState(12);
    const [simType, setSimType] = useState<"dungeon" | "cave">("dungeon");
    console.log(fighters);
    console.log(fightergears);
    console.log(settings);

    const updateDlvl = (lvl: number) => {
        dispatch(settingsactions.updateDungeonLevel(lvl));
    };

    const getSimLevel = (): number => {
        return simType === "dungeon" ? settings.dungeonLevel : clvl;
    };

    const sumfighter = (fighter: Fighter | undefined) => {
        if(typeof fighter === "undefined") {

            return 0;
        }
        let costtotal = [
            fighter.health,
            fighter.damage,
            fighter.defense,
            fighter.critdamage,
            fighter.hit,
            fighter.dodge
        ].reduce((sum, stat) => {
            let t = Math.max(0, stat);
            //  t *= 100;
            t = (t * (t + 1)) / 2;
            t *= 10000;
            return sum + t;
        }, 0);

        return costtotal;
    };

    const runsim = () => {
        let fs = Object.keys(fighters).map((key) => fighters[key]);
        let sim = new Sim(fs, fightergears, simType, getSimLevel());
        sim.Start();
        dispatch(
            settingsactions.updateResults([
                "Wins: " +
                    sim.Wins +
                    " Losses: " +
                    sim.Losses +
                    " (" +
                    sim.Winrate +
                    "%)"
            ])
        );
        dispatch(settingsactions.openResultsModal());
    };

    const runoptimize = () => {
        let fs = Object.keys(fighters).map((key) => fighters[key]);
        let knight = fs.find((f) => {
            return f.type === FighterClasses.Knight;
        }) ?? fighters[0];
        let kcost = sumfighter(knight);
        let healer = fs.find((f) => {
            return f.type === FighterClasses.Healer;
        }) ?? fighters[0];
        let hcost = sumfighter(healer);
        let cavalry = fs.find((f) => {
            return f.type === FighterClasses.Cavalry;
        })?? fighters[0];
        let ccost = sumfighter(cavalry);
        let warrior = fs.find((f) => {
            return f.type === FighterClasses.Warrior;
        })?? fighters[0];
        let wcost = sumfighter(warrior);

        let sim = new Sim(fs, fightergears, simType, getSimLevel());
        sim.Start();

        console.log("Baseline:", sim);

        var ksim1,k1cost,ksim2,k2cost,ksim3,k3cost;
        var csim1,c1cost,csim2,c2cost,csim3,c3cost;
        var hsim1,h1cost,hsim2,h2cost;
        var wsim1,w1cost,wsim2,w2cost,wsim3,w3cost;

        
            knight.health += 50;
            ksim1 = new Sim(fs, fightergears, simType, getSimLevel());
            ksim1.Start();
            k1cost = sumfighter(knight);

            knight.health -= 50;
            knight.defense += 50;
            ksim2 = new Sim(fs, fightergears, simType, getSimLevel());
            ksim2.Start();
            k2cost = sumfighter(knight);

            knight.defense -= 50;
            knight.dodge += 50;
            ksim3 = new Sim(
                fs,
                fightergears,
                simType,
                simType === "dungeon" ? settings.dungeonLevel : clvl
            );
            k3cost = sumfighter(knight);
            ksim3.Start();

            knight.dodge -= 50;
        

        
            healer.damage += 50;
            hsim1 = new Sim(fs, fightergears, simType, getSimLevel());
            hsim1.Start();
            h1cost = sumfighter(healer);
            healer.damage -= 50;
            healer.critdamage += 50;
            hsim2 = new Sim(fs, fightergears, simType, getSimLevel());
            hsim2.Start();
            h2cost = sumfighter(healer);
            healer.critdamage -= 50;
        

        
            cavalry.damage += 50;
            csim1 = new Sim(fs, fightergears, simType, getSimLevel());
            csim1.Start();
            c1cost = sumfighter(cavalry);
            cavalry.damage -= 50;
            cavalry.critdamage += 50;
            csim2 = new Sim(fs, fightergears, simType, getSimLevel());
            csim2.Start();
            c2cost = sumfighter(cavalry);
            cavalry.critdamage -= 50;
            cavalry.hit += 50;
            csim3 = new Sim(fs, fightergears, simType, getSimLevel());
            csim3.Start();
            c3cost = sumfighter(cavalry);
            cavalry.hit -= 50;
        

       
            warrior.damage += 50;
            wsim1 = new Sim(fs, fightergears, simType, getSimLevel());
            wsim1.Start();
            w1cost = sumfighter(warrior);
            warrior.damage -= 50;
            warrior.critdamage += 50;
            wsim2 = new Sim(fs, fightergears, simType, getSimLevel());
            wsim2.Start();
            w2cost = sumfighter(warrior);
            warrior.critdamage -= 50;
            warrior.hit += 50;
            wsim3 = new Sim(fs, fightergears, simType, getSimLevel());
            wsim3.Start();
            w3cost = sumfighter(warrior);
            warrior.hit -= 50;
        
        type efficiency = {text: string, eff: number};
        var effs: efficiency[] = [];
        let costtrim = 100000000000000;
        const calcEfficiency = (_sim: Sim | undefined, _cost1: number | undefined, _cost2: number | undefined) => {
            if(typeof _sim === "undefined" || typeof _cost1 === "undefined" || typeof _cost2 === "undefined") { return 0 };
            return Math.round(
                (_sim.Winrate - sim.Winrate) /
                    (_cost2 / costtrim - _cost1 / costtrim)
            );
        };

        if (knight) {
            let k1eff = calcEfficiency(ksim1, kcost, k1cost);
            effs.push({
                text: `Knight +50 Health Winrate: ${ksim1.Winrate}% | ${k1cost}g | (${k1eff})`,
                eff: k1eff
            });

            let k2eff = calcEfficiency(ksim2, kcost, k2cost);
            effs.push({
                text: `Knight +50 Defense Winrate: ${ksim2.Winrate}% | ${k2cost}g | (${k2eff})`,
                eff: k2eff
            });

            let k3eff = calcEfficiency(ksim3, kcost, k3cost);
            effs.push({
                text: `Knight +50 Dodge Winrate: ${ksim3.Winrate}% | ${k3cost}g | (${k3eff})`,
                eff: k3eff
            });
        }

        if (healer) {
            let h1eff = calcEfficiency(hsim1, hcost, h1cost);
            effs.push({
                text: `Healer +50 Damage Winrate: ${hsim1.Winrate}% | ${h1cost}g | (${h1eff})`,
                eff: h1eff
            });
            let h2eff = calcEfficiency(hsim2, hcost, h2cost);
            effs.push({
                text: `Healer +50 Crit Damage Winrate: ${hsim2.Winrate}% | ${h2cost}g | (${h2eff})`,
                eff: h2eff
            });
        }

        if (cavalry) {
            let c1eff = calcEfficiency(csim1, ccost, c1cost);
            effs.push({
                text: `Cavalry +50 Damage Winrate: ${csim1.Winrate}% | ${c1cost}g | (${c1eff})`,
                eff: c1eff
            });

            let c2eff = calcEfficiency(csim2, ccost, c2cost);
            effs.push({
                text: `Cavalry +50 Crit Damage Winrate: ${csim2.Winrate}% | ${c2cost}g | (${c2eff})`,
                eff: c2eff
            });

            let c3eff = calcEfficiency(csim3, ccost, c3cost);
            effs.push({
                text: `Cavalry +50 Hit Winrate: ${csim3.Winrate}% | ${c3cost}g | (${c3eff})`,
                eff: c3eff
            });
        }

        if (warrior) {
            let w1eff = calcEfficiency(wsim1, wcost, w1cost);
            effs.push({
                text: `Warrior +50 Damage Winrate: ${wsim1.Winrate}% | ${w1cost}g | (${w1eff})`,
                eff: w1eff
            });

            let w2eff = calcEfficiency(wsim2, wcost, w2cost);
            effs.push({
                text: `Warrior +50 Crit Damage Winrate: ${wsim2.Winrate}% | ${w2cost}g | (${w2eff})`,
                eff: w2eff
            });

            let w3eff = calcEfficiency(wsim3, wcost, w3cost);
            effs.push({
                text: `Warrior +50 Hit Winrate: ${wsim3.Winrate}% | ${w3cost}g | (${w3eff})`,
                eff: w3eff
            });
        }
        console.log(effs.slice(0));
        effs = effs.sort((a:efficiency, b:efficiency) => b.eff - a.eff);
        let results = [`Base Winrate: ${sim.Winrate}%`];
        results = results.concat(effs.map((e) => { return e.text; }));
        console.log(results, effs);

        dispatch(settingsactions.updateResults(results));
        dispatch(settingsactions.openResultsModal());
    };

    return (
        <div className="App">
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="type"
                            name="simType1"
                            value={simType}
                            onChange={(e) => {
                                if(e.target.value === "dungeon") {
                                    setSimType("dungeon");
                                }
                                if(e.target.value==="cave") {
                                    setSimType("cave");
                                }
                                
                            }}
                        >
                            <FormControlLabel
                                value="dungeon"
                                control={<Radio />}
                                label="Dungeon"
                            />
                            {/*
                            <FormControlLabel
                                value="cave"
                                control={<Radio />}
                                label="Cave"
                            />
                            */}
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    {simType === "dungeon" ? (
                        <TextField
                            label="Dungeon Level"
                            size="small"
                            type="number"
                            value={settings.dungeonLevel}
                            onChange={(e) => {
                                updateDlvl(parseInt(e.target.value, 10));
                            }}
                        />
                    ) : (
                        <TextField
                            label="Cave Level"
                            size="small"
                            type="number"
                            value={clvl}
                            onChange={(e) => {
                                setClvl(parseInt(e.target.value, 10));
                            }}
                        />
                    )}
                </Grid>
            </Grid>

            <br />
            <ImportFighters />
            <br />
            <FightersPanel />

            <Button
                variant="contained"
                color="primary"
                onClick={() => runsim()}
            >
                Run Sim
            </Button>

            <Button
                variant="contained"
                color="primary"
                onClick={() => runoptimize()}
            >
                Optimize
            </Button>

            <ResultsBox />
        </div>
    );
};