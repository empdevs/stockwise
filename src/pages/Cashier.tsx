import React, { useEffect, useState } from "react";
import { Button, Checkbox, Dropdown, Input, Menu, message, Modal, Select } from "antd";
import moment from "moment";
import { ActionMode, IItem, IPayment, IPurchasedItem, ITransaction } from "../Types";
import Table, { ColumnsType } from "antd/es/table";
import { Stack } from "@fluentui/react";
import { ApiService } from "../services/api.service";
import { Uri } from "../Uri";
import NewButton from "../components/NewButton";
import { applyTextPlaceholders, auditLogItemGenerate, rupiahFormat, sumArray } from "../helper/helper";
import { EllipsisOutlined, EyeOutlined } from "@ant-design/icons";

const { Search } = Input;


const paymentOptions = [
    { value: '1_cash', label: 'CASH' },
    { value: '2_bca', label: 'BCA' },
    { value: '3_bri', label: 'BRI' },
    { value: '4_mandiri', label: 'MANDIRI' },
    { value: '5_qris', label: 'QRIS' },
    { value: '6_gopay', label: 'GOPAY' },
    { value: '7_ovo', label: 'OVO' },
]

interface ICashierPage { }
const Cashier: React.FunctionComponent<ICashierPage> = (props: ICashierPage) => {


    const apiService = new ApiService();

    const [dataList, setDataList] = useState<ITransaction[]>([]);
    const [purchasedItems, setPurchasedItems] = useState<IPurchasedItem[]>([]);


    const [items, setItems] = useState<IItem[]>([]);
    const [purchasedItemsTemp, setPurchasedItemsTemp] = useState<IPurchasedItem[]>([]);
    const [purchasedItemsInit, setPurchasedItemsInit] = useState<IPurchasedItem[]>([]);

    const [loading, setLoading] = useState(false);

    // Modal & Form states
    const [open, setOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"VIEW" | "TRANSACTION">("VIEW");

    const [customerName, setCustomerName] = useState<string>("");
    const [customerContact, setCustomerContact] = useState<string>("");

    const [paymentMethod, setPaymentMethod] = useState<IPayment["method"]>();
    const [amountPaid, setAmountPaid] = useState<number>(0);
    const [change, setChange] = useState<number>(0);
    const [subtotal, setSubtotal] = useState<number>(0);
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [vatAmount, setVatAmount] = useState<number>(0);
    const [isVatChecked, setIsVatChecked] = useState<boolean>(false);

    const [actionMode, setActionMode] = useState<ActionMode>();
    const [activeItem, setActiveItem] = useState<ITransaction>();


    useEffect(() => {
        fetchItems();
        fetchTransactions();
    }, []);

    function setPurchasedItemsData(items: IItem[]) {
        const purchasedItems: IPurchasedItem[] = items?.map((item) => {
            return ({
                id: item.id!,
                itemCode: item.itemCode,
                name: item.name,
                unitId: item.unitId,
                unitCode: item.unitCode,
                unitName: item.unitName,
                stock: item.stock,
                sellingPrice: item.sellingPrice,
                quantity: 0,
                discount: "",
                total: 0,
                isSelected: false
            })
        })
        setPurchasedItemsTemp(purchasedItems);
        setPurchasedItemsInit(purchasedItems);
    }
    const fetchItems = async () => {
        try {
            const { data } = await apiService.getItem<IItem[]>(Uri.GetItems);
            setItems(data);
            setPurchasedItemsData(data);
        } catch (err) {
            message.error("Failed to load items");
        } finally {
        }
    };
    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const { data } = await apiService.getItem<ITransaction[]>(Uri.GetTransactions);
            setDataList(data);
        } catch (err) {
            message.error("Failed to load items");
        } finally {
            setLoading(false);
        }
    };

    const setItemTransaction = (record: ITransaction | undefined) => {
        setCustomerName(record?.customerName as string);
        setCustomerContact(record?.customerContact as string);
        setPurchasedItems(record?.items as IPurchasedItem[]);
        setSubtotal(record?.subTotal as number);
        setIsVatChecked((record?.vat?.vatAmount! > 0) as boolean);
        setVatAmount(record?.vat?.vatAmount as number);
        setGrandTotal(record?.total as number);
        setPaymentMethod(record?.payment?.method);
        setAmountPaid(record?.payment?.amountPaid as number);
        setChange(record?.payment?.change as number);
    }

    const handleMenuClick = async (record: ITransaction | undefined, action: ActionMode) => {
        setActionMode(action);
        setActiveItem(record);
        switch (action) {
            case "VIEW":
                setViewMode("TRANSACTION");
                setItemTransaction(record);
                break;
            case "CREATE":
                setViewMode("TRANSACTION");
                setItemTransaction(record);
                break;
            default:
                break;
        }
    };

    const columns: ColumnsType<ITransaction> = [
        {
            title: "Invoice No", dataIndex: "invoiceId", key: "invoiceId"
        },
        {
            title: "Invoice Date",
            dataIndex: "invoiceDate",
            key: "invoiceDate",
            render: (_, record) => {
                return (moment(record.invoiceDate).format('DD MMMM YYYY'))
            }

        },
        {
            title: "Customer", dataIndex: "customerName", key: "customerName"
        },
        {
            title: "Customer Contact", dataIndex: "customerContact", key: "customerContact"
        },
        {
            title: "Grand Total",
            dataIndex: "total",
            key: "total",
            render: (_, record) => {
                return (rupiahFormat(record.total))
            }
        },
        {
            title: "Payment",
            dataIndex: "payment",
            key: "payment",
            render: (_, record) => {
                const label = paymentOptions.find((item) => item.value == record.payment.method)?.label
                return (label)
            }
        },
        {
            title: "Action",
            key: "action",
            fixed: "right",
            render: (_, record) => {
                const menu = (
                    <Menu
                        onClick={({ key }) => handleMenuClick(record, key as ActionMode)}
                        items={[
                            {
                                key: "VIEW",
                                icon: <EyeOutlined />,
                                label: "View",
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
    const orderColumns: ColumnsType<IPurchasedItem> = [
        {
            title: "Item Code", dataIndex: "itemCode", key: "itemCode"
        },
        {
            title: "Name", dataIndex: "name", key: "name"
        },
        {
            title: "Unit Code", dataIndex: "unitCode", key: "unitCode"
        },
        {
            title: "Unit", dataIndex: "unitName", key: "unitName"
        },
        {
            title: "Stock", dataIndex: "stock", key: "stock"
        },
        {
            title: "Selling Price",
            dataIndex: "sellingPrice",
            key: "sellingPrice",
            render: (_, record) => {
                return rupiahFormat(record.sellingPrice);
            }
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            render: (_, record) => {
                return (
                    <Input
                        className="custom-input"
                        type="number"
                        onChange={(e) => {
                            const quantity = Number(e.target.value);
                            const total = record.sellingPrice * quantity;
                            const updateItem: IPurchasedItem = {
                                ...record,
                                quantity: quantity,
                                total: total
                            };
                            const newPurchasedItems = purchasedItems.map((item) => item.id === updateItem.id ? updateItem : item);
                            setPurchasedItems(newPurchasedItems)

                            const newSubtotal = sumArray(
                                newPurchasedItems?.map((i) => i.total)
                            )
                            setSubtotal(newSubtotal);
                            let grandTotal = newSubtotal;

                            if (isVatChecked) {
                                const vatRate = 0.12;
                                const vatAmount: number = vatRate * subtotal;
                                grandTotal += vatAmount;
                                setVatAmount(vatAmount);

                            }
                            setGrandTotal(grandTotal);

                        }}
                        readOnly={(actionMode == "VIEW")}
                        value={record?.quantity}
                    />
                )
            }
        },

        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: (_, record) => {
                return (
                    <Input
                        className="custom-input"
                        value={rupiahFormat(record.total)}
                        readOnly
                    />
                )
            }
        },
        {
            title: "",
            dataIndex: "",
            key: "",
            render: (_, record) => {
                return (
                    <Button
                        type="primary"
                        danger
                        onClick={() => {
                            const newPurchasedItems = purchasedItems.filter((item) => item.id !== record.id);
                            setPurchasedItems(newPurchasedItems)
                        }}
                        disabled={(actionMode == "VIEW")}
                    >
                        Delete
                    </Button>
                )
            }
        }
    ];

    const itemColumns: ColumnsType<IPurchasedItem> = [
        {
            title: "Item Code", dataIndex: "itemCode", key: "itemCode"
        },
        {
            title: "Name", dataIndex: "name", key: "name"
        },
        {
            title: "Unit Code", dataIndex: "unitCode", key: "unitCode"
        },
        {
            title: "Unit", dataIndex: "unitName", key: "unitName"
        },
        {
            title: "Stock", dataIndex: "stock", key: "stock"
        },
        {
            title: "Selling Price",
            dataIndex: "sellingPrice",
            key: "sellingPrice",
            render: (_, record) => {
                return rupiahFormat(record.sellingPrice);
            }
        },
        {
            title: "",
            dataIndex: "",
            key: "",
            render: (_, record) => {
                return (
                    <Stack horizontalAlign="center">
                        <Checkbox
                            style={{
                                transform: "scale(1.5)"
                            }}
                            disabled={(record.stock === 0)}
                            onChange={(e) => {
                                const value: boolean = e.target.checked;
                                let selectedItem = purchasedItemsTemp?.find((item) => item.id === record.id);
                                selectedItem!.isSelected = value!;


                                setPurchasedItemsTemp(
                                    purchasedItemsTemp?.map((item) => item.id === selectedItem?.id ? selectedItem : item)
                                );
                                setPurchasedItemsInit(
                                    purchasedItemsInit?.map((item) => item.id === selectedItem?.id ? selectedItem : item)
                                )
                            }}
                            checked={record?.isSelected}
                        />
                    </Stack>
                )
            }
        }
    ];

    const handleSearchItem = (value: string) => {
        if (!value) {
            setPurchasedItemsTemp(purchasedItemsInit);
            return;
        }
        const filtered = purchasedItemsInit.filter((record) =>
            Object.values(record).some((field) =>
                String(field).toLowerCase().includes(value.toLowerCase())
            )
        );
        setPurchasedItemsTemp(filtered);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleAddItems = () => {
        handleCancel();
        const selectedItems = purchasedItemsTemp
            ?.filter((item) => item.isSelected)
            ?.map((item) => {
                delete item.isSelected;
                return item;
            });
        setPurchasedItems([...purchasedItems, ...selectedItems]);
    }

    const onFinish = () => {
        const isValidTransaction = (
            customerName &&
            customerContact &&
            (purchasedItems.length > 0) &&
            (subtotal > 0) &&
            (grandTotal > 0) &&
            (
                (paymentMethod === "1_cash" ? (amountPaid && change) : paymentMethod)

            )
        )

        if (!!!isValidTransaction) {
            message.error("Please ensure all information is entered correctly before submitting.");
        } else {
            Modal.confirm({

                title: 'Confirm Transaction',
                content: 'Are you sure you want to proceed with this transaction?',
                okText: 'Yes',
                cancelText: 'No',
                onOk: () => handleSubmit()
            });
        }
    }

    const handleSubmit = async () => {
        try {
            const data: ITransaction = {
                customerName: customerName,
                customerContact: customerContact!,
                items: purchasedItems,
                subTotal: subtotal,
                discount: "",
                total: grandTotal,
                payment: {
                    method: paymentMethod!,
                    amountPaid: amountPaid,
                    change: change
                },
                vat: {
                    vatRate: "12%",
                    vatAmount: vatAmount
                }
            }
            console.log(data);
            // Update
            await apiService.insertItem<ITransaction>(Uri.CreateTransaction, data);


            message.success("Transaction created sucessfully");

            setCustomerName("");
            setCustomerContact("");
            setPurchasedItems([]);
            setSubtotal(0);
            setGrandTotal(0);
            setPaymentMethod(undefined);
            setAmountPaid(0);
            setChange(0);
            setVatAmount(0);
            setIsVatChecked(false);

            let patchItemRequests: Promise<any>[] = [];
            for (const item of purchasedItems) {

                const activeItem = items.find((i) => i.id === item.id);
                const oldItem = {
                    id: activeItem?.id,
                    itemCode: activeItem?.itemCode,
                    stock: activeItem?.stock
                } as IItem;

                const newStock = (oldItem.stock - item.quantity);
                const newItem = {
                    id: item.id,
                    itemCode: item.itemCode,
                    stock: newStock
                } as IItem;

                const auditTrail = auditLogItemGenerate(newItem, oldItem!, "update");

                const body = {
                    item: { stock: newItem.stock },
                    auditTrail: auditTrail
                }

                // Update
                patchItemRequests.push(apiService.patchItem<IItem>(applyTextPlaceholders(Uri.PatchItem, { id: newItem!.id }), {}, body));

            }
            handleCancel();
            Promise.allSettled(patchItemRequests)
                ?.finally(() => {
                    fetchItems();
                });

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
        },
        whiteText: {
            color: "#fff"
        }
    };


    if (viewMode === "VIEW") {
        return (
            <div>
                <Stack horizontalAlign="end">
                    <NewButton
                        text="Transaction"
                        onClick={() => {
                            handleMenuClick(undefined, "CREATE");
                        }}
                    />
                </Stack>
                <br />
                <div className="custom-table-container">
                    <Search
                        placeholder="Search"
                        allowClear
                        // onSearch={handleSearch}
                        style={{ marginBottom: 16 }}
                    />
                    <Table
                        columns={columns}
                        dataSource={dataList}
                        scroll={{ x: "max-content" }}
                        rowClassName={() => "custom-row"}
                        bordered={false}
                        pagination={{ pageSize: 10 }}
                        loading={loading}
                    />
                </div>
            </div>
        )
    } else if (viewMode === "TRANSACTION") {
        return (
            <div style={{
                backgroundColor: "#2db5a7",
                padding: "20px",
                borderRadius: "20px"
            }}>
                <Stack horizontalAlign="start">
                    <Button
                        onClick={() => {
                            setViewMode("VIEW");
                        }} type="default">
                        ← Back
                    </Button>
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
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius: '10px',
                    }}
                >
                    Transaction
                </div>
                <br />
                <Stack tokens={{ childrenGap: 10 }}>
                    <Stack horizontal>
                        <Stack
                            tokens={{ childrenGap: 20 }} style={{ width: "50%" }}>
                            <Input
                                className="custom-input"
                                addonBefore={
                                    <div style={styles.addonLabel}>
                                        Customer Name
                                    </div>
                                } placeholder="Input Customer Name"
                                onChange={(e) => setCustomerName(e.target.value)}
                                value={customerName}
                                readOnly={(actionMode == "VIEW")}
                            />

                            <Input
                                className="custom-input"
                                addonBefore={
                                    <div style={styles.addonLabel}>
                                        Customer Contact
                                    </div>
                                } placeholder="Input Customer Contact"
                                onChange={(e) => setCustomerContact(e.target.value)}
                                value={customerContact}
                                readOnly={(actionMode == "VIEW")}
                            />
                        </Stack>
                        <Stack></Stack>
                    </Stack>
                    <br />
                    <Stack horizontal horizontalAlign="space-between">
                        <h2 style={styles.whiteText}>Item Entry</h2>
                        <Button
                            htmlType="submit"
                            style={{
                                backgroundColor: "#1c355e",
                                borderColor: "#1c355e",
                                color: "#fff",
                                fontWeight: 'bold',
                                borderRadius: '999px',
                                padding: '0 24px',
                                width: 140
                            }}
                            onClick={() => {
                                setOpen(true);
                                const itemsProvided = items.filter((i) => !!!purchasedItems.find((p) => p.id === i.id));
                                setPurchasedItemsData(itemsProvided);
                            }}
                            disabled={(actionMode == "VIEW")}
                        >

                            Add Item
                        </Button>
                    </Stack>
                    <Table
                        columns={orderColumns}
                        dataSource={purchasedItems}
                        scroll={{ x: "max-content" }}
                        bordered={false}
                        pagination={false}
                    />
                    <br />
                    <h2 style={styles.whiteText}>Calculate Price</h2>
                    <Stack
                        style={{
                            backgroundColor: "#fff",
                            padding: 20,
                            borderRadius: 20
                        }}
                        tokens={{ childrenGap: 10 }}>
                        <Stack horizontal horizontalAlign="space-between">
                            <Stack>
                                <strong>Subtotal</strong>
                            </Stack>
                            <Stack>
                                <strong>{rupiahFormat(subtotal)}</strong>
                            </Stack>
                        </Stack>
                        <Stack horizontal horizontalAlign="space-between">
                            <Stack>
                                <strong>VAT (12%)</strong>
                            </Stack>
                            <Stack>
                                <Checkbox
                                    onChange={(e) => {
                                        const value = e.target.checked;
                                        let grandTotal: number = subtotal;
                                        const vatRate = 0.12;
                                        const vatAmount: number = vatRate * subtotal;

                                        if (value) grandTotal += vatAmount;
                                        else grandTotal -= vatAmount;

                                        setGrandTotal(grandTotal);
                                        setVatAmount(vatAmount)
                                        setIsVatChecked(value)
                                    }}
                                    checked={isVatChecked}
                                    disabled={(actionMode == "VIEW")}
                                />
                            </Stack>
                        </Stack>
                        {/* If  VAT is checked we will display this*/}
                        <Stack horizontal horizontalAlign="space-between">
                            <Stack></Stack>
                            <Stack>
                                <strong>{rupiahFormat(vatAmount)}</strong>
                            </Stack>
                        </Stack>

                        <Stack horizontal horizontalAlign="space-between">
                            <Stack>
                                <strong>Grand Total</strong>
                            </Stack>
                            <Stack>
                                <strong>{rupiahFormat(grandTotal)}</strong>
                            </Stack>
                        </Stack>
                    </Stack>

                    <h2 style={styles.whiteText}>Payment Method</h2>
                    <Stack>
                        <Select
                            placeholder="Select payment method"
                            style={{ width: 200 }}
                            onChange={(value) => setPaymentMethod(value)}
                            options={paymentOptions}
                            value={paymentMethod}
                            disabled={(actionMode == "VIEW")}
                        />
                        <br />
                        {paymentMethod === "1_cash" &&
                            <Stack horizontal>
                                <Stack horizontal tokens={{ childrenGap: 20 }}>
                                    <Stack
                                        tokens={{ childrenGap: 10 }}
                                        style={{ width: "70%" }}>
                                        <Input
                                            className="custom-input"
                                            addonBefore={
                                                <div style={styles.addonLabel}>
                                                    Amount Paid
                                                </div>
                                            }
                                            type="number"
                                            onChange={(e) => setAmountPaid(Number(e.target.value))}
                                            value={amountPaid}
                                            readOnly={(actionMode == "VIEW")}
                                        />

                                        <Input
                                            className="custom-input"
                                            addonBefore={
                                                <div style={styles.addonLabel}>
                                                    Change
                                                </div>
                                            }
                                            value={rupiahFormat(change)}
                                            readOnly
                                        />


                                    </Stack>
                                    <Stack
                                        style={{ width: "35%" }}
                                    >
                                        <Button
                                            type="primary"
                                            style={{
                                                backgroundColor: '#e4ff00', // custom green color (adjust if needed)
                                                borderColor: '#e4ff00',
                                                borderRadius: '999px', // pill shape
                                                fontWeight: 'bold',
                                                padding: '0 24px',
                                                height: '32px',
                                                color: "#000"
                                            }}
                                            disabled={(amountPaid < grandTotal) || (actionMode == "VIEW")}
                                            onClick={() => {
                                                const change = amountPaid - grandTotal;
                                                setChange(change)
                                            }}
                                        >
                                            Change
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Stack>
                        }
                    </Stack>
                    <br />
                    <Button
                        htmlType="submit"
                        style={{
                            backgroundColor: "#1c355e",
                            borderColor: "#1c355e",
                            color: "#fff",
                            fontWeight: 'bold',
                            borderRadius: '999px',
                            padding: '0 24px',
                            width: 140
                        }}
                        onClick={onFinish}
                        disabled={(actionMode == "VIEW")}
                    >

                        Submit
                    </Button>

                </Stack>
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
                    width={900}
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
                            ADD ITEM
                        </div>
                    }
                >
                    <Stack tokens={{ childrenGap: 20 }}>
                        <Stack>
                            <Search
                                placeholder="Search"
                                allowClear
                                onSearch={handleSearchItem}
                                style={{ marginBottom: 16 }}
                            />

                            <Table
                                columns={itemColumns}
                                dataSource={purchasedItemsTemp}
                                scroll={{ x: "max-content" }}
                                bordered={false}
                                pagination={false}
                            />
                        </Stack>
                        <div style={styles.submitButtonWrapper as any}>
                            <Button
                                htmlType="submit"
                                style={styles.submitButton}
                                onClick={handleAddItems}
                            >

                                Add
                            </Button>
                        </div>
                    </Stack>
                </Modal>
            </div>
        )
    }

}

export default Cashier; 