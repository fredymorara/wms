import React, { useState } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import {
    Typography,
    Tabs,
    Select,
    DatePicker,
    Button,
    Spin,
    Alert,
    Form,
    Row,
    Col,
    Card,
    message,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { API_URL } from '../../services/api';

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportsPage = () => {
    const [dateRange, setDateRange] = useState(null);
    const [outputFormat, setOutputFormat] = useState('csv');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to get authentication headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    // Function to handle report generation
    const handleGenerateReport = async () => {
        setLoading(true);
        setError(null);

        const apiUrl = `${API_URL}/admin/reports/general-contributions`;
        const reportParams = {
            startDate: dateRange ? dateRange[0].format('YYYY-MM-DD') : null,
            endDate: dateRange ? dateRange[1].format('YYYY-MM-DD') : null,
            format: outputFormat,
        };

        try {
            const queryString = new URLSearchParams(reportParams).toString();
            const fullApiUrl = `${apiUrl}?${queryString}`;
            const response = await fetch(fullApiUrl, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.blob();
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.download = `general_contributions_report_${new Date().toISOString()}.${outputFormat}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            message.success('General Contribution Report generated successfully!');
        } catch (e) {
            setError(e.message);
            message.error(`Report generation error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div style={{ padding: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Title level={2} style={{ color: 'maroon' }}>
                        Reports
                    </Title>
                    <Paragraph>
                        Generate and download reports on system contributions.
                    </Paragraph>
                </div>

                <Tabs
                    defaultActiveKey="general"
                    centered
                    items={[
                        {
                            key: 'general',
                            label: 'General Contribution Report',
                            children: (
                                <Card>
                                    <Paragraph>Generate a report on overall contributions made to the system over a selected period.</Paragraph>

                                    <Form layout="vertical">
                                        <Row gutter={24}>
                                            <Col xs={24} sm={12}>
                                                <Form.Item label="Date Range (Optional)">
                                                    <RangePicker onChange={(dates) => setDateRange(dates)} style={{ width: '100%' }} />
                                                    <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>Leave blank for all contributions.</Text>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <Form.Item label="Output Format">
                                                    <Select
                                                        defaultValue="csv"
                                                        style={{ width: '100%' }}
                                                        onChange={(value) => setOutputFormat(value)}
                                                    >
                                                        <Option value="csv">CSV</Option>
                                                        <Option value="pdf">PDF</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Form.Item style={{ marginTop: 24 }}>
                                            <Button
                                                type="primary"
                                                onClick={handleGenerateReport}
                                                loading={loading}
                                                icon={<DownloadOutlined />}
                                                style={{ backgroundColor: '#b5e487', borderColor: 'maroon', color: 'black' }}
                                            >
                                                Generate Report
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            ),
                        }
                    ]}
                />

                {error && (
                    <Spin tip="Error Generating Report..." spinning={loading}>
                        <Alert message={`Report generation error: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginTop: 24 }} />
                    </Spin>
                )}
                {!error && loading && (
                    <Spin tip="Generating Report..." style={{ display: 'block', marginTop: 24 }}>
                        <div />
                    </Spin>
                )}
            </div>
        </AdminLayout>
    );
};

export default ReportsPage;
