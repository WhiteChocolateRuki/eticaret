import { useState, useEffect } from 'react';
import { Table, Button, Modal, Select, message, Tag, Typography } from 'antd';
import { CarOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assignModalVisible, setAssignModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);

    const token = localStorage.getItem('token');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/pending`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                message.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDrivers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/drivers`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDrivers(data);
            }
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchDrivers();
    }, []);

    const handleAssignClick = (order) => {
        setSelectedOrder(order);
        setAssignModalVisible(true);
        setSelectedDriver(null);
    };

    const handleAssignSubmit = async () => {
        if (!selectedDriver) {
            message.warning('Please select a driver!');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/assign-driver/${selectedOrder.id}?driverId=${selectedDriver}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                message.success('Order assigned successfully!');
                setAssignModalVisible(false);
                fetchOrders(); // Refresh list
            } else {
                message.error('Failed to assign driver');
            }
        } catch (error) {
            console.error('Error assigning driver:', error);
            message.error('An error occurred');
        }
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Product',
            dataIndex: ['product', 'name'],
            key: 'productName',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => `$${price}`
        },
        {
            title: 'Customer',
            dataIndex: ['customer', 'fullName'], // Assuming User model has FullName or similar
            key: 'customer',
            render: (text, record) => record.customer?.fullName || record.customerId
        },
        {
            title: 'Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Pending' ? 'orange' : 'green'}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<CarOutlined />}
                    onClick={() => handleAssignClick(record)}
                >
                    Assign Driver
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Title level={2}>Sipariş Yönetimi (Bekleyen Siparişler)</Title>
            <Table
                columns={columns}
                dataSource={orders}
                rowKey="id"
                loading={loading}
            />

            <Modal
                title="Şoför Ata"
                open={assignModalVisible}
                onOk={handleAssignSubmit}
                onCancel={() => setAssignModalVisible(false)}
            >
                <p>Assigning order <strong>#{selectedOrder?.id}</strong></p>
                <p>Product: <strong>{selectedOrder?.product?.name}</strong></p>

                <Select
                    style={{ width: '100%' }}
                    placeholder="Select a driver"
                    onChange={(value) => setSelectedDriver(value)}
                    value={selectedDriver}
                >
                    {drivers.map(driver => (
                        <Option key={driver.id} value={driver.id}>
                            {driver.fullName || driver.email} (ID: {driver.id})
                        </Option>
                    ))}
                </Select>
            </Modal>
        </div>
    );
};

export default OrderManagement;
