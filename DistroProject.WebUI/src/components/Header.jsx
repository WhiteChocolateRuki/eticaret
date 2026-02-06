import React from 'react';
import { Layout, Typography, Flex, Button, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import logo from '../assets/with-back.png';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = () => {
    const navigate = useNavigate();
    return (
        <AntHeader style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'transparent', // Transparent to show the inner background
            padding: '0 24px',
            marginBottom: '24px',
            // boxShadow: '0 2px 8px rgba(0,0,0,0.15)' // Removed shadow for cleaner look
        }}>
            {/* Left: Logo and Brand */}
            <Flex align="center" gap="small">
                <img src={logo} alt="Albatros Logo" style={{ height: '40px', width: '40px', borderRadius: '50%' }} />
                <Title level={3} style={{ margin: 0, color: '#fff', lineHeight: '1' }}>
                    ALBATROS
                </Title>
            </Flex>

            {/* Center: Navigation and Cart */}
            <Flex align="center" gap="large">
                <Button type="link" onClick={() => navigate('/')} style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Anasayfa</Button>
                <Button type="link" onClick={() => navigate('/products')} style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Ürünler</Button>
                {/* User asked for Categories to also go to Products for now, or maybe they meant the same link */}
                <Button type="link" onClick={() => navigate('/products')} style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Kategoriler</Button>
                <Button type="link" style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Hakkımızda</Button>
                <Button type="text" icon={<ShoppingCartOutlined style={{ fontSize: '20px', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }} />} />
            </Flex>

            <div style={{ paddingLeft: '20px' }}>
                <Input
                    placeholder="Ara..."
                    className="custom-search-input"
                    suffix={<SearchOutlined style={{ color: '#ffffff' }} />}
                    style={{
                        width: 200, // Increased width
                        borderRadius: '20px',
                        backgroundColor: 'transparent',
                        borderColor: '#ffffff',
                        color: '#ffffff',
                        fontSize: '14px', // Slightly larger text
                        padding: '6px 12px' // More internal breathing room
                    }}
                // Removed size="small" for more height/padding
                />
            </div>
        </AntHeader>
    );
};

export default Header;
