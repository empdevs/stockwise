import React, { useEffect, useState } from "react";
import { Button, Dropdown, Input, Menu, message, Modal } from "antd";
import moment from "moment";
import { ActionMode, ISupplier, ISupplierAssessment } from "../Types";
import { EllipsisOutlined, CheckSquareOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import { Stack } from "@fluentui/react";
import { ApiService } from "../services/api.service";
import { Uri } from "../Uri";
import NewButton from "../components/NewButton";
import { applyTextPlaceholders } from "../helper/helper";

const { Search } = Input;

interface ISupplierAssessmentPage {
}

const SupplierAssessment: React.FunctionComponent<ISupplierAssessmentPage> = (props: ISupplierAssessmentPage) => {


    const apiService = new ApiService();

    const [initData, setInitData] = useState<ISupplier[]>([]);
    const [dataList, setDataList] = useState<ISupplier[]>([]);

    const [loading, setLoading] = useState(false);

    // Modal & Form states
    const [open, setOpen] = useState(false);

    const [activeSupplier, setActiveSupplier] = useState<ISupplier | null>(null);
    const [activeSupplierAssessment, setActiveSupplierAssessment] = useState<ISupplierAssessment>();
    const [productQuality, setProductQuality] = useState<number>(0);
    const [onTimeDelivery, setOnTimeDelivery] = useState<number>(0);
    const [stockAvailability, setStockAvailability] = useState<number>(0);
    const [completnessDocument, setCompletnessDocument] = useState<number>(0);
    const [warranty, setWarranty] = useState<number>(0);
    const [easyOrdering, setEasyOrdering] = useState<number>(0);
    const [productPrice, setProductPrice] = useState<number>(0);
    const [shippingCost, setShippingCost] = useState<number>(0);


    const [actionMode, setActionMode] = useState<ActionMode>();


    // Load suppliers from API on mount
    useEffect(() => {
        fetchSuppliers();
    }, []);

    //SUPPLIER DATA START PART
    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const { data } = await apiService.getItem<ISupplier[]>(Uri.GetSuppliers);
            setDataList(data);
            setInitData(data);
        } catch (err) {
            message.error("Failed to load suppliers");
        } finally {
            setLoading(false);
        }
    };

    const setSupplierAssessment = (supplierAssessment: ISupplierAssessment | undefined) => {
        setActiveSupplierAssessment(supplierAssessment);
        setProductQuality(supplierAssessment?.initiationCriteria?.productQuality as number);
        setOnTimeDelivery(supplierAssessment?.initiationCriteria?.onTimeDelivery as number);
        setStockAvailability(supplierAssessment?.initiationCriteria?.stockAvailability as number);
        setCompletnessDocument(supplierAssessment?.initiationCriteria?.completnessDocument as number);
        setWarranty(supplierAssessment?.initiationCriteria?.warranty as number);
        setEasyOrdering(supplierAssessment?.initiationCriteria?.easeOrderingProcess as number);
        setProductPrice(supplierAssessment?.initiationCriteria?.productPrice as number);
        setShippingCost(supplierAssessment?.initiationCriteria?.shippingCost as number);
    }

    const handleMenuClick = async (record: ISupplier) => {
        setOpen(true);
        setActiveSupplier(record);
        try {
            const { data: supplierAssessment } = await apiService.getItem<ISupplierAssessment>(applyTextPlaceholders(Uri.GetSupplierAssessmentDetail, { supplierId: record.id }));
            if (supplierAssessment) {
                setActionMode("EDIT");
                setSupplierAssessment(supplierAssessment);
            } else {
                setActionMode("CREATE");
                setSupplierAssessment(undefined)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const columns: ColumnsType<ISupplier> = [
        {
            title: "Supplier Code", dataIndex: "supplierCode", key: "supplierCode"
        },
        {
            title: "Name", dataIndex: "name", key: "name"
        },
        {
            title: "Phone", dataIndex: "phone", key: "phone"
        },
        {
            title: "Email", dataIndex: "email", key: "email"
        },
        {
            title: "Address", dataIndex: "address", key: "address"
        },
        {
            title: "Created at",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (_, record) => {
                return (moment(record.createdAt).format('DD MMMM YYYY'))
            }
        },
        {
            title: "Action",
            key: "action",
            fixed: "right",
            render: (_, record) => {
                const menu = (
                    <Menu
                        onClick={({ key }) => handleMenuClick(record)}
                        items={[
                            {
                                key: "ASSESSMENT",
                                icon: <CheckSquareOutlined />,
                                label: "Assessment",
                            }
                        ]}
                    />
                );

                return (
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <EllipsisOutlined />
                    </Dropdown>
                );
            },
        }
    ];

    const handleSearch = (value: string) => {
        if (!value) {
            fetchSuppliers(); // reload all if search cleared
            return;
        }
        const filtered = initData.filter((record) =>
            Object.values(record).some((field) =>
                String(field).toLowerCase().includes(value.toLowerCase())
            )
        );
        setDataList(filtered);
    };

    const handleCancel = () => {
        setOpen(false);
        setActiveSupplier(null);
    };

    const handleSubmit = async (action: ActionMode) => {
        switch (action) {
            case "CREATE":
                try {
                    if (activeSupplier) {
                        const data: ISupplierAssessment = {
                            supplierId: activeSupplier.id,
                            supplierCode: activeSupplier.supplierCode,
                            supplierName: activeSupplier.name,
                            initiationCriteria: {
                                productQuality: productQuality,
                                onTimeDelivery: onTimeDelivery,
                                stockAvailability: stockAvailability,
                                completnessDocument: completnessDocument,
                                warranty: warranty,
                                easeOrderingProcess: easyOrdering,
                                productPrice: productPrice,
                                shippingCost: shippingCost
                            }
                        }
                        // Update
                        const { data: created } = await apiService.insertItem<ISupplierAssessment>(Uri.InsertSupplierAssessment, data);
                        setSupplierAssessment(created);
                        message.success("Supplier assessment successfully submitted");
                    }
                } catch (error) {
                    message.error("Operation failed, please try again");
                }
                break;
            case "EDIT":
                try {
                    if (activeSupplier && activeSupplierAssessment) {
                        const data: ISupplierAssessment = {
                            supplierId: activeSupplier.id,
                            supplierCode: activeSupplier.supplierCode,
                            supplierName: activeSupplier.name,
                            initiationCriteria: {
                                productQuality: productQuality,
                                onTimeDelivery: onTimeDelivery,
                                stockAvailability: stockAvailability,
                                completnessDocument: completnessDocument,
                                warranty: warranty,
                                easeOrderingProcess: easyOrdering,
                                productPrice: productPrice,
                                shippingCost: shippingCost
                            }
                        }
                        // Update
                        const { data: updated } = await apiService.patchItem<ISupplierAssessment>(applyTextPlaceholders(Uri.PatchSupplierAssessment, { id: activeSupplierAssessment.id }), {}, data);
                        setSupplierAssessment(updated);
                        message.success("Supplier assessment successfully updated");
                    }
                } catch (error) {
                    message.error("Operation failed, please try again");
                }
                break;
            default:
                break;
        }
    };

    //SUPPLIER DATA END PART

    const styles: any = {
        addonLabel: {
            width: 120,
            fontWeight: 'bold',
            textAlign: 'left'
        },
        submitButtonWrapper: {
            textAlign: 'right',
        },
        submitButton: {
            backgroundColor: 'white',
            fontWeight: 'bold',
            borderRadius: '999px',
            padding: '0 24px',
        },
        fieldInfo: {
            fontSize: 10,
            color: "#fff",
            width: "50%"
        }
    };


    return (<div>
        <div className="custom-table-container">
            <Search
                placeholder="Search"
                allowClear
                onSearch={handleSearch}
                style={{ marginBottom: 16 }}
            />
            <Table
                columns={columns}
                dataSource={dataList}
                scroll={{ y: 300 }}
                rowClassName={() => "custom-row"}
                bordered={false}
                pagination={{ pageSize: 10 }}
                loading={loading}
            />
        </div>
        <Modal
            open={open}
            footer={null}
            onCancel={handleCancel}
            centered
            closeIcon={<span style={{ color: 'white', fontWeight: 'bold' }}>X</span>}
            bodyStyle={{
                backgroundColor: '#2ca89a',
                borderRadius: '20px',
                padding: '32px',

            }}
            width={700}
            style={{ borderRadius: '20px' }}
            title={
                <div
                    style={{
                        backgroundColor: '#153b5c',
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '20px',
                        padding: '10px',
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius: '10px',
                    }}
                >
                    SUPPLIER ASSESSMENT
                </div>
            }
        >
            <Stack tokens={{ childrenGap: 20 }}>
                <Input
                    disabled={true}
                    className="custom-input"
                    addonBefore={
                        <div style={styles.addonLabel}>
                            Supplier Code
                        </div>
                    } placeholder="Input Supplier Code"
                    value={activeSupplier?.supplierCode}
                />


                <Input
                    disabled={true}
                    className="custom-input"
                    addonBefore={
                        <div style={styles.addonLabel}>
                            Name
                        </div>
                    } placeholder="Input Supplier Name"
                    value={activeSupplier?.name}
                />


                <Input
                    disabled={true}
                    className="custom-input"
                    addonBefore={
                        <div style={styles.addonLabel}>
                            Phone
                        </div>
                    } placeholder="Input Phone Number"
                    value={activeSupplier?.phone}
                />


                <Input
                    disabled={true}
                    className="custom-input"
                    addonBefore={
                        <div style={styles.addonLabel}>
                            Email
                        </div>
                    } placeholder="Input Email"
                    value={activeSupplier?.email}
                />


                <Input
                    disabled={true}
                    className="custom-input"
                    addonBefore={
                        <div style={styles.addonLabel}>
                            Address
                        </div>
                    } placeholder="Input Supplier Address"
                    value={activeSupplier?.address}
                />
            </Stack>
            <br />
            <div
                style={{
                    backgroundColor: '#153b5c',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    padding: '10px',
                    borderRadius: '10px',
                }}
            >
                CRITERIA
            </div>
            <br />
            <Stack tokens={{ childrenGap: 20 }}>
                <Stack verticalAlign="center" horizontal horizontalAlign="space-between" tokens={{ childrenGap: 10 }}>
                    <div style={{ width: "50%" }}>
                        <Input
                            className="custom-input"
                            addonBefore={
                                <div style={styles.addonLabel}>
                                    Product Quality
                                </div>
                            }
                            placeholder="Input Score"
                            type="number"
                            onChange={(e) => setProductQuality(Number(e.target.value))}
                            value={productQuality}
                        />
                    </div>
                    <div style={styles.fieldInfo}>
                        (?) The overall quality of goods delivered, including durability, authenticity, and adherence to specifications.
                    </div>
                </Stack>
                <Stack verticalAlign="center" horizontal horizontalAlign="space-between" tokens={{ childrenGap: 10 }}>
                    <div style={{ width: "50%" }}>
                        <Input
                            className="custom-input"
                            addonBefore={
                                <div style={styles.addonLabel}>
                                    Delivery Timeliness
                                </div>
                            }
                            placeholder="Input Score"
                            type="number"
                            onChange={(e) => setOnTimeDelivery(Number(e.target.value))}
                            value={onTimeDelivery}
                        />
                    </div>
                    <div style={styles.fieldInfo}>
                        (?) The supplier's ability to deliver goods on schedule as agreed.
                    </div>
                </Stack>
                <Stack verticalAlign="center" horizontal horizontalAlign="space-between" tokens={{ childrenGap: 10 }}>
                    <div style={{ width: "50%" }}>
                        <Input
                            className="custom-input"
                            addonBefore={
                                <div style={styles.addonLabel}>
                                    Stock Availablility
                                </div>
                            }
                            placeholder="Input Score"
                            type="number"
                            onChange={(e) => setStockAvailability(Number(e.target.value))}
                            value={stockAvailability}
                        />
                    </div>
                    <div style={styles.fieldInfo}>
                        (?) The frequency with which the supplier has items readily in stock
                        without long lead times.
                    </div>
                </Stack>
                <Stack verticalAlign="center" horizontal horizontalAlign="space-between" tokens={{ childrenGap: 10 }}>
                    <div style={{ width: "50%" }}>
                        <Input
                            className="custom-input"
                            addonBefore={
                                <div style={styles.addonLabel}>
                                    Document Completeness
                                </div>
                            }
                            placeholder="Input Score"
                            type="number"
                            onChange={(e) => setCompletnessDocument(Number(e.target.value))}
                            value={completnessDocument}
                        />
                    </div>
                    <div style={styles.fieldInfo}>
                        (?) Availability and accuracy of required documents such as invoices,
                        delivery notes, and others.
                    </div>
                </Stack>
                <Stack verticalAlign="center" horizontal horizontalAlign="space-between" tokens={{ childrenGap: 10 }}>
                    <div style={{ width: "50%" }}>
                        <Input
                            className="custom-input"
                            addonBefore={
                                <div style={styles.addonLabel}>
                                    Warranty
                                </div>
                            }
                            placeholder="Input Score"
                            type="number"
                            onChange={(e) => setWarranty(Number(e.target.value))}
                            value={warranty}
                        />
                    </div>
                    <div style={styles.fieldInfo}>
                        (?) Availability of return or replacement guarantees for defective or
                        non-com pliant goods.
                    </div>
                </Stack>
                <Stack verticalAlign="center" horizontal horizontalAlign="space-between" tokens={{ childrenGap: 10 }}>
                    <div style={{ width: "50%" }}>
                        <Input
                            className="custom-input"
                            addonBefore={
                                <div style={styles.addonLabel}>
                                    Easy of Ordering Process
                                </div>
                            }
                            placeholder="Input Score"
                            type="number"
                            onChange={(e) => setEasyOrdering(Number(e.target.value))}
                            value={easyOrdering}
                        />
                    </div>
                    <div style={styles.fieldInfo}>
                        (?) Ease of placing orders, including system usability, procedures, and communication.
                    </div>
                </Stack>
                <Stack verticalAlign="center" horizontal horizontalAlign="space-between" tokens={{ childrenGap: 10 }}>
                    <div style={{ width: "50%" }}>
                        <Input
                            className="custom-input"
                            addonBefore={
                                <div style={styles.addonLabel}>
                                    Product Price
                                </div>
                            }
                            placeholder="Input Score"
                            type="number"
                            onChange={(e) => setProductPrice(Number(e.target.value))}
                            value={productPrice}
                        />
                    </div>
                    <div style={styles.fieldInfo}>
                        (?) Unit pricing offered by the supplier. The lower, the better, without
                        com promising quality.
                    </div>
                </Stack>
                <Stack verticalAlign="center" horizontal horizontalAlign="space-between" tokens={{ childrenGap: 10 }}>
                    <div style={{ width: "50%" }}>
                        <Input
                            className="custom-input"
                            addonBefore={
                                <div style={styles.addonLabel}>
                                    Delivery Cost
                                </div>
                            }
                            placeholder="Input Score"
                            type="number"
                            onChange={(e) => setShippingCost(Number(e.target.value))}
                            value={shippingCost}
                        />
                    </div>
                    <div style={styles.fieldInfo}>
                        (?) The total cost incurred for delivering goods from the supplier to
                        the buyer.
                    </div>
                </Stack>

                <div style={styles.submitButtonWrapper as any}>
                    <Button
                        htmlType="submit"
                        style={styles.submitButton}
                        onClick={() => handleSubmit(actionMode!)}
                    >
                        Submit
                    </Button>
                </div>
            </Stack>
        </Modal>
    </div>)

}

export default SupplierAssessment;