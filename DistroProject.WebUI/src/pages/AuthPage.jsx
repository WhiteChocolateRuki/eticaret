import { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';
import bgImage from '../assets/arkaplan.jpg';
import overlayBg from '../assets/login.png';

const { Title } = Typography;

const AuthPage = () => {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Determine initial mode based on URL
    useEffect(() => {
        if (location.pathname === '/register') {
            setIsRightPanelActive(true);
        } else {
            setIsRightPanelActive(false);
        }
    }, [location.pathname]);

    // --- Login Logic ---
    const onLoginFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (login(data.token)) {
                    message.success('Login successful!');
                    const payload = JSON.parse(atob(data.token.split('.')[1]));
                    if (payload.role === 'Admin') {
                        navigate('/admin/orders');
                    } else if (payload.role === 'Driver') {
                        navigate('/'); // Placeholder
                    } else {
                        navigate('/');
                    }
                } else {
                    message.error('Login failed, invalid token.');
                }
            } else {
                message.error('Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    // --- Register Logic ---
    const onRegisterFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    password: values.password,
                }),
            });

            if (response.ok) {
                message.success('Registration successful! Please login.');
                setIsRightPanelActive(false); // Slide back to login
                navigate('/login');
            } else {
                const data = await response.json();
                message.error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            message.error('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUpClick = () => {
        setIsRightPanelActive(true);
        navigate('/register');
    };

    const handleSignInClick = () => {
        setIsRightPanelActive(false);
        navigate('/login');
    };

    return (
        <div className="auth-body" style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">

                {/* Sign Up Form (Register) */}
                <div className="auth-form-container sign-up-container">
                    <div className="auth-form">
                        <Title level={2} className="auth-title">Create Account</Title>
                        <Form
                            name="register_form"
                            onFinish={onRegisterFinish}
                            layout="vertical"
                            style={{ width: '100%' }}
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Username is required!' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Username" />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Email is required!' }, { type: 'email', message: 'Enter a valid email!' }]}
                            >
                                <Input prefix={<MailOutlined />} placeholder="Email" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Password is required!' }]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                            </Form.Item>
                            <Button className="auth-btn" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                                Sign Up
                            </Button>
                        </Form>
                    </div>
                </div>

                {/* Sign In Form (Login) */}
                <div className="auth-form-container sign-in-container">
                    <div className="auth-form">
                        <Title level={2} className="auth-title">Sign in</Title>
                        <Form
                            name="login_form"
                            onFinish={onLoginFinish}
                            layout="vertical"
                            style={{ width: '100%' }}
                        >
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Email is required!' }, { type: 'email', message: 'Enter a valid email!' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Email" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Password is required!' }]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                            </Form.Item>
                            <Button className="auth-btn" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                                Sign In
                            </Button>
                        </Form>
                    </div>
                </div>

                {/* Overlay Container (Sliding Panel) */}
                <div className="overlay-container">
                    <div className="overlay" style={{
                        backgroundImage: `url(${overlayBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}>
                        {/* Overlay: Left Panel (Visible when showing Register form) */}
                        <div className="overlay-panel overlay-left">
                            <Title level={2} style={{ color: '#ffffff' }}>Welcome Back!</Title>
                            <p style={{ color: '#ffffff', fontSize: '14px', margin: '20px 0 30px' }}>
                                To keep connected with us <br />
                                please login with your personal info
                            </p>
                            <button className="auth-btn ghost" id="signIn" onClick={handleSignInClick}>Sign In</button>
                        </div>

                        {/* Overlay: Right Panel (Visible when showing Login form) */}
                        <div className="overlay-panel overlay-right">
                            <Title level={2} style={{ color: '#ffffff' }}>Hello, Friend!</Title>
                            <p style={{ color: '#ffffff', fontSize: '14px', margin: '20px 0 30px' }}>
                                Enter your personal details <br />
                                and start journey with us
                            </p>
                            <button className="auth-btn ghost" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
