import { create } from "zustand"

type File = {
  fileName: string
  temp: number
  data: any
}

type state = {
  files: (File & { key: number })[]
  time: "Min" | "Sec" | undefined
}

type Action = {
  addFile: (neWFile: File) => void
  removeFile: (key: number) => void
  setTime: (time: state["time"]) => void
}

export const useStore = create<state & Action>((set) => ({
  files: [],
  time: undefined,
  addFile: (newFile) =>
    set((state) => ({
      files: [...state.files, { ...newFile, key: state.files.length + 1 }]
    })),
  removeFile: (key) =>
    set((state) => ({ files: state.files.filter((file) => file.key !== key) })),
  setTime: (time) => set(() => ({ time: time })),
  reset: () => set(() => ({ files: [], time: undefined }))
}))
