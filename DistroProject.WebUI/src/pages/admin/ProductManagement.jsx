import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Upload, message, Card, Popconfirm, Image, Tag } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`);
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                message.error('Ürünler getirilemedi.');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            message.error('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`);
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleAddClick = () => {
        setEditingProduct(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        form.setFieldsValue({
            name: product.name,
            price: product.price,
            stock: product.stock,
            unitType: product.unitType,
            categoryIds: product.categories?.map(c => c.id) || [],
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                message.success('Ürün başarıyla silindi.');
                fetchProducts();
            } else {
                message.error('Silme işlemi başarısız.');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            message.error('Bir hata oluştu.');
        }
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('Name', values.name);
        formData.append('Price', values.price);
        formData.append('UnitType', values.unitType);
        formData.append('Stock', values.stock);

        if (values.categoryIds) {
            values.categoryIds.forEach(id => {
                formData.append('CategoryIds', id);
            });
        }

        if (values.image && values.image.fileList.length > 0) {
            formData.append('ImageFile', values.image.fileList[0].originFileObj);
        }

        const url = editingProduct
            ? `${import.meta.env.VITE_API_BASE_URL}/products/${editingProduct.id}`
            : `${import.meta.env.VITE_API_BASE_URL}/products`;

        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (response.ok) {
                message.success(`Ürün başarıyla ${editingProduct ? 'güncellendi' : 'eklendi'}!`);
                setIsModalVisible(false);
                form.resetFields();
                fetchProducts();
            } else {
                const errorText = await response.text();
                message.error(`İşlem başarısız: ${errorText}`);
            }
        } catch (error) {
            console.error('Error saving product:', error);
            message.error('Bir hata oluştu.');
        }
    };

    const columns = [
        {
            title: 'Görsel',
            dataIndex: 'image',
            key: 'image',
            render: (image) => image ? (
                <Image
                    src={`data:image/jpeg;base64,${image}`}
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover' }}
                />
            ) : <div style={{ width: 50, height: 50, background: '#f0f0f0' }}>No Img</div>,
        },
        {
            title: 'Ürün Adı',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Fiyat',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price}`,
        },
        {
            title: 'Stok',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Birim',
            dataIndex: 'unitType',
            key: 'unitType',
        },
        {
            title: 'Kategoriler',
            dataIndex: 'categories',
            key: 'categories',
            render: (categories) => (
                <>
                    {categories?.map(cat => (
                        <Tag key={cat.id} color="blue">{cat.name}</Tag>
                    ))}
                </>
            ),
        },
        {
            title: 'İşlemler',
            key: 'actions',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditClick(record)}
                        size="small"
                    >
                        Düzenle
                    </Button>
                    <Popconfirm
                        title="Ürünü Sil"
                        description="Bu ürünü silmek istediğinize emin misiniz?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Evet"
                        cancelText="Hayır"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Sil
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Card
                title="Ürün Yönetimi"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
                        Yeni Ürün Ekle
                    </Button>
                }
            >
                <Table
                    dataSource={products}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ unitType: 'Piece' }}
                >
                    <Form.Item
                        name="name"
                        label="Ürün Adı"
                        rules={[{ required: true, message: 'Please enter product name' }]}
                    >
                        <Input placeholder="Enter product name" />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Fiyat"
                        rules={[{ required: true, message: 'Please enter price' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            min={0}
                        />
                    </Form.Item>

                    <Form.Item
                        name="categoryIds"
                        label="Kategoriler"
                        rules={[{ required: true, message: 'Please select at least one category' }]}
                    >
                        <Select mode="multiple" placeholder="Select categories">
                            {categories.map(category => (
                                <Option key={category.id} value={category.id}>{category.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="unitType"
                        label="Birim Türü"
                        rules={[{ required: true }]}
                    >
                        <Select>
                            <Option value="Piece">Adet (Piece)</Option>
                            <Option value="Kg">Kilogram (Kg)</Option>
                            <Option value="Liter">Litre (Liter)</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="stock"
                        label="Stok Miktarı"
                        rules={[{ required: true, message: 'Please enter stock quantity' }]}
                    >
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Ürün Görseli"
                        extra={editingProduct && "Yeni bir dosya yüklemezseniz mevcut görsel korunur."}
                    >
                        <Upload
                            beforeUpload={() => false}
                            listType="picture"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            {editingProduct ? "Güncelle" : "Ekle"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManagement;
