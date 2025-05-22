import React, { useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { Table, Tabs } from "antd";
import SmartSourcing from "./SmartSourcing";


const { TabPane } = Tabs;

interface ItemData {
    key: string;
    itemName: string;
    quantity: string;
    stockLevel: string;
}

interface IDashboard {
}
const Dashboard: React.FunctionComponent<IDashboard> = (props: IDashboard) => {

    const columns: ColumnsType<ItemData> = [
        {
            title: "Item Name",
            dataIndex: "itemName",
            key: "itemName",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Stock Level",
            dataIndex: "stockLevel",
            key: "stockLevel",
        },
    ];

    const data: ItemData[] = [
        { key: "1", itemName: "Screwdrivers", quantity: "50 Pcs", stockLevel: "Low" },
        { key: "2", itemName: "Bolt", quantity: "100 Pcs", stockLevel: "Low" },
        { key: "3", itemName: "Electric Wire", quantity: "50 Meter", stockLevel: "Medium" },
        { key: "4", itemName: "Screwdrivers", quantity: "50 Pcs", stockLevel: "Low" },
        { key: "5", itemName: "Bolt", quantity: "100 Pcs", stockLevel: "Low" },
        { key: "6", itemName: "Electric Wire", quantity: "50 Meter", stockLevel: "High" },
        { key: "7", itemName: "Bolt", quantity: "100 Pcs", stockLevel: "Low" },
        { key: "8", itemName: "Electric Wire", quantity: "50 Meter", stockLevel: "Medium" },
    ];


    return (
        <Tabs defaultActiveKey="1">
            <TabPane tab="Low Stock Alert" key="1">
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{ pageSize: 5 }}
                />
            </TabPane>
            <TabPane tab="Smart Sourcing" key="2">
                <SmartSourcing />
            </TabPane>
        </Tabs>
    )
}

export default Dashboard;