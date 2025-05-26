import React, { useEffect, useState } from "react";
import { Button, Dropdown, Input, Menu, message, Modal, Select } from "antd";
import moment from "moment";
import { ActionMode, IAuditTrail, ICategory, IIncomingStock, IItem, IItemUnit, ISupplier, ISupplierAssessment, PriorityType } from "../Types";
import { EditOutlined, DeleteOutlined, EllipsisOutlined, FileSearchOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import { Stack } from "@fluentui/react";
import { ApiService } from "../services/api.service";
import { Uri } from "../Uri";
import NewButton from "../components/NewButton";
import { applyTextPlaceholders } from "../helper/helper";
import TextArea from "antd/es/input/TextArea";

const { Search } = Input;


interface IOptionTypeCustom<T> {
    value: string,
    label: string,
    data?: T
}
interface IIncomingStockPage {
}

const IncomingStock: React.FunctionComponent<IIncomingStockPage> = (props: IIncomingStockPage) => {


    const apiService = new ApiService();

    const [initData, setInitData] = useState<IIncomingStock[]>([]);
    const [dataList, setDataList] = useState<IIncomingStock[]>([]);
    const [items, setItems] = useState<IItem[]>([]);
    const [item, setItem] = useState<IItem>();
    const [itemOptions, setItemOptions] = useState<IOptionTypeCustom<IItem>[]>([]);
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [supplier, setSupplier] = useState<ISupplier>();
    const [supplierOptions, setSupplierOptions] = useState<IOptionTypeCustom<ISupplier>[]>([]);

    const [stockReceived, setStockReceived] = useState<number>(0);
    const [unitPrice, setUnitPrice] = useState<number>(0);

    const [loading, setLoading] = useState(false);

    // Modal & Form states
    const [open, setOpen] = useState(false);
    const [actionMode, setActionMode] = useState<ActionMode>();


    // Load suppliers from API on mount
    useEffect(() => {
        fetchIncomingStock();
        fetchItems();
        fetchSuppliers();
    }, []);

    const fetchIncomingStock = async () => {
        setLoading(true);
        try {
            const { data } = await apiService.getItem<IIncomingStock[]>(Uri.GetIncomingStock);
            setDataList(data);
            setInitData(data);
        } catch (err) {
            message.error("Failed to load incoming stock");
        } finally {
            setLoading(false);
        }
    };
    const fetchItems = async () => {
        try {
            const { data } = await apiService.getItem<IItem[]>(Uri.GetItems);
            setItems(data);
            setItemOptions(
                data.map((item) => {
                    return ({
                        label: item.name!,
                        value: item.id!,
                        data: item!
                    })
                })
            )
        } catch (err) {
            message.error("Failed to load items");
        } finally {
        }
    };

    //SUPPLIER DATA START PART
    const fetchSuppliers = async () => {
        try {
            const { data } = await apiService.getItem<ISupplier[]>(Uri.GetSuppliers);
            setSuppliers(data);
            setSupplierOptions(
                data.map((item) => {
                    return ({
                        label: item.name!,
                        value: item.id!,
                        data: item!
                    })
                })
            )
        } catch (err) {
            message.error("Failed to load suppliers");
        } finally {
        }
    };
    const columns: ColumnsType<IIncomingStock> = [
        {
            title: "Item Code", dataIndex: "itemCode", key: "itemCode"
        },
        {
            title: "Item Name", dataIndex: "itemName", key: "itemName"
        },
        {
            title: "Category Code", dataIndex: "categoryCode", key: "categoryCode"
        },
        {
            title: "Category", dataIndex: "categoryName", key: "categoryName"
        },
        {
            title: "Unit Code", dataIndex: "unitCode", key: "unitCode"
        },
        {
            title: "Unit", dataIndex: "unitName", key: "unitName"
        },
        {
            title: "Stock Received", dataIndex: "stockQuantityReceived", key: "stockQuantityReceived"
        },
        {
            title: "Cost price", dataIndex: "unitPrice", key: "unitPrice"
        },
        {
            title: "Supplier Code", dataIndex: "supplierCode", key: "supplierCode"
        },
        {
            title: "Supplier Name", dataIndex: "supplierName", key: "supplierName"
        },
        {
            title: "Created at",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (_, record) => {
                return (moment(record.createdAt).format('DD MMMM YYYY'))
            }
        },
    ];

    const handleSearch = (value: string) => {
        if (!value) {
            fetchIncomingStock(); // reload all if search cleared
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
    };

    const handleSubmit = async () => {
        try {
            const data: IIncomingStock = {
                itemId: item?.id!,
                itemCode: item?.itemCode!,
                itemName: item?.name!,
                categoryId: item?.categoryId!,
                categoryCode: item?.categoryCode!,
                categoryName: item?.categoryName!,
                unitId: item?.unitId!,
                unitCode: item?.unitCode!,
                unitName: item?.unitName!,
                supplierId: supplier?.id!,
                supplierCode: supplier?.supplierCode!,
                supplierName: supplier?.name!,
                unitPrice: unitPrice,
                stockQuantityReceived: stockReceived,
            }
            // Update
            await apiService.insertItem<IIncomingStock>(Uri.InsertIncomingStock, data);
            message.success("Incoming stock created sucessfully");
            fetchIncomingStock();
            handleCancel();
        } catch (error) {
            message.error("Operation failed, please try again");
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
        },
        selectLikeAddon: {
            width: 120,
            fontWeight: 'bold',
            border: 'none',
            backgroundColor: 'transparent',
        },
        SelectAddonLabel: {
            width: 120,
            fontWeight: 'bold',
            textAlign: 'left',
            background: '#fafafa',
            border: '1px solid #d9d9d9',
            borderRight: 'none',
            // borderRadius: '6px 0 0 6px',
            padding: '4px 11px',
            display: 'flex',
            alignItems: 'center'
        },
        selectWrapper: {
            display: 'flex',
            alignItems: 'center',
        },
        select: {
            flex: 1,
            borderRadius: '0 6px 6px 0',
        }
    };


    return (
        <div>
            <Stack horizontalAlign="end">
                <NewButton
                    text="New"
                    onClick={() => {
                        setOpen(true);
                        setActionMode("CREATE");
                    }}
                />
            </Stack>
            <br />
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
                        NEW STOCK
                    </div>
                }
            >
                <Stack tokens={{ childrenGap: 20 }}>
                    <div
                        className="custom-input"
                        style={styles.selectWrapper}>
                        <div style={styles.SelectAddonLabel}>Name</div>
                        <Select
                            defaultValue=""
                            placeholder="Input Item"
                            style={styles.select}
                            options={itemOptions}
                            onChange={(e) => {
                                const activeItem = items.find((item) => item.id === e);
                                setItem(activeItem);
                            }}
                            value={item?.id}
                            disabled={(actionMode === "EDIT")}
                            optionRender={(option) => {
                                const item: IItem = option.data.data!;
                                const label = `${item.itemCode} - ${item.name}`;
                                return (
                                    <Stack>
                                        {label}
                                    </Stack>
                                );
                            }}
                        />
                    </div>
                    <Input
                        className="custom-input"
                        addonBefore={
                            <div style={styles.addonLabel}>
                                Stock Received
                            </div>
                        } placeholder="Input Stock Received"
                        type="number"
                        onChange={(e) => setStockReceived(Number(e.target.value))}
                        value={stockReceived}
                    />


                    <Input
                        className="custom-input"
                        addonBefore={
                            <div style={styles.addonLabel}>
                                Cost Price
                            </div>
                        } placeholder="Input Cost Price"
                        type="number"
                        onChange={(e) => setUnitPrice(Number(e.target.value))}
                        value={unitPrice}
                    />


                    <div
                        className="custom-input"
                        style={styles.selectWrapper}>
                        <div style={styles.SelectAddonLabel}>Supplier</div>
                        <Select
                            defaultValue=""
                            placeholder="Input Supplier"
                            style={styles.select}
                            options={supplierOptions}
                            onChange={(e) => {
                                const activeSupplier = suppliers.find((item) => item.id === e);
                                setSupplier(activeSupplier);
                            }}
                            value={supplier?.id}
                            optionRender={(option) => {
                                const item: ISupplier = option.data.data!;
                                const label = `${item.supplierCode} - ${item.name}`;
                                return (
                                    <Stack>
                                        {label}
                                    </Stack>
                                );
                            }}
                        />
                    </div>

                    <div style={styles.submitButtonWrapper as any}>
                        <Button
                            htmlType="submit"
                            style={styles.submitButton}
                            onClick={() => handleSubmit()}
                        >

                            Submit
                        </Button>
                    </div>
                </Stack>
            </Modal>
        </div>
    )

}

export default IncomingStock;