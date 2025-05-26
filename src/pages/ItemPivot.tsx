import React from "react";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import ItemPage from "./ItemsPage";



interface IItemPivot {
}

const ItemPivot: React.FunctionComponent<IItemPivot> = (props: IItemPivot) => {
    return (
        <div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Items" key="1">
                    <ItemPage />
                </TabPane>
            </Tabs>

        </div>
    )
}

export default ItemPivot;