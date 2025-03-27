import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import aiToolsSlice from './slices/ai';

import layout from './slices/layout';

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const rootPersistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['user', 'community', 'onBoarding', 'layout'],
};

const layoutPersistConfig = {
  key: 'layout',
  storage: storage,
};

const rootReducer = combineReducers({
  layout: persistReducer(layoutPersistConfig, layout),
  aiToolsSlice,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export default persistedReducer;
