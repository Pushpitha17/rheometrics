import { Space, Table, Tag } from "antd"
import type { TableProps } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { useStore } from "../../data/store"
import { useSelector, useDispatch } from "react-redux"
import { removeFile, selectFiles } from "../../data/fileSlice"

type DataType = {
  key: number
  fileName: string
  temp?: number | null
}

function UploadedTable() {
  const Files = useSelector(selectFiles)
  const dispatch = useDispatch()

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "",
      dataIndex: "key",
      key: "key",
      render: (text) => <a>{text}</a>
    },
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName"
    },
    {
      title: "Temprature",
      dataIndex: "temp",
      key: "temp",
      align: "center",
      render: (_, record) => (
        <Space
          size="middle"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {record.temp ? `${record.temp} °C` : "-"}
        </Space>
      )
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle" style={{ width: "80px" }}>
          <a>
            <DeleteOutlined
              style={{ color: "red" }}
              onClick={() => {
                dispatch(removeFile(record.key))
              }}
            />
          </a>
        </Space>
      )
    }
  ]
  // const dataArray : DataType[] = Files.map((file) => {
  //   delete file["data"]
  //   return file
  // })

  console.log("Upload", { Files })

  return <Table columns={columns} dataSource={Files} pagination={false} />
}

export default UploadedTable
