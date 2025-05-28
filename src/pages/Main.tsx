import React from "react";
import { Layout, Menu, Table, Tabs, Avatar, Button } from "antd";
import {
    DashboardOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from "@ant-design/icons";

import { Link, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import Dashboard from "./Dashboard";
import SupplierPivot from "./SupplierPivot";
import ItemPivot from "./ItemPivot";
import OrderPivot from "./OrderPivot";
import stockWise from "../../public/stockwise.webp"

const { Header, Sider, Content } = Layout;

const Main: React.FC = () => {

    const { url } = useRouteMatch();
    const location = useLocation();
    const pathname = location.pathname;
    const history = useHistory();

    const handleLogout = () => {
        localStorage.clear();
        history.push("/Login");
    };
    const onRouteClick = (url: string) => {
        history.push(url);
    }
    const routes: any = {
        "/Index/Dashboard": "1",
        "/Index/Items": "2",
        "/Index/Suppliers": "3",
        "/Index/Orders": "4",
    }
    const activeRoute = routes[pathname] ? [routes[pathname]] : ["1"];
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider theme="light">
                <div style={{ height: 64, textAlign: "center", marginBottom: 30 }}>
                    <img
                        src={stockWise}
                        alt="Stockwise Logo"
                        style={{ width: 120 }}
                    />
                </div>
                <Menu mode="inline" defaultSelectedKeys={activeRoute}>
                    <Menu.Item onClick={() => onRouteClick(`${url}/Dashboard`)} key="1" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
                    <Menu.Item onClick={() => onRouteClick(`${url}/Items`)} key="2" icon={<AppstoreOutlined />}>Items</Menu.Item>
                    <Menu.Item onClick={() => onRouteClick(`${url}/Suppliers`)} key="3" icon={<TeamOutlined />}>Suppliers</Menu.Item>
                    <Menu.Item onClick={() => onRouteClick(`${url}/Orders`)} key="4" icon={<ShoppingCartOutlined />}>Orders</Menu.Item>
                </Menu>
            </Sider>

            <Layout>
                <Header style={{ background: "#fff", padding: 0, display: "flex", justifyContent: "flex-end", alignItems: "center", paddingRight: 20 }}>
                    <Avatar icon={<UserOutlined />} style={{ marginRight: 0 }} />
                    <Button type="link" onClick={handleLogout}>
                        Logout
                    </Button>
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
