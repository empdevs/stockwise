import React, { useEffect, useState } from "react";
import { Table, Input, Menu, Dropdown, Button, Modal, Form, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Stack } from "@fluentui/react";
import { ISupplier, ActionMode } from "../Types";
import { ApiService } from "../services/api.service";
import { Uri } from "../Uri";
import { applyTextPlaceholders } from "../helper/helper";
import moment from "moment";
import NewButton from "../components/NewButton";

const { Search } = Input;

interface ISupplierData {
}

const SupplierData: React.FunctionComponent<ISupplierData> = (props: ISupplierData) => {

    const apiService = new ApiService();

    const [initData, setInitData] = useState<ISupplier[]>([]);
    const [dataList, setDataList] = useState<ISupplier[]>([]);

    const [loading, setLoading] = useState(false);

    // Modal & Form states
    const [open, setOpen] = useState(false);

    const [activeSupplier, setActiveSupplier] = useState<ISupplier | null>(null);
    const [form] = Form.useForm();

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

    const showModal = (supplier: ISupplier, actionMode: ActionMode) => {
        switch (actionMode) {
            case "EDIT":
                setActiveSupplier(supplier || null);
                if (supplier) {
                    // Editing: set form fields
                    form.setFieldsValue({
                        supplierCode: supplier.supplierCode,
                        name: supplier.name,
                        phone: supplier.phone,
                        email: supplier.email,
                        address: supplier.address,
                    });
                } else {
                    form.resetFields();
                }
                break;
            default:
                break;
        }

        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
        setActiveSupplier(null);
        form.resetFields();
    };

    // Create or update supplier
    const handleFinish = async (values: any) => {
        try {
            if (activeSupplier) {
                // Update
                const { data: updated } = await apiService.patchItem<ISupplier>(applyTextPlaceholders(Uri.PatchSupplier, { id: activeSupplier.id }), {}, values);

                setDataList((prev) =>
                    prev.map((item) => (item.id === updated.id ? updated : item))
                );
                message.success("Supplier updated successfully");
            } else {
                // Create
                const { data: created } = await apiService.insertItem<ISupplier>(Uri.InsertSupplier, values);
                setDataList((prev) => [created, ...prev]);
                message.success("Supplier created successfully");
            }
            handleCancel();
        } catch (error) {
            message.error("Operation failed, please try again");
        }
    };

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

    // Handle dropdown menu clicks (edit/delete)
    const handleMenuClick = async (record: ISupplier, action: ActionMode) => {
        setActionMode(action);

        switch (action) {
            case "EDIT":
                showModal(record, action);
                break;
            case "DELETE":
                Modal.confirm({
                    title: `Are you sure you want to delete supplier ${record.name}?`,
                    okText: "Yes",
                    okType: "danger",
                    cancelText: "No",
                    onOk: async () => {
                        try {
                            await apiService.deleteItem(applyTextPlaceholders(Uri.DeleteSupplier, { id: record.id }));
                            setDataList((prev) => prev.filter((item) => item.id !== record.id));
                            message.success("Supplier deleted successfully");
                        } catch (error) {
                            message.error("Failed to delete supplier");
                        }
                    },
                });
                break;

            default:
                break;
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
    };

    return (
        <div>
            <Stack horizontalAlign="end">
                <NewButton
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
                            "ADD NEW SUPPLIER" :
                            actionMode === "EDIT" ?
                                "EDIT SUPPLIER" : ""}
                    </div>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    initialValues={{
                        supplierCode: "",
                        name: "",
                        phone: "",
                        email: "",
                        address: "",
                    }}>
                    <Form.Item
                        name="supplierCode"
                        rules={[{ required: true, message: 'Please input Supplier Code' }]}
                    >
                        <Input
                            disabled={actionMode === "EDIT"}
                            className="custom-input"
                            addonBefore={
                                <div style={styles.addonLabel}>
                                    Supplier Code
                                </div>
                            } placeholder="Input Supplier Code" />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input Supplier Name' }]}
                    >
                        <Input
                            className="custom-input"
                            addonBefore={
                                <div style={styles.addonLabel}>
                                    Name
                                </div>
                            } placeholder="Input Supplier Name" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        rules={[{ required: true, message: 'Please input Phone Number' }]}
                    >
                        <Input
                            className="custom-input"
                            addonBefore={
                                <div style={styles.addonLabel}>
                                    Phone
                                </div>
                            } placeholder="Input Phone Number" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input Email' }]}
                    >
                        <Input
                            className="custom-input"
                            addonBefore={
                                <div style={styles.addonLabel}>
                                    Email
                                </div>
                            } placeholder="Input Email" />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        rules={[{ required: true, message: 'Please input Address' }]}
                    >
                        <Input
                            className="custom-input"
                            addonBefore={
                                <div style={styles.addonLabel}>
                                    Address
                                </div>
                            } placeholder="Input Supplier Address" />
                    </Form.Item>

                    <Form.Item>
                        <div style={styles.submitButtonWrapper as any}>
                            <Button
                                htmlType="submit"
                                style={styles.submitButton}
                            >
                                Create
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
export default SupplierData;