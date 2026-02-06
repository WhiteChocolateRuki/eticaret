import React, { useEffect, useState } from 'react';
import { Row, Col, Empty, Spin, Typography } from 'antd';
import { getProducts } from '../api/productService';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import './ProductList.css';

const { Title } = Typography;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    // Hardcoded categories as requested for visual frontend task
    const [categories, setCategories] = useState([
        'Sensors, Navigation',
        'Propulsion',
        'Sensors',
        'Mechanical',
        'Electronics'
    ]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([50, 5000]);
    const [maxPrice, setMaxPrice] = useState(5000);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [selectedCategories, priceRange, products]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);

            // We are using static categories for now as requested.
            // keeping maxPrice logic just in case, but visual is 5000.
            const max = Math.max(...data.map(p => p.price), 5000);
            setMaxPrice(max > 5000 ? max : 5000);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let tempProducts = [...products];

        // Filter by Category
        if (selectedCategories.length > 0) {
            tempProducts = tempProducts.filter(p => selectedCategories.includes(p.categoryName || 'Diğer'));
        }

        // Filter by Price
        tempProducts = tempProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        setFilteredProducts(tempProducts);
    };

    const handleCategoryChange = (checkedValues) => {
        setSelectedCategories(checkedValues);
    };

    const handlePriceChange = (value) => {
        setPriceRange(value);
    };

    return (
        <div className="product-page-container">
            <Row gutter={[24, 24]}>
                {/* Sidebar - Desktop: 6, Mobile: 24 */}
                <Col xs={24} md={6}>
                    <FilterSidebar
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryChange}
                        priceRange={priceRange}
                        onPriceChange={handlePriceChange}
                        maxPrice={maxPrice}
                    />
                </Col>

                {/* Product Grid - Desktop: 18, Mobile: 24 */}
                <Col xs={24} md={18}>
                    <Title level={2} style={{ marginTop: 0, marginBottom: '24px', color: '#ffffff' }}>Ürünler</Title>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <Spin size="large" />
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <Row gutter={[16, 24]}>
                            {filteredProducts.map(product => (
                                <Col xs={12} sm={12} md={12} lg={8} key={product.id}>
                                    <ProductCard product={product} />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Empty description="Aradığınız kriterlere uygun ürün bulunamadı." />
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ProductList;
