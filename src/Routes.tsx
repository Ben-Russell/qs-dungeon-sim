import { Router } from '@reach/router';
import React, { FC } from 'react';

import { CounterView } from './views/CounterView/CounterView';
import { LoginView } from './views/LoginView/LoginView';


export const RouteData = {
    login: '/login',
    counter: '/counter',
};

export const Routes: FC = () => {
    return (
        <Router>
            <LoginView path={RouteData.login} />
            <CounterView path={RouteData.counter} />
        </Router>
    );
};