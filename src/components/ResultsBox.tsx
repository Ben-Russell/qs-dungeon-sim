import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { actions as settingsactions } from "../store/settingsReducer";
import { storeType } from "../store/store";

interface IResultsBoxProps {}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: "relative",
        width: 800,
        backgroundColor: "#424242",
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: "30%",
        left: "40%",
        transform: "translate(-30%, -20%)",
        fontSize: "1.5em",
        color: "#fff",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    },
    modal: {
        overflow: "scroll"
    }
}));

const settingsSelector = ({ settings }: storeType) => settings;

export const ResultsBox = ({}: IResultsBoxProps) => {
    const classes = useStyles();
    const settings = useSelector(settingsSelector);
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(settingsactions.closeResultsModal());
    };

    return (
        <>
            <Modal
                className={classes.modal}
                open={settings.resultsModalIsOpen}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div className={classes.paper}>
                    <ul>
                        {settings.results.map((line: string) => {
                            return <li>{line}</li>;
                        })}
                    </ul>
                </div>
            </Modal>
        </>
    );
};
