import { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import bgImage from '../assets/arkaplan.jpg';
import cardBg from '../assets/login.png';

const { Title } = Typography;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    password: values.password,
                }),
            });

            if (response.ok) {
                message.success('Registration successful! Please login.');
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

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <Card style={{
                width: 400,
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                backgroundImage: `url(${cardBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.9)' // Fallback / Blend
            }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={2} style={{ color: '#2d2250' }}>Register</Title>
                    <p style={{ color: '#555' }}>Create your account to get started.</p>
                </div>
                <Form
                    name="register_form"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading} style={{ backgroundColor: '#f9b17a', borderColor: '#f9b17a', color: '#2d2250', fontWeight: 'bold' }}>
                            Register
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        Already have an account? <Link to="/login" style={{ color: '#2d2250', fontWeight: 'bold' }}>Login here</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;
