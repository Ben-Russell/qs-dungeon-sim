import { Fightergear } from "../datamodels/fightergear";

const types = {
    update: "fightergears/UPDATE"
} as const;

const update = (payload: Fightergear) => ({
    type: types.update,
    payload
});

export type Actions = ReturnType<typeof update>;

export const actions = { update };

const initialState = {};

export default function reducer(state = initialState, action: Actions) {
    switch (action.type) {
        case types.update: {
            return {
                ...state,
                ...{ [action.payload.id]: action.payload }
            };
        }
        default: {
            return state;
        }
    }
}
