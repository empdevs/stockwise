import React from "react";
import { Layout, Menu, Table, Tabs, Avatar, Button } from "antd";
import {
    DashboardOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from "@ant-design/icons";

import { Link, Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import Dashboard from "./Dashboard";
import Suppliers from "./SupplierPivot";
import SupplierPivot from "./SupplierPivot";
import ItemPivot from "./ItemPivot";
import OrderPivot from "./OrderPivot";

const { Header, Sider, Content } = Layout;

const Main: React.FC = () => {

    const { url, path } = useRouteMatch();
    const history = useHistory();

    const onRouteClick = (url: string) => {
        history.push(url);
    }

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider theme="light">
                <div style={{ height: 64, textAlign: "center", marginBottom: 30 }}>
                    <img
                        src="/images/stockwise.webp"
                        alt="Stockwise Logo"
                        style={{ width: 120 }}
                    />
                </div>
                <Menu mode="inline" defaultSelectedKeys={["1"]}>
                    <Menu.Item onClick={() => onRouteClick(`${url}/Dashboard`)} key="1" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
                    <Menu.Item onClick={() => onRouteClick(`${url}/Items`)} key="2" icon={<AppstoreOutlined />}>Items</Menu.Item>
                    <Menu.Item onClick={() => onRouteClick(`${url}/Suppliers`)} key="3" icon={<TeamOutlined />}>Suppliers</Menu.Item>
                    <Menu.Item onClick={() => onRouteClick(`${url}/Orders`)} key="4" icon={<ShoppingCartOutlined />}>Orders</Menu.Item>
                </Menu>
            </Sider>

            <Layout>
                <Header style={{ background: "#fff", padding: 0, display: "flex", justifyContent: "flex-end", alignItems: "center", paddingRight: 20 }}>
                    <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                    <Button type="link">Logout</Button>
                </Header>

                <Content style={{ margin: "24px 16px", padding: 24, background: "#fff", borderRadius: 8 }}>
                    <Switch>
                        <Route
                            path={`${url}/Dashboard`}
                            render={() => {
                                return (
                                    <Dashboard />
                                )
                            }}
                        />
                        <Route
                            path={`${url}/Items`}
                            render={() => {
                                return (
                                    <ItemPivot />
                                )
                            }}
                        />
                        <Route
                            path={`${url}/Suppliers`}
                            render={() => {
                                return (
                                    <SupplierPivot />
                                )
                            }}
                        />
                        <Route
                            path={`${url}/Orders`}
                            render={() => {
                                return (
                                    <OrderPivot />
                                )
                            }}
                        />
                    </Switch>

                </Content>
            </Layout>
        </Layout>
    );
};

export default Main;
