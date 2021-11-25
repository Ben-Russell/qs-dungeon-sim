import React, { FC } from "react";
import { Button, TextField, IconButton, Paper, Grid } from "@material-ui/core";
import { storeType } from "../store/store";
import { useSelector } from "react-redux";

import { FighterBox } from "./FighterBox";

const fightersSelector = ({ fighters }: storeType) => fighters;

export const FightersPanel: FC = () => {
    const fighters = useSelector(fightersSelector);
    return (
        <>
            <Paper elevation={1}>
                <Grid container spacing={3} direction="row-reverse">
                    <Grid item xs={6}>
                        <FighterBox fighter={fighters[0]} />
                        <FighterBox fighter={fighters[1]} />
                        <FighterBox fighter={fighters[2]} />
                    </Grid>
                    <Grid item xs={6}>
                        <FighterBox fighter={fighters[3]} />
                        <FighterBox fighter={fighters[4]} />
                        <FighterBox fighter={fighters[5]} />
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
};
