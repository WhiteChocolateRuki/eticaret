import React from 'react';
import { Checkbox, Slider, Typography } from 'antd';
import '../pages/ProductList.css';

const { Title, Text } = Typography;

const FilterSidebar = ({ categories, selectedCategories, onCategoryChange, priceRange, onPriceChange, maxPrice }) => {
    return (
        <div className="filter-sidebar">
            <div className="filter-section">
                <div className="filter-title">Kategoriler</div>
                {categories.length > 0 ? (
                    <Checkbox.Group
                        options={categories}
                        value={selectedCategories}
                        onChange={onCategoryChange}
                        style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                    />
                ) : (
                    <Text type="secondary">Kategori bulunamadı</Text>
                )}
            </div>

            <div className="filter-section">
                <div className="filter-title">Fiyat Aralığı</div>
                <Slider
                    range
                    min={50}
                    max={maxPrice || 1000}
                    value={priceRange}
                    onChange={onPriceChange}
                    trackStyle={[{ backgroundColor: '#f9b17a' }]}
                    handleStyle={[{ borderColor: '#2d2250', backgroundColor: '#2d2250' }, { borderColor: '#2d2250', backgroundColor: '#2d2250' }]}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                    <Text strong style={{ color: '#f9b17a' }}>${priceRange[0]}</Text>
                    <Text strong style={{ color: '#f9b17a' }}>${priceRange[1]}</Text>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
