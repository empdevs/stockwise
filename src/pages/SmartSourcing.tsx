import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ISupplier, ISupplierAssessment } from "../Types";
import { ApiService } from "../services/api.service";
import { Uri } from "../Uri";
import { sortItems } from "../helper/helper";

interface ISmartSourcingPage {
}

interface ISupplierData {
    supplierName: string,
    productQuality: number,
    onTimeDelivery: number,
    stockAvailability: number,
    completnessDocument: number,
    warranty: number,
    easeOrderingProcess: number,
    productPrice: number,
    shippingCost: number,
    finalScore: number
}
const SmartSourcing: React.FunctionComponent<ISmartSourcingPage> = (props: ISmartSourcingPage) => {

    const apiService = new ApiService();

    const [dataList, setDataList] = useState<ISupplierData[]>([]);
    const [loading, setLoading] = useState(false);

    // Load suppliers from API on mount
    useEffect(() => {
        fetchSupplierAssessments();
    }, []);

    //SUPPLIER DATA START PART
    const fetchSupplierAssessments = async () => {
        setLoading(true);
        try {
            const { data } = await apiService.getItem<ISupplierAssessment[]>(Uri.GetSupplierAssessments);
            if (data) {
                const dataList: ISupplierData[] = data.map((item) => {
                    return ({
                        supplierName: item.supplierName as string,
                        productQuality: item.initiationCriteria.productQuality as number,
                        onTimeDelivery: item.initiationCriteria.onTimeDelivery as number,
                        stockAvailability: item.initiationCriteria.stockAvailability as number,
                        completnessDocument: item.initiationCriteria.completnessDocument as number,
                        warranty: item.initiationCriteria.warranty as number,
                        easeOrderingProcess: item.initiationCriteria.easeOrderingProcess as number,
                        productPrice: item.initiationCriteria.productPrice as number,
                        shippingCost: item.initiationCriteria.shippingCost as number,
                        finalScore: item.finalScore as number
                    })
                });
                setDataList(sortItems(dataList, "finalScore", "desc"));
            }
        } catch (err) {
            message.error("Failed to load suppliers");
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<ISupplierData> = [
        {
            title: "Supplier Name", dataIndex: "supplierName", key: "supplierName"
        },
        {
            title: "Product Quality", dataIndex: "productQuality", key: "productQuality"
        },
        {
            title: "Delivery Timeliness", dataIndex: "onTimeDelivery", key: "onTimeDelivery"
        },
        {
            title: "Stock Availability", dataIndex: "stockAvailability", key: "stockAvailability"
        },
        {
            title: "Document Completeness", dataIndex: "completnessDocument", key: "completnessDocument"
        },
        {
            title: "Warranty", dataIndex: "warranty", key: "warranty"
        },
        {
            title: "Ease of Ordering Process", dataIndex: "easeOrderingProcess", key: "easeOrderingProcess"
        },
        {
            title: "Product Price", dataIndex: "productPrice", key: "productPrice"
        },
        {
            title: "Delivery Cost", dataIndex: "shippingCost", key: "shippingCost"
        },
        {
            title: "Final Score", dataIndex: "finalScore", key: "finalScore"
        },
    ];

    return (
        <div>

            <br />
            <div className="custom-table-container">
                <Table
                    columns={columns}
                    dataSource={dataList}
                    scroll={{ y: 300 }}
                    rowClassName={() => "custom-row"}
                    bordered={false}
                    pagination={false}
                    loading={loading}
                />
            </div>
        </div>
    )
}
export default SmartSourcing;