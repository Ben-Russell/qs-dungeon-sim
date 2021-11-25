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
import { Fighter, FighterClasses, fighterstats } from "./datamodels/fighter";

import { actions as settingsactions } from "./store/settingsReducer";

import { storeType } from "./store/store";

import { Sim } from "./sim/Sim";
import { SimWorker, SimResult } from "./sim/SimWorker";
import { ResultsBox } from "./components/ResultsBox";

import { config, config as simConfig } from "./sim/config";

type efficiency = {text: string, value: number};
interface OptimizeResult {
    fighter: Fighter;
    cost: number;
    stat: string;
    results: SimResult;
    
}

const fightersSelector = ({ fighters }: storeType) => fighters;
const fightergearsSelector = ({ fightergears }: storeType) => fightergears;
const settingsSelector = ({ settings }: storeType) => settings;

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
        let simworker = new SimWorker(fs, fightergears, simType, getSimLevel());
        simworker.attachResultHandler("simResults", (e: MessageEvent) => {
            let results: SimResult = e.data.results;
                dispatch(
                    settingsactions.updateResults([
                        "Wins: " +
                            results.wins +
                            " Losses: " +
                            results.losses +
                            " (" +
                            results.winrate +
                            "%)"
                    ])
                );

                dispatch(settingsactions.openResultsModal());
        });
        simworker.start();
        
    };

    let optimizeLeft = 0;
    let optimizeResults: OptimizeResult[] = [];
    let optimizeBase: SimResult;
    const catchOptimizeResult = (f?: Fighter, stat?: string) => {
        if(typeof f === "undefined" || typeof stat === "undefined") {
            return (e: MessageEvent) => {
                optimizeBase = e.data.results;
                console.log('Base Results', optimizeBase);
                optimizeBeat();
                
            };
        } else {
            let cost = sumfighter(f); // Need to sum before handler
            return (e: MessageEvent) => { 
                let r:SimResult = e.data.results;
                let result: OptimizeResult = {
                    fighter: f,
                    cost: cost,
                    stat: stat,
                    results: r
                };
                optimizeResults.push(result);
                optimizeBeat();
            };
        }
        
    };

    const optimizeBeat = () => {
        optimizeLeft--;
        if(optimizeLeft <= 0) {
            optimizeEnd();
        }
    };

    const optimizeEnd = () => {
        
        let fs = Object.keys(fighters).map((key) => fighters[key]);
        let baseCosts: any = {};
        fs.map((f: Fighter) => {
            baseCosts[f.id] = sumfighter(f);
        });

        console.log('baseCosts', baseCosts);

        let resultSet:efficiency[] = optimizeResults.map((result: OptimizeResult) => {
            let bCost = Math.max(baseCosts[result.fighter.id], 1);
            let efficiency = calcEfficiency(result, result.fighter, bCost);
            let type = FighterClasses[result.fighter.type];
            let costtrims = 1000000;
            let costm = Math.round((result.cost-bCost)/costtrims * 100) / 100;
            return {
                text: `${type} +${config.statIncrement} ${result.stat} Winrate: ${result.results.winrate}% | ${costm}m | (${efficiency})`,
                value: efficiency
            };
        });

        let ordered:efficiency[] = resultSet.sort((a:efficiency, b:efficiency) => b.value - a.value);

        let results = [`Base Winrate: ${optimizeBase.winrate}%`];
        results = results.concat(ordered.map((e) => { return e.text; }));
        console.log(results, ordered);

        dispatch(settingsactions.updateResults(results));
        dispatch(settingsactions.openResultsModal());

        
    }

    const calcEfficiency = (result: OptimizeResult, cleanfighter: Fighter, basecost: number) => {
        let costtrim = 100000000000000;
        
        let eff = Math.round(
            (result.results.winrate - optimizeBase.winrate) /
            (result.cost / costtrim - basecost / costtrim)
        );

        console.log('calcEff',eff, result.results.winrate, optimizeBase.winrate, result.cost, basecost);
        return eff;
    };

    const runoptimize = () => {
        let fs = Object.keys(fighters).map((key) => fighters[key]);
        let simSets = fs.map((f: Fighter) => {
            
            return fighterstats.map((stat:string) => {
                f[stat] += simConfig.statIncrement;
                let simworker = new SimWorker(fs, fightergears, simType, getSimLevel());
                simworker.attachResultHandler("simResults", catchOptimizeResult(f, stat));
                optimizeLeft++;
                simworker.start();
                f[stat] -= simConfig.statIncrement;
            });
        });


        let simworker = new SimWorker(fs, fightergears, simType, getSimLevel());
            simworker.attachResultHandler("simResults", catchOptimizeResult());
            optimizeLeft++;
            simworker.start();
        
        
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