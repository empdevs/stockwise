import React from "react";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import SupplierData from "./SupplierData";
import SupplierAssessment from "./SupplierAssessment";



interface ISupplierPivot {
}

const SupplierPivot: React.FunctionComponent<ISupplierPivot> = (props: ISupplierPivot) => {
    return (
        <div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Supplier Data" key="1">
                    <SupplierData />
                </TabPane>
                <TabPane tab="Supplier Assessment" key="2">
                    <SupplierAssessment />
                </TabPane>
            </Tabs>

        </div>
    )
}

export default SupplierPivot;