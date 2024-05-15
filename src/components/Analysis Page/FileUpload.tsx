import { Card, Space } from "antd"
import { Col, Row } from "antd"
import { Input, Radio } from "antd"
import { Button, Checkbox, Form } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"
import { message, Upload } from "antd"
import { Divider, Typography } from "antd"
import UploadedTable from "./UploadedTable"
import { useEffect, useState } from "react"
import { open } from "@tauri-apps/api/dialog"
import { readTextFile } from "@tauri-apps/api/fs"
import { useStore } from "../../data/store"
// import { addFile, removeFile } from "../../data/fileSlice"
import { useDispatch, useSelector } from "react-redux"
import { addFile, selectFiles } from "../../data/fileSlice"

const { Title, Paragraph, Text, Link } = Typography

function FileUpload() {
  // const selectedType = useWatch()

  const dispatch = useDispatch()
  const files = useSelector(selectFiles)

  console.log("redux", files)

  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".csv",
    beforeUpload(file) {
      // Prevent upload
      return false
    }
  }

  const [temp, setTemp] = useState(undefined)

  const readFile = async () => {
    try {
      const selectedPath = await open({
        multiple: false,
        title: "Select a CSV file"
      })

      if (!selectedPath) return

      const fileName = (selectedPath as string).split("\\").pop()?.split(".")[0]
      const contents = await readTextFile(selectedPath as string)

      const parseData = contents
        .trim()
        .split("\n")
        .map((line) => line.split(",").map(parseFloat))

      const DataArray = parseData.filter((r) => {
        if (
          Array.isArray(r) &&
          r.length === 2 &&
          typeof r[0] === "number" &&
          typeof r[1] === "number"
        ) {
          return true
        }
      })

      console.log({
        fileName: fileName as string,
        temp: currentTempVal,
        data: DataArray
      })

      dispatch(
        addFile({
          fileName: fileName as string,
          temp: currentTempVal,
          data: DataArray
        })
      )
      form.resetFields(["temp"]) // reset the temp field after file upload
    } catch (error) {
      console.error(error)
    }
  }

  type FieldType = {
    temp?: string
    time: "Min" | "Sec" | undefined
  }

  const [form] = Form.useForm()

  const setTimeUnit = useStore((state) => state.setTime)
  const Files = useSelector(selectFiles)

  const currentTempVal = Form.useWatch("temp", form)
  const selectedTimeUnit = Form.useWatch("time", form)

  useEffect(() => {
    setTimeUnit(selectedTimeUnit)
  }, [selectedTimeUnit])

  return (
    <Card
      title="Upload Data Files"
      // extra={<a href="#">More</a>}
      bordered={true}
      style={{ width: "100%" }}
    >
      <Form form={form}>
        {/* <Row style={{ paddingBottom: "1rem" }}>
          <Text>Input a temprature and select the data file</Text>
        </Row> */}
        <Row>
          <Form.Item<FieldType>
            name="time"
            label={
              <label style={{ fontWeight: 600 }}>Time Measurement unit</label>
            }
            style={{ marginBottom: "1rem" }}
          >
            <Radio.Group>
              <Radio value={"Min"} style={{ paddingTop: "6px" }}>
                Minutes
              </Radio>
              <Radio value={"Sec"}>Seconds</Radio>
            </Radio.Group>
          </Form.Item>
        </Row>
        <Row style={{ maxWidth: "600px" }}>
          <Col span={12}>
            <Form.Item<FieldType>
              name="temp"
              label="Temp"
              style={{ marginBottom: "0" }}
              rules={[
                {
                  required: true,
                  message: "Please input a temprature to upload."
                }
              ]}
            >
              <Input
                addonAfter={"°C"}
                type="number"
                style={{ width: "120px" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* <Upload {...props}>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                disabled={!currentTempVal}
              >
                Select File
              </Button>
            </Upload> */}
            <Button
              type="primary"
              icon={<UploadOutlined />}
              disabled={!currentTempVal}
              onClick={readFile}
            >
              Select File
            </Button>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span={16}>
          <Title level={5}>Entered Data</Title>
          {Files.length ? (
            <UploadedTable />
          ) : (
            <Text type="secondary">No Data Files Selected</Text>
          )}
        </Col>
      </Row>
    </Card>
  )
}

export default FileUpload
