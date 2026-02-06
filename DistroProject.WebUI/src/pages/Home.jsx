import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import depthSensor from '../assets/non-back.png'; // Using existing asset as placeholder

const { Title, Paragraph } = Typography;

const categories = [
    {
        id: 1,
        title: 'Sensors',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        image: depthSensor,
        // Light -> Dark
        gradient: 'linear-gradient(135deg, #8ba8cc 0%, #050b14 100%)'
    },
    {
        id: 2,
        title: 'Mechanical',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        image: depthSensor,
        // Dark -> Light
        gradient: 'linear-gradient(135deg, #050b14 0%, #8ba8cc 100%)'
    },
    {
        id: 3,
        title: 'Electronics',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        image: depthSensor,
        // Light -> Dark
        gradient: 'linear-gradient(135deg, #8ba8cc 0%, #050b14 100%)'
    }
];

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
            {categories.map((category) => {
                const isEven = category.id % 2 === 0;
                return (
                    <div
                        key={category.id}
                        className="category-card"
                        onClick={() => navigate('/products')}
                        style={{
                            background: category.gradient,
                        }}
                    >
                        <div
                            className="card-content"
                            style={{
                                flexDirection: isEven ? 'row-reverse' : 'row',
                                textAlign: isEven ? 'right' : 'left'
                            }}
                        >
                            <div
                                className="text-section"
                                style={{
                                    paddingRight: isEven ? 0 : '20px',
                                    paddingLeft: isEven ? '20px' : 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: isEven ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <Title level={4} style={{ color: '#f9b17a', marginBottom: '10px' }}>
                                    {category.title}
                                </Title>
                                <Paragraph style={{ color: '#e0e0e0', fontSize: '14px', maxWidth: '300px' }}>
                                    {category.description}
                                </Paragraph>
                            </div>
                            <div className="image-section">
                                <img src={category.image} alt={category.title} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Home;
