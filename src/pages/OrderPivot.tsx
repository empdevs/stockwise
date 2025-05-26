import React from "react";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import IncomingStock from "./IncomingStock";
import Cashier from "./Cashier";



interface IOrderPivot {
}

const OrderPivot: React.FunctionComponent<IOrderPivot> = (props: IOrderPivot) => {
    return (
        <div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Cashier" key="1">
                    <Cashier />
                </TabPane>
                <TabPane tab="Incoming Stock" key="2">
                    <IncomingStock />
                </TabPane>
            </Tabs>

        </div>
    )
}

export default OrderPivot;