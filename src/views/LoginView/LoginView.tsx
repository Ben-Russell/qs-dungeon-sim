import React, { FC } from 'react';
import { RouteComponentProps } from '@reach/router';

import { SignInButton } from 'components/SignInButton';


export const LoginView: FC<RouteComponentProps> = () => {
    

    return (
        <>
            <SignInButton />
        </>
    );
};