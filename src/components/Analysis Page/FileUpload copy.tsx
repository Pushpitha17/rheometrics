import { Card, Space } from "antd"
import { Col, Row } from "antd"
import { Input, Radio } from "antd"
import { Button, Form } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"
import { Upload } from "antd"
import { Typography } from "antd"
import UploadedTable from "./UploadedTable"
import { FormItem } from "react-hook-form-antd"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm, FormProvider } from "react-hook-form"

const { Title, Text } = Typography

const schema = z.object({
  type: z.string().nonempty(),
  temp: z.number().positive()
})

function FileUpload() {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: "", temp: null }
  })

  const { control, handleSubmit } = methods

  // const selectedType = useWatch()
  // console.log(selectedType)

  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".csv",
    beforeUpload(file) {
      // const reader = new FileReader();

      // reader.onload = e => {
      //     console.log(e.target.result);
      // };
      // reader.readAsText(file);
      console.log(file)
      handleSubmit((data) => {
        console.log(data)
      })()
      // Prevent upload
      return false
    }
    // onChange(info) {
    //   const { status } = info.file

    //   if (info.file.status !== "uploading") {
    //     console.log(info.file, info.fileList)
    //   }
    //   if (info.file.status === "done") {
    //     message.success(`${info.file.name} file uploaded successfully`)
    //   } else if (info.file.status === "error") {
    //     message.error(`${info.file.name} file upload failed.`)
    //   }
    // }
  }

  return (
    <Card
      title="Upload Data Files"
      // extra={<a href="#">More</a>}
      bordered={true}
      style={{ width: "100%" }}
    >
      <Row>
        <Col span={8}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <FormProvider {...methods}>
              <Form
                style={{ width: "100%" }}
                onFinish={handleSubmit((data) => {
                  console.log(data)
                })}
              >
                <Row style={{ marginBottom: "1rem" }}>
                  <Col span={8}>
                    <FormItem control={control} name="type">
                      <Radio.Group>
                        <Radio
                          value={"Isothermal"}
                          style={{ marginBottom: "1.5rem", paddingTop: "6px" }}
                        >
                          IsoThermal
                        </Radio>
                        <Radio value={"Non-Isothermal"}>Non Isothermal</Radio>
                      </Radio.Group>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      control={control}
                      name="temp"
                      label="Temp"
                      style={{ marginBottom: "0" }}
                    >
                      <Input
                        addonAfter={"°C"}
                        type="number"
                        style={{ width: 100 }}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </FormProvider>
          </Space>
        </Col>
        <Col span={4}>
          <Upload {...props}>
            <Button type="primary" icon={<UploadOutlined />}>
              Select File
            </Button>
          </Upload>
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <Title level={5}>Uploaded Files</Title>
          <Text type="secondary">No Data</Text>
          <UploadedTable />
        </Col>
      </Row>
    </Card>
  )
}

export default FileUpload
