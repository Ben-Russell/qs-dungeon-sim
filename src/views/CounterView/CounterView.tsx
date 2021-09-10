import React, { FC } from 'react';
import { Counter } from '../../features/counter/Counter';
import { RouteComponentProps } from '@reach/router';

export const CounterView: FC<RouteComponentProps> = () => {

    return (
        <Counter />
    );
};