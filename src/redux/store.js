import {configureStore} from '@reduxjs/toolkit';
import commonSlice from './commonSlice';
export default configureStore({
  reducer: commonSlice,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authMiddleware)
});