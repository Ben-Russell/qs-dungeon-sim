import { Container, Grid, makeStyles } from '@material-ui/core';
import React, { FC, useState, useEffect } from 'react';
import { InteractionRequiredAuthError, InteractionStatus } from "@azure/msal-browser";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import axios from 'axios';
import { loginRequest } from 'config/authConfig';
import { serverConfig } from 'config/serverConfig';
import { SignOutButton } from './components/SignOutButton';

import { Routes } from './Routes';
import { LoginView } from './views/LoginView/LoginView';
import { access } from 'fs';
//import { Header } from './components/layout/Header/Header';
//import { SideBar } from './components/layout/SideBar/SideBar';

const appLayoutStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },

    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    appBarSpacer: theme.mixins.toolbar,
}));

export const AppLayout: FC = () => {
    const classes = appLayoutStyles();

    const { instance, accounts, inProgress } = useMsal();
    const [accessToken, setAccessToken] = useState<string|null>(null);

    const [username, setUsername] = useState<string|null>(null);

    useEffect(() => {
        const request = {
            ...loginRequest,
            account: accounts[0]
        };

        if(!accessToken && inProgress === InteractionStatus.None) {
            // Silently acquires an access token which is then attached to a request for Microsoft Graph data
            instance.acquireTokenSilent(request).then((response) => {
                setAccessToken(response.accessToken);
            }).catch((e) => {
                if (e instanceof InteractionRequiredAuthError) {
                    instance.acquireTokenRedirect(request);
                }
                
            });
        }

        if(accessToken) {
            let account = accounts[0];
            
            if(account) {
                console.log(`accessToken: ${accessToken} \n`, `account:`, account);
                axios.defaults.withCredentials = true; 
                axios.post(serverConfig.baseUrl + `api/getplayer`, {}, {
                    headers: {
                      'Authorization': `Bearer ${accessToken}`,
                    },
                    withCredentials: false
                  })
                .then(function (response) {
                    console.log('getplayer response:', response);
                })
                .catch(function (error) {
                    console.log('error response:', error);
                });
            }
            
        }

        

        
    }, [instance, accounts, inProgress, accessToken]);


    return (
        <div className={classes.root}>
            <AuthenticatedTemplate>
                <a href="/">Home</a>
                <a href="/counter">Counter</a>
                {accessToken ? <p>token</p> : <p>no token</p>}
                <br />
                {username ? <p>Hello {{ username }}</p>: <p></p>}
                <SignOutButton />
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    <Container maxWidth="xl">
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8} lg={9}>
                                <Routes />
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <LoginView />
                <p>You are not signed in! Please sign in.</p>
                
            </UnauthenticatedTemplate>
            
        </div>
    );
};