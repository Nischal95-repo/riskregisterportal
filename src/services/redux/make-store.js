import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import combineReducers from "./reducers/combineReducers";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const persistConfig = {
  key: "root",
  storage: storage,
  stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

const pReducer = persistReducer(persistConfig, combineReducers);

export const store = createStore(pReducer, composeWithDevTools());
export const persistor = persistStore(store);
