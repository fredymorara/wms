import React from 'react';
import { Result, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { RollbackOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const NotFoundPage = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            style={{
                padding: '48px 0',
                textAlign: 'center',
            }}
            extra={[
                <Link to="/">
                    <Button type="primary" style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }} icon={<RollbackOutlined />}>
                        Back to Home
                    </Button>
                </Link>,
                // You could add other helpful links here, e.g., Contact Support, Site Map, etc.
            ]}
        >
            <div className="desc" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 24 }}>
                <Title level={3} style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                    What happened?
                </Title>
                <Paragraph style={{ maxWidth: '450px', color: 'rgba(0, 0, 0, 0.5)' }}>
                    It seems like you've followed a broken link or entered an incorrect URL.
                    Don't worry, it happens to the best of us!
                </Paragraph>
                <Paragraph style={{ maxWidth: '450px', color: 'rgba(0, 0, 0, 0.5)' }}>
                    Use the button below to return to the homepage and navigate from there.
                </Paragraph>
            </div>
        </Result>
    );
};

export default NotFoundPage;