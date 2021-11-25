const types = {
    updateDungeonLevel: "settings/UPDATEDUNGEONLEVEL",
    updateResults: "settings/UPDATERESULTS",
    openResultsModal: "settings/OPENRESULTSMODAL",
    closeResultsModal: "settings/CLOSERESULTSMODAL"
} as const;

const updateDungeonLevel = (payload: number) => ({
    type: types.updateDungeonLevel,
    payload
});

const updateResults = (payload: string[]) => ({
    type: types.updateResults,
    payload
});

const openResultsModal = () => ({
    type: types.openResultsModal
});

const closeResultsModal = () => ({
    type: types.closeResultsModal
});

export type Actions = ReturnType<
    | typeof updateDungeonLevel
    | typeof updateResults
    | typeof openResultsModal
    | typeof closeResultsModal
>;

export const actions = {
    updateDungeonLevel,
    updateResults,
    openResultsModal,
    closeResultsModal
};

const initialState = {
    dungeonLevel: 1550,
    resultsModalIsOpen: false,
    results: <string[]>[]
};

export default function reducer(state = initialState, action: Actions) {
    switch (action.type) {
        case types.updateDungeonLevel: {
            return {
                ...state,
                dungeonLevel: action.payload
            };
        }
        case types.openResultsModal: {
            return {
                ...state,
                resultsModalIsOpen: true
            };
        }
        case types.closeResultsModal: {
            return {
                ...state,
                resultsModalIsOpen: false
            };
        }
        case types.updateResults: {
            return {
                ...state,
                results: action.payload
            };
        }
        default: {
            return state;
        }
    }
}
