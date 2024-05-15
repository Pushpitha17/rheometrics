import * as d3 from "d3"
import { Card } from "antd"
import { useEffect, useRef, useState } from "react"
import { useStore } from "../../data/store"
import { useSelector } from "react-redux"
import { selectFiles } from "../../data/fileSlice"
import { Line } from "react-chartjs-2"
import {
  Chart,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
} from "chart.js"
import COLORS from "./colors"

function PreviewPlot({ containerWidth }: { containerWidth: number }) {
  Chart.register(LinearScale, LineElement, Title, Tooltip, Legend, PointElement)

  const [PlotData, setPlotData] = useState({
    datasets: []
  })

  // const [chartOptions, setChartOptions] = useState({})

  const margins = { y: 50, x: 50 }

  const width = containerWidth - margins.x * 2
  const height = 640 - margins.y * 2

  const x = d3.scaleTime().range([0, width])

  const y = d3.scaleLinear().range([height, 0])
  const svgRef = useRef<SVGSVGElement>(null)

  const Files = useSelector(selectFiles)
  const TimeUnit = useStore((state) => state.time)

  console.log({ containerWidth })

  useEffect(() => {
    const svg = d3.select(svgRef.current)

    svg.selectAll("path").remove()

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("transform", `translate(${margins.x},${margins.y})`)

    if (Files.length) {
      const datasets = []

      for (const file of Files) {
        datasets.push({
          label: `${file.fileName} - ${file.temp}°C`,
          data: file.data.map((d) => ({
            y: d[1],
            x: TimeUnit == "Sec" ? d[0] / 60 : d[0]
          })),
          borderColor: COLORS[file.key], // Line color
          backgroundColor: COLORS[file.key], // No fill color
          borderWidth: 1,
          pointRadius: 0,
          pointHitRadius: 10 // Line width
        })
      }

      setPlotData({ datasets })

      const max_x = []
      const max_y = []

      for (const file of Files) {
        const data = file?.data

        max_x.push(d3.max(data, (d) => d[0]) as number)
        max_y.push(d3.max(data, (d) => d[1]) as number)
      }

      x.domain([0, Math.max(...max_x)])
      y.domain([0, Math.max(...max_y)])

      for (const file of Files) {
        const data = file?.data

        console.log("This runs")

        const line = d3
          .line()
          .x((d) => x(d[0]))
          .y((d) => y(d[1]))

        svg
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1)
          .attr("d", line)
      }
    }
  }, [Files, TimeUnit, containerWidth])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        type: "linear" as const,
        display: true,
        title: {
          display: true,
          text: "Time(min)"
        },
        beginAtzero: true
      },
      y: {
        title: {
          display: true,
          text: "Torque(dNm)",
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Entered Rheometer Data',
      },
      legend: {
        position: "right" as const,
        align: "center" as const, 
      },
    },
  }

  return (
    <Card>
      {/* <svg ref={svgRef}></svg> */}
      <div style={{ width: "99%", aspectRatio: 2 }}>
        {Files.length ? (
          <Line options={chartOptions} data={PlotData}></Line>
        ) : null}
      </div>
    </Card>
  )
}

export default PreviewPlot
