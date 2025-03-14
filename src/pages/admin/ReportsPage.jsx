import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout'; // Adjust path if needed
import {
    Typography,
    Tabs,
    Select,
    DatePicker,
    Button,
    Spin,
    Alert,
    Space,
    Form, // Correct import for Form
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs; // No longer directly used, but keep import for potential reference or if you revert
const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportsPage = () => {
    const [reportType, setActiveTabKey] = useState('general'); // Corrected state setter name
    const [dateRange, setDateRange] = useState(null); // [dayjs, dayjs]
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [outputFormat, setOutputFormat] = useState('csv'); // 'csv' or 'pdf'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [campaignOptions, setCampaignOptions] = useState([]); // For Campaign Select Dropdown

    // Placeholder for report data - you might want to display a table or chart based on the report
    const [reportData, setReportData] = useState(null);

    // Fetch campaigns for Campaign-Specific Report dropdown (Placeholder - replace with your API endpoint)
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                // Replace 'http://localhost:5000/api/admin/campaigns-list' with your actual API endpoint to fetch campaign list for reports
                const response = await fetch('http://localhost:5000/api/admin/campaigns-list');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCampaignOptions(data.map(campaign => ({ value: campaign.id, label: campaign.title }))); // Adjust value and label based on your API response
            } catch (e) {
                setError(e.message); // Or handle error more gracefully
            }
        };

        fetchCampaigns();
    }, []);


    const handleGenerateReport = async () => {
        setLoading(true);
        setError(null);
        setReportData(null); // Clear previous report data

        let apiUrl = '';
        let reportParams = {};

        if (reportType === 'general') {
            apiUrl = 'http://localhost:5000/api/admin/reports/general-contributions'; // Replace with your actual API endpoint
            reportParams = {
                startDate: dateRange ? dateRange[0].format('YYYY-MM-DD') : null,
                endDate: dateRange ? dateRange[1].format('YYYY-MM-DD') : null,
                format: outputFormat,
            };
        } else if (reportType === 'campaign') {
            apiUrl = 'http://localhost:5000/api/admin/reports/campaign-specific'; // Replace with your actual API endpoint
            reportParams = {
                campaignId: selectedCampaign,
                startDate: dateRange ? dateRange[0].format('YYYY-MM-DD') : null,
                endDate: dateRange ? dateRange[1].format('YYYY-MM-DD') : null,
                format: outputFormat,
                reportType: 'financial_summary', // Example report type - adjust as needed
            };
        }

        try {
            const queryString = new URLSearchParams(reportParams).toString();
            const fullApiUrl = `${apiUrl}?${queryString}`;
            const response = await fetch(fullApiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.blob(); // Expecting blob for download (CSV, PDF) or adjust based on your API response
            setReportData(data); // Store blob data for download

            // Trigger download immediately after successful fetch
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.download = `report_${reportType}_${new Date().toISOString()}.${outputFormat}`; // Filename for download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);


        } catch (e) {
            setError(e.message);
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
                    onChange={(key) => setActiveTabKey(key)} // Corrected onChange handler
                    centered
                    items={[ // Using items prop for Tabs
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
                                            <Select defaultValue="csv" style={{ width: 120 }} onChange={setOutputFormat}>
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
                                                onChange={setSelectedCampaign}
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
                                                {/* <Option value="contributor_list">Contributor List</Option>  - Add if you want different report types */}
                                            </Select>
                                        </Form.Item>


                                        <Form.Item label="Output Format">
                                            <Select defaultValue="csv" style={{ width: 120 }} onChange={setOutputFormat}>
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
                                                disabled={!selectedCampaign} // Disable if no campaign selected
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
                    <Spin tip="Error Generating Report..." spinning={loading}> {/* Nested Spin for tip warning */}
                        <Alert message={`Report generation error: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginTop: 24 }} />
                    </Spin>
                )}
                {!error && loading && (
                    <Spin tip="Generating Report..." style={{ display: 'block', marginTop: 24 }}> {/* Corrected Spin Usage */}
                        <div /> {/* Empty div for nested Spin */}
                    </Spin>
                )}


                {/* Placeholder for displaying report data if you want to show a preview in the browser
                {reportData && (
                    <div style={{ marginTop: 32, border: '1px solid #d9d9d9', padding: 16, borderRadius: 8 }}>
                        <Title level={4} style={{ color: 'maroon' }}>Report Preview (Basic)</Title>
                        <Paragraph>Displaying basic preview here - for CSV/PDF, download is more suitable.</Paragraph>
                         {/*  Component to display report data - Table, Chart, etc. - based on reportData  }
                    </div>
                )}
                */}


            </div>
        </AdminLayout>
    );
};

export default ReportsPage;