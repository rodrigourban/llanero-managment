import React from "react";
import "./layout.scss";
import { Layout, Menu, Button } from "antd";
import {
  UserOutlined,
  UnorderedListOutlined,
  FormOutlined,
  CalendarOutlined,
  BarChartOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import logo from "../assets/llanerologo.svg";
import { NavLink } from "react-router-dom";
import Toolbar from "../components/Nav/Toolbar/Toolbar";
import SideDrawer from "../components/Nav/SideDrawer/Sidedrawer";
import * as apiActions from "../store/actions/api";
import * as authActions from "../store/actions/auth";
const { Header, Sider, Content } = Layout;

const CustomLayout = (props) => {
  const sideDrawer = useSelector((state) => state.api.sideDrawer);
  const pageHeader = useSelector((state) => state.api.title);
  const admin = useSelector((state) => state.auth.admin);
  const selectedTab = useSelector((state) => state.api.selectedTab);
  const dispatch = useDispatch();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Toolbar onToggle={() => dispatch(apiActions.toggleSideDrawer())} />
      <SideDrawer open={sideDrawer} />
      <Sider breakpoint="sm" theme="light" className="responsiveDrawer">
        <div>
          <img
            src={logo}
            alt="Llanero Logo"
            className="logo"
            style={{
              width: "50%",
              marginLeft: "25%",
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          />
        </div>
        {admin ? (
          <Menu mode="inline" defaultSelectedKeys={["1"]} theme="light">
            <Menu.Item
              key="1"
              onClick={() => dispatch(apiActions.resetOrderFilter())}
            >
              <NavLink to="/">
                <UnorderedListOutlined style={{ verticalAlign: "baseline" }} />
                <span>Inventario</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item
              key="2"
              onClick={() => dispatch(apiActions.resetOrderFilter())}
            >
              <NavLink to="/orders">
                <FormOutlined style={{ verticalAlign: "baseline" }} />
                <span>Pedidos</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item
              key="3"
              onClick={() => dispatch(apiActions.resetOrderFilter())}
            >
              <NavLink to="/history">
                <CalendarOutlined style={{ verticalAlign: "baseline" }} />
                <span>Historial</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item
              key="4"
              onClick={() => dispatch(apiActions.resetOrderFilter())}
            >
              <NavLink to="/analytics">
                <BarChartOutlined style={{ verticalAlign: "baseline" }} />
                <span>Estadisticas</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item
              key="5"
              onClick={() => dispatch(apiActions.resetOrderFilter())}
            >
              <NavLink to="/admin">
                <UsergroupAddOutlined style={{ verticalAlign: "baseline" }} />
                <span>Admin</span>
              </NavLink>
            </Menu.Item>
          </Menu>
        ) : (
          <Menu mode="inline" defaultSelectedKeys={["1"]} theme="light">
            <Menu.Item key="1">
              <NavLink to="/">
                <UnorderedListOutlined style={{ verticalAlign: "baseline" }} />
                <span>Inventario</span>
              </NavLink>{" "}
            </Menu.Item>{" "}
          </Menu>
        )}
      </Sider>
      <Layout>
        <Header
          style={{ background: "#fff", padding: 0 }}
          className="responsiveHeader"
        >
          <Button
            shape="round"
            style={{
              float: "right",
              marginTop: "16px",
              marginRight: "16px",
            }}
            icon={<UserOutlined style={{ verticalAlign: "baseline" }} />}
            onClick={() => dispatch(authActions.logout())}
          >
            Salir
          </Button>
          {pageHeader ? pageHeader : ""}
        </Header>
        <Content className="responsiveContent" style={{ padding: "24px" }}>
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
