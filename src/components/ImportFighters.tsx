import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Button, TextField, IconButton } from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import appConfig from "../config";

import { actions as fightersactions } from "../store/fightersReducer";
import { actions as fightergearsactions } from "../store/fightergearsReducer";
import { actions as settingsactions } from "../store/settingsReducer";

import { createFighter, FighterClasses } from "../datamodels/fighter";
import { Fightergear, fightergearstats, createFightergear } from "../datamodels/fightergear";

export const ImportFighters: FC = () => {
    const [apiKey, setApiKey] = useState("");
    const dispatch = useDispatch();

    const tierBonus = (fighter: any, name:string) => {
        return appConfig.tierBonuses[fighter[`item_${name}_tier`]] + 1;
    };

    const importfighters = async (event: any) => {
        if (apiKey.trim() === "") {
            return;
        }
        axios
            .get(appConfig.apiUrlBase + apiKey)
            .then((response) => {
                dispatch(
                    settingsactions.updateDungeonLevel(
                        response.data["playerFighterData"].dungeon_level + 1
                    )
                );
                let fighters = response.data["fighters"];
                fighters.forEach((f: any) => {
                    let typename =
                        f.class.charAt(0).toUpperCase() + f.class.slice(1);
                    let order = f.column_placement === 1 ? 1 : 4;
                    order += f.row_placement - 1;
                    let fighter = createFighter(order, {
                        type: FighterClasses[typename],
                        health: f.health,
                        damage: f.damage,
                        defense: f.defense,
                        critdamage: f.crit_damage,
                        hit: f.hit,
                        dodge: f.dodge
                    });

                    if (f.item_id !== null) {
                        let item = createFightergear(f.item_id);
                        fightergearstats.forEach((statname) => {
                            let bonus =
                                f[`item_${statname}`] * tierBonus(f, statname);

                            item[statname] = bonus;
                        });
                        dispatch(fightergearsactions.update(item));
                        fighter.item_id = item.id.toString();
                    }

                    dispatch(fightersactions.update(fighter));
                });
                console.log(appConfig.apiUrlBase, apiKey, fighters, response);

                //   state.Fighters[0].Upgrades.Hit = 5;

                //   console.log(state.Fighters[0]);
            })
            .catch();
    };
    return (
        <>
            <TextField
                id="standard-basic"
                label="Import Using API Key"
                size="small"
                value={apiKey}
                onChange={(e) => {
                    setApiKey(e.target.value);
                }}
            />
            <Button
                variant="contained"
                color="default"
                startIcon={<CloudDownloadIcon />}
                onClick={importfighters}
            >
                Import
            </Button>
        </>
    );
};
