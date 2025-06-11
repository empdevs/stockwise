import React, { useEffect, useState } from "react";
import { Button, Dropdown, Input, Menu, message, Modal, Select } from "antd";
import moment from "moment";
import { ActionMode, IAuditTrail, ICategory, IItem, IItemUnit, IOptionTypeCustom, ISupplier, ISupplierAssessment, priorityOptions, PriorityType } from "../Types";
import { EditOutlined, DeleteOutlined, EllipsisOutlined, FileSearchOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import { Stack } from "@fluentui/react";
import { ApiService } from "../services/api.service";
import { Uri } from "../Uri";
import NewButton from "../components/NewButton";
import { applyTextPlaceholders, auditLogItemGenerate, rupiahFormat } from "../helper/helper";
import TextArea from "antd/es/input/TextArea";

const { Search } = Input;



interface IItemsPage {
}


const ItemPage: React.FunctionComponent<IItemsPage> = (props: IItemsPage) => {


    const apiService = new ApiService();

    const [initData, setInitData] = useState<IItem[]>([]);
    const [dataList, setDataList] = useState<IItem[]>([]);
    const [categorieOptions, setCategorieOptions] = useState<IOptionTypeCustom<ICategory>[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [itemUnits, setItemUnits] = useState<IItemUnit[]>([]);
    const [unitOptions, setUnitOptions] = useState<IOptionTypeCustom<IItemUnit>[]>([]);
    const [itemCode, setItemCode] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [category, setCategory] = useState<ICategory>();
    const [itemUnit, setItemUnit] = useState<IItemUnit>();
    const [prirority, setPriority] = useState<PriorityType>();
    const [stock, setStock] = useState<number>(0);
    const [minimumStock, setMinimumStock] = useState<number>(0);
    const [unitPrice, setUnitPrice] = useState<number>(0);
    const [sellingPrice, setSellingPrice] = useState<number>(0);
    const [activeItem, setActiveItem] = useState<IItem>();
    const [loading, setLoading] = useState(false);

    // Modal & Form states
    const [open, setOpen] = useState(false);
    const [actionMode, setActionMode] = useState<ActionMode>();


    // Load suppliers from API on mount
    useEffect(() => {
        fetchItems();
        fetchCategories();
        fetchUnits();
    }, []);

    //SUPPLIER DATA START PART
    const fetchItems = async () => {
        setLoading(true);
        try {
            const { data } = await apiService.getItem<IItem[]>(Uri.GetItems);
            setDataList(data);
            setInitData(data);
        } catch (err) {
            message.error("Failed to load items");
        } finally {
            setLoading(false);
        }
    };
    const fetchCategories = async () => {
        try {
            const { data } = await apiService.getItem<ICategory[]>(Uri.GetCategories);
            setCategories(data);
            setCategorieOptions(
                data.map((item) => {
                    return ({
                        value: item.id,
                        label: item.name,
                        data: item
                    })
                })
            )
        } catch (err) {
            message.error("Failed to load categories");
        } finally {
        }
    };
    const fetchUnits = async () => {
        try {
            const { data } = await apiService.getItem<IItemUnit[]>(Uri.GetItemUnits);
            setItemUnits(data);
            setUnitOptions(
                data.map((item) => {
                    return ({
                        value: item.id,
                        label: item.name,
                        data: item
                    })
                })
            )
        } catch (err) {
            message.error("Failed to load item units");
        } finally {
        }
    };

    const setItemData = (record: IItem | undefined) => {
        setItemCode(record?.itemCode as string);
        setName(record?.name as string);
        setCategory({
            id: record?.categoryId as string,
            name: record?.categoryName as string,
            categoryCode: record?.categoryCode as string,
            createdAt: ""
        })
        setItemUnit({
            id: record?.unitId as string,
            name: record?.unitName as string,
            unitCode: record?.unitCode as string,
            createdAt: ""
        });
        setPriority(record?.priority);
        setMinimumStock(record?.minimumStock as number);
        setStock(record?.stock as number);
        setUnitPrice(record?.unitPrice as number);
        setSellingPrice(record?.sellingPrice as number);
        setDescription(record?.description as string);
    }

    const handleMenuClick = async (record: IItem, action: ActionMode) => {
        setActionMode(action);
        setActiveItem(record);
        switch (action) {
            case "EDIT":
                setOpen(true);
                setItemData(record);
                break;
            case "DELETE":
                Modal.confirm({
                    title: `Are you sure you want to delete item ${record.name}?`,
                    okText: "Yes",
                    okType: "danger",
                    cancelText: "No",
                    onOk: async () => {
                        try {
                            await apiService.deleteItem(applyTextPlaceholders(Uri.DeleteItem, { id: record.id }), { itemCode: record.itemCode });
                            setDataList((prev) => prev.filter((item) => item.id !== record.id));
                            message.success("Item deleted successfully");
                        } catch (error) {
                            message.error("Failed to delete item");
                        }
                    },
                });
                break;
            default:
                break;
        }
    };

    const columns: ColumnsType<IItem> = [
        {
            title: "Item Code", dataIndex: "itemCode", key: "itemCode"
        },
        {
            title: "Name", dataIndex: "name", key: "name"
        },
        {
            title: "Description", dataIndex: "description", key: "description"
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
            title: "Minimum Stock", dataIndex: "minimumStock", key: "minimumStock"
        },
        {
            title: "Stock", dataIndex: "stock", key: "stock"
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
            title: "Selling Price",
            dataIndex: "sellingPrice",
            key: "sellingPrice",
            render: (_, record) => {
                return rupiahFormat(record.sellingPrice);
            }

        },
        {
            title: "Cost price",
            dataIndex: "unitPrice",
            key: "unitPrice",
            render: (_, record) => {
                return rupiahFormat(record.unitPrice);
            }
        },
        {
            title: "Last Restocked",
            dataIndex: "lastTimeRestocked",
            key: "lastTimeRestocked",
            render: (_, record) => {
                return (moment(record.lastTimeRestocked).format('DD MMMM YYYY'))
            }
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
                        onClick={({ key }) => handleMenuClick(record, key as ActionMode)}
                        items={[
                            {
                                key: "EDIT",
                                icon: <EditOutlined />,
                                label: "Edit",
                            },
                            {
                                key: "DELETE",
                                icon: <DeleteOutlined />,
                                label: "Delete",
                                danger: true,
                            },
                            // {
                            //     key: "AUDIT LOG",
                            //     icon: <FileSearchOutlined />,
                            //     label: "Audit Log",
                            // },
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
            fetchItems(); // reload all if search cleared
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

    const handleSubmit = async (action: ActionMode) => {
        const fields = [
            itemCode,
            name,
            category?.id,
            itemUnit?.id,
            prirority,
        ];
        if (fields?.some((item) => item == "")) {
            message.error("Please fill all required fields correctly.");
            return;
        }
        switch (action) {
            case "CREATE":
                try {
                    const data: IItem = {
                        itemCode: itemCode,
                        name: name,
                        description: description,
                        categoryId: category?.id!,
                        categoryCode: category?.categoryCode!,
                        categoryName: category?.name!,
                        unitId: itemUnit?.id!,
                        unitCode: itemUnit?.unitCode!,
                        unitName: itemUnit?.name!,
                        priority: prirority!,
                        stock: stock,
                        unitPrice: unitPrice,
                        sellingPrice: sellingPrice,
                        minimumStock: minimumStock
                    }
                    // Update
                    await apiService.insertItem<IItem>(Uri.InsertItem, data);
                    message.success("Item created sucessfully");
                    fetchItems();
                    handleCancel();
                } catch (error) {
                    message.error("Operation failed, please try again");
                }
                break;
            case "EDIT":
                try {
                    const data: IItem = {
                        id: activeItem?.id,
                        itemCode: itemCode,
                        name: name,
                        description: description,
                        categoryId: category?.id!,
                        categoryCode: category?.categoryCode!,
                        categoryName: category?.name!,
                        unitId: itemUnit?.id!,
                        unitCode: itemUnit?.unitCode!,
                        unitName: itemUnit?.name!,
                        priority: prirority!,
                        stock: stock,
                        unitPrice: unitPrice,
                        sellingPrice: sellingPrice,
                        minimumStock: minimumStock
                    }

                    const auditTrail = auditLogItemGenerate(data, activeItem!, "update");
                    const body = {
                        item: data,
                        auditTrail: auditTrail
                    }
                    // Update
                    await apiService.patchItem<IItem>(applyTextPlaceholders(Uri.PatchItem, { id: activeItem!.id }), {}, body);
                    message.success("Item updated sucessfully");
                    fetchItems();
                    handleCancel();
                } catch (error) {
                    message.error("Operation failed, please try again");
                }
                break;
            default:
                break;
        }

        setItemData(undefined);
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
                    scroll={{ x: "max-content" }}
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
                        {actionMode === "CREATE" ?
                            "CREATE NEW ITEM" :
                            actionMode === "EDIT" ?
                                "EDIT ITEM" : ""}
                    </div>
                }
            >
                <Stack tokens={{ childrenGap: 20 }}>
                    <Input
                        className="custom-input"
                        addonBefore={
                            <div style={styles.addonLabel}>
                                Item Code
                            </div>
                        } placeholder="Input Item Code"
                        onChange={(e) => setItemCode(e.target.value)}
                        value={itemCode}
                        readOnly={(actionMode === "EDIT")}
                    />


                    <Input
                        className="custom-input"
                        addonBefore={
                            <div style={styles.addonLabel}>
                                Name
                            </div>
                        } placeholder="Input Item Name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />

                    <div
                        className="custom-input"
                        style={styles.selectWrapper}>
                        <div style={styles.SelectAddonLabel}>Category</div>
                        <Select
                            defaultValue=""
                            placeholder="Input Item Category"
                            style={styles.select}
                            options={categorieOptions}
                            onChange={(e) => {
                                const category = categories.find((item) => item.id === e);
                                setCategory(category);
                            }}
                            value={category?.id}
                            disabled={(actionMode === "EDIT")}
                            optionRender={(option) => {
                                const item: ICategory = option.data.data!;
                                const label = `${item.categoryCode} - ${item.name}`;
                                return (
                                    <Stack>
                                        {label}
                                    </Stack>
                                );
                            }}
                        />
                    </div>
                    <div
                        className="custom-input"
                        style={styles.selectWrapper}>
                        <div style={styles.SelectAddonLabel}>Unit</div>
                        <Select
                            defaultValue=""
                            placeholder="Input Item Unit"
                            style={styles.select}
                            options={unitOptions}
                            onChange={(e) => {
                                const unit = itemUnits.find((item) => item.id === e);
                                setItemUnit(unit);
                            }}
                            value={itemUnit?.id}
                            disabled={(actionMode === "EDIT")}
                            optionRender={(option) => {
                                const item: IItemUnit = option.data.data!;
                                const label = `${item.unitCode} - ${item.name}`;
                                return (
                                    <Stack>
                                        {label}
                                    </Stack>
                                );
                            }}
                        />
                    </div>
                    <div
                        className="custom-input"
                        style={styles.selectWrapper}>
                        <div style={styles.SelectAddonLabel}>Priority</div>
                        <Select
                            defaultValue=""
                            placeholder="Input Item Priority"
                            style={styles.select}
                            options={priorityOptions}
                            onChange={(value) => setPriority(value as PriorityType)}
                            value={prirority}
                        />
                    </div>

                    <Input
                        className="custom-input"
                        addonBefore={
                            <div style={styles.addonLabel}>
                                Minimum Stock
                            </div>
                        }
                        placeholder="Input Minimum Stock"
                        type="number"
                        onChange={(e) => setMinimumStock(Number(e.target.value))}
                        value={minimumStock}
                    />
                    <Input
                        className="custom-input"
                        addonBefore={
                            <div style={styles.addonLabel}>
                                Stock
                            </div>
                        }
                        placeholder="Input Stock"
                        type="number"
                        onChange={(e) => setStock(Number(e.target.value))}
                        readOnly={(actionMode === "EDIT")}
                        value={stock}
                    />

                    <Input
                        className="custom-input"
                        addonBefore={
                            <div style={styles.addonLabel}>
                                Cost Price
                            </div>
                        }
                        placeholder="Input Cost Price"
                        type="number"
                        onChange={(e) => setUnitPrice(Number(e.target.value))}
                        value={unitPrice}
                        readOnly={(actionMode === "EDIT")}
                    />

                    <Input
                        className="custom-input"
                        addonBefore={
                            <div style={styles.addonLabel}>
                                Selling Price
                            </div>
                        }
                        placeholder="Input Selling Price"
                        type="number"
                        onChange={(e) => setSellingPrice(Number(e.target.value))}
                        value={sellingPrice}
                    />
                    <TextArea
                        className="custom-input"
                        placeholder="Input Description"
                        rows={4}
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    />

                    <div style={styles.submitButtonWrapper as any}>
                        <Button
                            htmlType="submit"
                            style={styles.submitButton}
                            onClick={() => handleSubmit(actionMode!)}
                        >
                            {actionMode === "CREATE" ?
                                "Create" :
                                actionMode === "EDIT" ?
                                    "Edit" : ""}
                        </Button>
                    </div>
                </Stack>
            </Modal>
        </div>)

}

export default ItemPage;