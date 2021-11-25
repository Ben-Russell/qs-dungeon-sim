import { createStore, combineReducers } from "redux";

import fighters from "./fightersReducer";
import fightergears from "./fightergearsReducer";
import settings from "./settingsReducer";

export const rootReducer = combineReducers({
    fighters,
    fightergears,
    settings
});
export type storeType = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export { store };
