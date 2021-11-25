import { Fighter, createFighter, FighterClasses } from "../datamodels/fighter";

const types = {
    update: "fighters/UPDATE",
    reset: "fighters/RESET"
} as const;

const update = (payload: Fighter) => ({
    type: types.update,
    payload
});
const reset = (payload: number) => ({ type: types.reset, payload });

export type Actions = ReturnType<typeof update | typeof reset>;

export const actions = { update, reset };

const initialState: { [key:string]: Fighter} = {
    "0": createFighter(0, { type: FighterClasses.Assassin }),
    "1": createFighter(1, {
        type: FighterClasses.Knight,
        health: 1755,
        defense: 1753,
        dodge: 1985
    }),
    "2": createFighter(2, { type: FighterClasses.Warrior }),
    "3": createFighter(3, {
        type: FighterClasses.Healer,
        damage: 1909,
        critdamage: 1185,
        hit: 1
    }),
    "4": createFighter(4, { type: FighterClasses.Priest }),
    "5": createFighter(5, {
        type: FighterClasses.Cavalry,
        damage: 1640,
        hit: 835,
        critdamage: 860
    })
};

export default function reducer(state = initialState, action: Actions) {
    switch (action.type) {
        case types.update: {
            return {
                ...state,
                ...{ [action.payload.id]: action.payload }
            };
        }
        case types.reset: {
            return {
                ...state,
                ...{ [action.payload]: createFighter(action.payload) }
            };
        }
        default: {
            return state;
        }
    }
}
