import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/authConfig";
import { Button } from "@material-ui/core";

function handleLogin(instance: any) {
    instance.loginPopup(loginRequest).catch((e: Event) => {
        console.error(e);
    });
}

/**
 * Renders a button which, when selected, will open a popup for login
 */
export const SignInButton = () => {
    const { instance } = useMsal();

    return (
        <Button variant="contained" className="ml-auto" onClick={() => handleLogin(instance)}>Sign in using Popup</Button>
    );
}