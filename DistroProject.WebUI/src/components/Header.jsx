import React from 'react';
import { Layout, Typography, Flex, Button, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined, SearchOutlined, DashboardOutlined, CarOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import logo from '../assets/with-back.png';
import { useAuth } from '../context/AuthContext';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

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
            <Flex align="center" gap="small" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                <img src={logo} alt="Albatros Logo" style={{ height: '40px', width: '40px', borderRadius: '50%' }} />
                <Title level={3} style={{ margin: 0, color: '#fff', lineHeight: '1' }}>
                    ALBATROS
                </Title>
            </Flex>

            {/* Center: Navigation and Cart */}
            <Flex align="center" gap="large">
                <Button type="link" onClick={() => navigate('/')} style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Anasayfa</Button>
                <Button type="link" onClick={() => navigate('/products')} style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Ürünler</Button>
                <Button type="link" onClick={() => navigate('/products')} style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Kategoriler</Button>
                <Button type="link" style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Hakkımızda</Button>

                {/* Role Based Links */}
                {isAuthenticated && user?.role === 'Admin' && (
                    <Button
                        type="link"
                        icon={<DashboardOutlined />}
                        onClick={() => navigate('/admin/orders')}
                        style={{ color: '#f9b17a', textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontWeight: 'bold' }}
                    >
                        Admin Paneli
                    </Button>
                )}

                {isAuthenticated && user?.role === 'Driver' && (
                    <Button
                        type="link"
                        icon={<CarOutlined />}
                        // onClick={() => navigate('/driver')} // Placeholder
                        style={{ color: '#f9b17a', textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontWeight: 'bold' }}
                    >
                        Şoför Paneli
                    </Button>
                )}

                {isAuthenticated ? (
                    <Button
                        type="link"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                    >
                        Çıkış Yap
                    </Button>
                ) : (
                    <Button
                        type="link"
                        icon={<LoginOutlined />}
                        onClick={() => navigate('/login')}
                        style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                    >
                        Giriş Yap / Kayıt Ol
                    </Button>
                )}

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
