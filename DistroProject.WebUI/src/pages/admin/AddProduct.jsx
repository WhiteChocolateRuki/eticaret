import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Upload, Select, message, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const AddProduct = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const [categories, setCategories] = useState([]);

    useEffect(() => {
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
        fetchCategories();
    }, []);

    const onFinish = async (values) => {
        setLoading(true);
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

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (response.ok) {
                message.success('Product added successfully!');
                form.resetFields();
            } else {
                const errorText = await response.text();
                message.error(`Failed to add product: ${errorText}`);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            message.error('An error occurred while adding the product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <Title level={2}>Yeni Ürün Ekle</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
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
                        Ürünü Ekle
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddProduct;
