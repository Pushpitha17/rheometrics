import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./ReduxStore"

type File = {
  fileName: string
  temp: number
  data: [number,number][]
}

type FileState = {
  files: (File & { key: string })[]
  time: "Min" | "Sec" | undefined
}

const initialState: FileState = {
  files: [],
  time: undefined
}

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    addFile: (state, action) => {
      state.files.push({ ...action.payload, key: (state.files.length + 1).toString() })
    },
    removeFile: (state, action) => {
      state.files = state.files.filter((file) => file.key !== action.payload)
    },
    setTime: (state, action) => {
      state.time = action.payload
    },
    reset: (state) => {
      state.files = []
      state.time = undefined
    }
  }
})

export const { addFile, removeFile, setTime, reset } = filesSlice.actions

export const selectFiles = (state: RootState) => state.files.files
export const selectTime = (state: RootState) => state.files.time

export default filesSlice.reducer
