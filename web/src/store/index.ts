import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './slices/menuSlice';

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    // 其他 reducers...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
