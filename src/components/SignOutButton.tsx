import React from "react";
import { useMsal } from "@azure/msal-react";
import { Button } from "@material-ui/core";

function handleLogout(instance: any) {
    instance.logoutPopup().catch((e: Event) => {
        console.error(e);
    });
}

/**
 * Renders a button which, when selected, will open a popup for logout
 */
export const SignOutButton = () => {
    const { instance } = useMsal();

    return (
        <Button variant="contained" className="ml-auto" onClick={() => handleLogout(instance)}>Sign out using Popup</Button>
    );
}