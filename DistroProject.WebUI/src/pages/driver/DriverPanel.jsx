import { Card, Typography } from 'antd';
import { useAuth } from '../../context/AuthContext';

const { Title, Paragraph } = Typography;

const DriverPanel = () => {
    // We can get user info safely because this route will be protected
    // But for now, let's just show a welcome message.
    // If we stored user name in context/localstorage, we could display it.

    return (
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 600, textAlign: 'center' }}>
                <Title level={2}>Sürücü Paneline Hoşgeldiniz</Title>
                <Paragraph>
                    Buradan size atanan teslimatları görüntüleyebilir ve durumlarını güncelleyebilirsiniz.
                </Paragraph>
                <Paragraph>
                    (Teslimat özellikleri yakında eklenecek...)
                </Paragraph>
            </Card>
        </div>
    );
};

export default DriverPanel;
