import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./ReduxStore"

type Record = {
  time_values: number[],
  tr_values: number[],
  temp: number,
  key: string,
}

const initialState: Record[] = []

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    addRecords: (state, action) => {
      state.push(action.payload)
    },
    removeRecord: (state, action) => {
      return state.filter((record, index) => index !== action.payload)
    },
    resetRecords: () => {
      return initialState
    }
  }
})


export const { addRecords, removeRecord, resetRecords } = analysisSlice.actions
export const selectRecords = (state: RootState) => state.analysis

export default analysisSlice.reducer