import React, { useState } from "react";
import { Tabs } from "antd";
import SmartSourcing from "./SmartSourcing";
import LowStockItems from "./LowStockItems";


const { TabPane } = Tabs;
interface IDashboard {
}
const Dashboard: React.FunctionComponent<IDashboard> = (props: IDashboard) => {
    return (
        <Tabs defaultActiveKey="1">
            <TabPane tab="Low Stock Alert" key="1">
                <LowStockItems />
            </TabPane>
            <TabPane tab="Smart Sourcing" key="2">
                <SmartSourcing />
            </TabPane>
        </Tabs>
    )
}

export default Dashboard;