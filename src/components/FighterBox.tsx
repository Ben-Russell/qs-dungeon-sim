import React, { FC } from "react";
import { Card, CardContent, Select, MenuItem } from "@material-ui/core";
import { useDispatch } from "react-redux";

import { FighterUpgrade } from "./FighterUpgrade";

import { actions } from "../store/fightersReducer";

import { Fighter, FighterClasses } from "../datamodels/fighter";

interface IFightersBoxProps {
    fighter: Fighter;
}

export const FighterBox = ({ fighter }: IFightersBoxProps) => {
    const dispatch = useDispatch();

    const handleClassChange = (event: any) => {
        fighter.type = parseInt(event.target.value, 10);
        dispatch(actions.update(fighter));
    };

    return (
        <>
            <Card>
                <CardContent>
                    <Select value={fighter.type} onChange={handleClassChange}>
                        {Object.keys(FighterClasses)
                            .filter((v: any) => {
                                return !isNaN(v);
                            })
                            .filter(
                                (v) =>
                                    ![
                                        FighterClasses.Monster.toString(),
                                        FighterClasses.CaveFighter.toString()
                                    ].includes(v)
                            )
                            .map((v: any) => {
                                return (
                                    <MenuItem key={v} value={v}>
                                        {FighterClasses[v]}
                                    </MenuItem>
                                );
                            })}
                    </Select>

                    {[
                        "health",
                        "damage",
                        "defense",
                        "critdamage",
                        "hit",
                        "dodge"
                    ].map((name: string) => (
                        <div key={name}>
                            <FighterUpgrade fighter={fighter} name={name} />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </>
    );
};
