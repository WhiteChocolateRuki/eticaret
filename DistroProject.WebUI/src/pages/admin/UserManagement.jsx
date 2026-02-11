import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Tabs, Tag, Popconfirm } from 'antd';
import { UserAddOutlined, CarOutlined, SafetyCertificateOutlined, DeleteOutlined } from '@ant-design/icons';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('drivers');
    const [form] = Form.useForm();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const endpoint = activeTab === 'drivers' ? '/users/drivers' : '/users/admins';

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                message.error('Kullanıcılar getirilemedi.');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            message.error('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [activeTab]);

    const handleAddUser = async (values) => {
        try {
            const token = localStorage.getItem('token');
            const endpoint = activeTab === 'drivers' ? '/users/create-driver' : '/users/create-admin';

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                message.success(`${activeTab === 'drivers' ? 'Sürücü' : 'Yönetici'} başarıyla eklendi!`);
                setIsModalVisible(false);
                form.resetFields();
                fetchUsers();
            } else {
                const errorData = await response.text();
                message.error(`Hata: ${errorData}`);
            }
        } catch (error) {
            console.error('Error adding user:', error);
            message.error('Kullanıcı eklenirken bir hata oluştu.');
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                message.success('Kullanıcı başarıyla silindi.');
                fetchUsers();
            } else {
                const errorData = await response.text();
                message.error(`Silme işlemi başarısız: ${errorData}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            message.error('Kullanıcı silinirken bir hata oluştu.');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'İsim',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'E-posta',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Rol',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role === 'Admin' ? 'red' : 'blue'}>
                    {role === 'Admin' ? 'Yönetici' : 'Sürücü'}
                </Tag>
            )
        },
        {
            title: 'İşlemler',
            key: 'actions',
            render: (_, record) => (
                <Popconfirm
                    title="Kullanıcıyı Sil"
                    description={`Bu ${record.role === 'Admin' ? 'yöneticiyi' : 'sürücüyü'} silmek istediğinize emin misiniz?`}
                    onConfirm={() => handleDeleteUser(record.id)}
                    okText="Evet"
                    cancelText="Hayır"
                >
                    <Button danger icon={<DeleteOutlined />} size="small">
                        Sil
                    </Button>
                </Popconfirm>
            )
        }
    ];

    const items = [
        {
            key: 'drivers',
            label: (
                <span>
                    <CarOutlined />
                    Sürücüler
                </span>
            ),
        },
        {
            key: 'admins',
            label: (
                <span>
                    <SafetyCertificateOutlined />
                    Yöneticiler
                </span>
            ),
        },
    ];

    return (
        <div>
            <Card
                title="Kullanıcı Yönetimi"
                extra={
                    <Button type="primary" icon={<UserAddOutlined />} onClick={() => setIsModalVisible(true)}>
                        {activeTab === 'drivers' ? 'Sürücü Ekle' : 'Yönetici Ekle'}
                    </Button>
                }
            >
                <Tabs
                    defaultActiveKey="drivers"
                    items={items}
                    onChange={setActiveTab}
                    style={{ marginBottom: 16 }}
                />

                <Table
                    dataSource={users}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                />
            </Card>

            <Modal
                title={activeTab === 'drivers' ? 'Yeni Sürücü Ekle' : 'Yeni Yönetici Ekle'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddUser}
                >
                    <Form.Item
                        name="username"
                        label="Kullanıcı Adı"
                        rules={[{ required: true, message: 'Lütfen kullanıcı adı girin!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="E-posta"
                        rules={[
                            { required: true, message: 'Lütfen e-posta girin!' },
                            { type: 'email', message: 'Geçerli bir e-posta girin!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Şifre"
                        rules={[{ required: true, message: 'Lütfen şifre girin!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {activeTab === 'drivers' ? 'Sürücü Ekle' : 'Yönetici Ekle'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;
