import React, { useState } from "react";
import {
    FormControl,
    InputLabel,
    FilledInput,
    InputAdornment,
    IconButton
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

import { useDispatch } from "react-redux";
import { actions } from "../store/fightersReducer";

import { Fighter } from "../datamodels/fighter";

interface IFighterUpgradeProps {
    fighter: Fighter;
    name: string;
}

export const FighterUpgrade = ({ fighter, name }: IFighterUpgradeProps) => {
    const dispatch = useDispatch();

    const handleChange = (event: any) => {
        fighter[name] = event.target.value;
        dispatch(actions.update(fighter));
    };
    const increment = () => {
        fighter[name] = fighter[name] + 1;
        dispatch(actions.update(fighter));
    };
    const decrement = () => {
        fighter[name] = Math.max(fighter[name] - 1, 0);
        dispatch(actions.update(fighter));
    };
    return (
        <>
            <FormControl variant="filled">
                <InputLabel htmlFor="filled-adornment-password">
                    {name}
                </InputLabel>
                <FilledInput
                    id="filled-adornment-password"
                    type="text"
                    value={fighter[name]}
                    onChange={(e) => {
                        handleChange(e);
                    }}
                    endAdornment={
                        <>
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => {
                                        increment();
                                    }}
                                    //  onMouseDown={}
                                    edge="end"
                                >
                                    <AddIcon />
                                </IconButton>
                            </InputAdornment>
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => {
                                        decrement();
                                    }}
                                    //  onMouseDown={}
                                    edge="end"
                                >
                                    <RemoveIcon />
                                </IconButton>
                            </InputAdornment>
                        </>
                    }
                />
            </FormControl>
        </>
    );
};
