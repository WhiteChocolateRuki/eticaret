import React from 'react';
import { Layout, Typography, Flex, Button, Input } from 'antd';
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import logo from '../assets/with-back.png';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = () => {
    return (
        <AntHeader style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-bg-container)', // Using the card/panel color for header background
            padding: '0 24px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
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
                <Button type="link" style={{ color: '#fff' }}>Anasayfa</Button>
                <Button type="link" style={{ color: '#fff' }}>Ürünler</Button>
                <Button type="link" style={{ color: '#fff' }}>Hakkımızda</Button>
                <Button type="text" icon={<ShoppingCartOutlined style={{ fontSize: '20px', color: '#fff' }} />} />
            </Flex>

            <div style={{ paddingLeft: '20px' }}>
                <Input
                    placeholder="Ara..."
                    className="custom-search-input"
                    suffix={<SearchOutlined style={{ color: '#f9b17a' }} />}
                    style={{
                        width: 150,
                        borderRadius: '20px',
                        backgroundColor: 'transparent',
                        borderColor: '#f9b17a',
                        color: '#f9b17a',
                        fontSize: '12px'
                    }}
                    size="small"
                />
            </div>
        </AntHeader>
    );
};

export default Header;
