import FileUpload from "../components/Analysis Page/FileUpload"
import PreviewPlot from "../components/Analysis Page/PreviewPlot"
import { useStore } from "../data/store"
import { useRef, useEffect, useState } from "react"
import { getCurrent } from "@tauri-apps/api/window"
import { appWindow } from "@tauri-apps/api/window"

function AnalysisPage() {
  const TimeUnit = useStore((state) => state.time)
  const Files = useStore((state) => state.files)

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

  return (
    <div>
      <div style={{ padding: "2rem 0" }}>
        <FileUpload />
      </div>
      <div style={{ width: "100%" }} ref={ref}>
        <PreviewPlot containerWidth={containerWidth} />
      </div>
    </div>
  )
}

export default AnalysisPage
