import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, message } from 'antd';
import { getProducts } from '../api/productService';

const { Title } = Typography;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            message.error("Veriler yüklenemedi! Backend çalışıyor mu?");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (image, record) => image ? (
                <img
                    src={`data:${record.imageContentType || 'image/png'};base64,${image}`}
                    alt={record.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                />
            ) : null
        },
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price}`
        },
        {
            title: 'Unit',
            dataIndex: 'unitType',
            key: 'unitType'
        },
        {
            title: 'Stock Status',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => (
                <Tag color={stock < 10 ? 'orange' : 'cyan'}>
                    {stock} Units Left
                </Tag>
            )
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Ürün Listesi</Title>
            <Table columns={columns} dataSource={products} rowKey="id" loading={loading} />
        </div>
    );
};

export default ProductList;