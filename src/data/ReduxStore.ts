import { configureStore } from "@reduxjs/toolkit"
import fileReducer from "./fileSlice"
import AnalysisSlice from "./AnalysisSlice"

export const store = configureStore({
  reducer: {
    files: fileReducer,
    analysis: AnalysisSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat()
})

// Infer the type of makeStore
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
