import React, { useState, useEffect } from 'react';
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
    message,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { API_URL } from '../../services/api';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportsPage = () => {
    const [reportType, setActiveTabKey] = useState('general');
    const [dateRange, setDateRange] = useState(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [outputFormat, setOutputFormat] = useState('csv');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [campaignOptions, setCampaignOptions] = useState([]);

    // Function to get authentication headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    // Fetch campaigns for the Campaign-Specific Report dropdown
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await fetch(`${API_URL}/admin/campaigns-list`, {
                    headers: getAuthHeaders()
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Map campaigns to options with value and label
                setCampaignOptions(data.map(campaign => ({ value: campaign._id, label: campaign.title })));
            } catch (e) {
                setError(e.message);
            }
        };

        fetchCampaigns();
    }, []);

    // Function to handle report generation
    const handleGenerateReport = async () => {
        setLoading(true);
        setError(null);

        let apiUrl = '';
        let reportParams = {};

        if (reportType === 'general') {
            apiUrl = `${API_URL}/admin/reports/general-contributions`;
            reportParams = {
                startDate: dateRange ? dateRange[0].format('YYYY-MM-DD') : null,
                endDate: dateRange ? dateRange[1].format('YYYY-MM-DD') : null,
                format: outputFormat,
            };
        } else if (reportType === 'campaign') {
            apiUrl = `${API_URL}/admin/reports/campaign-specific`;
            reportParams = {
                campaignId: selectedCampaign,
                startDate: dateRange ? dateRange[0].format('YYYY-MM-DD') : null,
                endDate: dateRange ? dateRange[1].format('YYYY-MM-DD') : null,
                format: outputFormat,
                reportType: 'financial_summary',
            };
        }

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
            link.download = `report_${reportType}_${new Date().toISOString()}.${outputFormat}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            message.success('Report generated successfully!');
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
                        Generate and download reports on system contributions and campaign performance.
                    </Paragraph>
                </div>

                <Tabs
                    activeKey={reportType}
                    onChange={(key) => setActiveTabKey(key)}
                    centered
                    items={[
                        {
                            key: 'general',
                            label: 'General Contribution Report',
                            children: (
                                <>
                                    <Paragraph>Generate a report on overall contributions made to the system over a selected period.</Paragraph>

                                    <Form layout="vertical">
                                        <Form.Item label="Date Range">
                                            <RangePicker onChange={(dates) => setDateRange(dates)} />
                                        </Form.Item>

                                        <Form.Item label="Output Format">
                                            <Select
                                                defaultValue="csv"
                                                style={{ width: 120 }}
                                                onChange={(value) => setOutputFormat(value)}
                                            >
                                                <Option value="csv">CSV</Option>
                                                <Option value="pdf">PDF</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                onClick={handleGenerateReport}
                                                loading={loading}
                                                icon={<DownloadOutlined />}
                                                style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}
                                            >
                                                Generate Report
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </>
                            ),
                        },
                        {
                            key: 'campaign',
                            label: 'Campaign-Specific Report',
                            children: (
                                <>
                                    <Paragraph>Generate a detailed report for a specific campaign, including financial summary and contributor list.</Paragraph>

                                    <Form layout="vertical">
                                        <Form.Item label="Select Campaign">
                                            <Select
                                                placeholder="Select a campaign"
                                                value={selectedCampaign} // Controlled value
                                                onChange={(value) => setSelectedCampaign(value)} // Update selectedCampaign
                                                options={campaignOptions}
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                showSearch
                                            />
                                        </Form.Item>

                                        <Form.Item label="Date Range (for contributions within the campaign)">
                                            <RangePicker onChange={(dates) => setDateRange(dates)} />
                                        </Form.Item>

                                        <Form.Item label="Report Type">
                                            <Select defaultValue="financial_summary" style={{ width: 200 }} disabled>
                                                <Option value="financial_summary">Financial Summary</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item label="Output Format">
                                            <Select
                                                defaultValue="csv"
                                                style={{ width: 120 }}
                                                onChange={(value) => setOutputFormat(value)}
                                            >
                                                <Option value="csv">CSV</Option>
                                                <Option value="pdf">PDF</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                onClick={handleGenerateReport}
                                                loading={loading}
                                                icon={<DownloadOutlined />}
                                                disabled={!selectedCampaign}
                                                style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}
                                            >
                                                Generate Report
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </>
                            ),
                        },
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