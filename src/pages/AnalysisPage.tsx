import FileUpload from "../components/Analysis Page/FileUpload"
import PreviewPlot from "../components/Analysis Page/PreviewPlot"
import { useStore } from "../data/store"
import { useRef, useEffect, useState } from "react"
import { getCurrent } from "@tauri-apps/api/window"
import { appWindow } from "@tauri-apps/api/window"
import { invoke } from "@tauri-apps/api/tauri"
import { useDispatch, useSelector } from "react-redux"
import { selectFiles } from "../data/fileSlice"
import { useMutation } from "@tanstack/react-query"
import { selectRecords, addRecords } from "../data/AnalysisSlice"
import { Body, fetch, ResponseType } from "@tauri-apps/api/http"

function AnalysisPage() {
  const TimeUnit = useStore((state) => state.time)
  const Files = useSelector(selectFiles)

  const unlisten = appWindow.onResized(({ payload: size }) => {
    console.log("Window resized", size)
    ref.current ? setContainerWidth(ref.current.offsetWidth) : 0
  })

  const ref = useRef<HTMLHeadingElement>(null)

  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    ;(async function windowSize() {
      console.log(await getCurrent().innerSize())
    })()

    ref.current ? setContainerWidth(ref.current.offsetWidth) : 0
    console.log({ containerWidth })
  }, [])

  const dispatch = useDispatch()

  const invokePython = async () => {
    const data = Files.map((file) => {
      return {
        fileName: file.fileName,
        temp: file.temp,
        time_values: file.data.map((d) => d[0]),
        tr_values: file.data.map((d) => d[1]),
        Key: file.key
      }
    })
    dispatch(addRecords(data))
    sendRequst(data[0])
  }

  const records = useSelector(selectRecords)
  const sendRequst = async (record: any) => {
    console.log("Send request")
    const requestData = {
      time_values: record.time_values,
      tr_values: record.tr_values
    }
    mutation.mutate(requestData)
  }

  type analyseInput = {
    time_values: number[]
    tr_values: number[]
  }

  const analyseData = async (data: analyseInput) => {
    let body = Body.json(data)
    console.log(body)
    const res = await fetch("http://127.0.0.1:5000/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: body,
      responseType: ResponseType.JSON
    })
    console.log(res)
    return await res.data
  }

  const mutation = useMutation({
    mutationFn: analyseData
  })

  return (
    <div>
      <div style={{ padding: "2rem 0" }}>
        <button onClick={invokePython}>PYTHON</button>
        <FileUpload />
      </div>
      <div style={{ width: "100%" }} ref={ref}>
        <PreviewPlot containerWidth={containerWidth} />
      </div>
    </div>
  )
}

export default AnalysisPage
