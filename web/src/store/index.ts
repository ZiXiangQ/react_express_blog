/*
 * @Author: qiuzx
 * @Date: 2025-04-14 16:58:26
 * @LastEditors: qiuzx
 * @Description: description
 */
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import menuReducer from './slices/menuSlice';
import projectReducer from './slices/projectSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['projects'], // 只持久化 projects 状态
};

const rootReducer = combineReducers({
  menu: menuReducer,
  projects: projectReducer,
  // 其他 reducers...
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
