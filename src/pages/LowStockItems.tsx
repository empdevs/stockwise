import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { priorityOptions, PriorityType } from "../Types";
import { ApiService } from "../services/api.service";
import { Uri } from "../Uri";

interface ILowStockPage {
}

interface ILowStockItem {
    id: string,
    name: string,
    itemCode: string,
    unitName: string,
    stock: number,
    minimumStock: number,
    priority: PriorityType,
    score: number
}
const LowStockItems: React.FunctionComponent<ILowStockPage> = (props: ILowStockPage) => {

    const apiService = new ApiService();

    const [dataList, setDataList] = useState<ILowStockItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Load low stock items from API on mount
    useEffect(() => {
        fetchLowStockItems();
    }, []);

    const fetchLowStockItems = async () => {
        setLoading(true);
        try {
            const { data } = await apiService.getItem<ILowStockItem[]>(Uri.GetLowStockItems);
            if (data) setDataList(data);
        } catch (err) {
            message.error("Failed to load low stock items");
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<ILowStockItem> = [
        {
            title: "Name", dataIndex: "name", key: "name"
        },
        {
            title: "Item Code", dataIndex: "itemCode", key: "itemCode"
        },
        {
            title: "Unit", dataIndex: "unitName", key: "unitName"
        },
        {
            title: "Stock", dataIndex: "stock", key: "stock"
        },
        {
            title: "Minimum Stock", dataIndex: "minimumStock", key: "minimumStock"
        },
        {
            title: "Priority",
            dataIndex: "priority",
            key: "priority",
            render: (_, record) => {
                const label = priorityOptions.find((item) => item.value === record.priority)?.label
                return label
            }
        },
        {
            title: "Score", dataIndex: "score", key: "score"
        },
    ];

    return (
        <div>

            <br />
            <div className="custom-table-container">
                <Table
                    columns={columns}
                    dataSource={dataList}
                    scroll={{ x: "max-content" }}
                    rowClassName={() => "custom-row"}
                    bordered={false}
                    pagination={false}
                    loading={loading}
                />
            </div>
        </div>
    )
}
export default LowStockItems;