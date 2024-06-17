import { useState } from "react"
import type { MenuProps } from "antd"
import {  Layout, Menu } from "antd"
import { FileLineChart } from "lucide-react"
import { Link, Outlet } from "react-router-dom"

const { Content, Sider } = Layout

type MenuItem = Required<MenuProps>["items"][number]

const menuItems: MenuItem[] = [
  {
    key: "1",
    label: <Link to="/">Kinetic Analysis</Link>,
    icon: <FileLineChart style={{ height: "100%" }} />
  },
  {
    key: "2",
    label: <Link to="/prediction">Kinetic Predictions</Link>,
    icon: (
      <img
        src="public/predict-icon.png"
        alt=""
        style={{ width: "24px", height: "24px" }}
      />
    )
  }
]

function AppLayout() {
  const [collapsed, setCollapsed] = useState(true)
  // const {
  //   token: { colorBgContainer, borderRadiusLG }
  // } = theme.useToken()


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem"
          }}
        >
          <img src="./icon.png" alt="" style={{ width: "80px" }} />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={menuItems}
        ></Menu>
      </Sider>
      <Layout style={{ marginBottom : '4rem'}}>
        <Content style={{ backgroundColor: "rgb(240, 242, 245)" }}>
          <div style={{ margin: "0 32px" }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
