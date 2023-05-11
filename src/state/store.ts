import { configureStore } from '@reduxjs/toolkit'
import activeReducer from './activePairSlicer';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import activePairSlicer from './activePairSlicer';

const persistConfig = {
  key: 'root',
  storage,
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const persistedReducer = persistReducer(persistConfig, activePairSlicer);

const store = configureStore({
  reducer: persistedReducer
});

export default store;