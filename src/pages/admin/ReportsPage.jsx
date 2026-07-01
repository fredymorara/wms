import React, { useState } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import {
    Typography,
    Select,
    DatePicker,
    Button,
    Spin,
    Alert,
    Form,
    message,
} from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { API_URL } from '../../services/api';

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportsPage = () => {
    const [dateRange, setDateRange] = useState(null);
    const [outputFormat, setOutputFormat] = useState('csv');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

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
            message.success({ content: 'Report generated successfully!', className: 'rounded-xl font-medium' });
        } catch (e) {
            setError(e.message);
            message.error({ content: `Report generation error: ${e.message}`, className: 'rounded-xl font-medium' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12">
                <div className="text-center space-y-2 mb-10">
                    <Title level={2} className="!text-[#800000] !mb-0">Reports Generator</Title>
                    <Paragraph className="text-zinc-500 max-w-2xl mx-auto">
                        Generate and download detailed reports on system contributions and financial activities.
                    </Paragraph>
                </div>

                <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-[#800000]/10 flex items-center justify-center text-[#800000]">
                            <FileTextOutlined className="text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-800 m-0">General Contribution Report</h3>
                    </div>
                    <Paragraph className="text-zinc-500 mb-8">
                        Generate a report on overall contributions made to the system over a selected period.
                    </Paragraph>

                    <Form layout="vertical">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <Form.Item label={<span className="font-semibold text-zinc-700">Date Range (Optional)</span>}>
                                <RangePicker 
                                    onChange={(dates) => setDateRange(dates)} 
                                    className="w-full rounded-xl h-14 border-zinc-300 text-base"
                                />
                                <Text type="secondary" className="block mt-2 text-xs">Leave blank for all contributions.</Text>
                            </Form.Item>
                            
                            <Form.Item label={<span className="font-semibold text-zinc-700">Output Format</span>}>
                                <Select
                                    defaultValue="csv"
                                    className="w-full h-14 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:border-zinc-300 [&_.ant-select-selector]:items-center [&_.ant-select-selection-item]:text-base"
                                    onChange={(value) => setOutputFormat(value)}
                                >
                                    <Option value="csv">CSV Document (.csv)</Option>
                                    <Option value="pdf">PDF Document (.pdf)</Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <Form.Item className="mt-8 mb-0">
                            <Button
                                type="primary"
                                onClick={handleGenerateReport}
                                loading={loading}
                                icon={<DownloadOutlined />}
                                size="large"
                                className="w-full sm:w-auto bg-[#800000] hover:bg-[#600000] border-none font-bold h-14 px-10 text-base rounded-xl shadow-md shadow-[#800000]/20"
                            >
                                Generate Report
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

                {error && (
                    <Spin tip="Error Generating Report..." spinning={loading}>
                        <Alert message={`Report generation error: ${error}`} type="error" closable onClose={() => setError(null)} className="rounded-xl mt-6" />
                    </Spin>
                )}
                {!error && loading && (
                    <div className="flex justify-center mt-12">
                        <Spin tip="Processing Data and Generating Report..." size="large" />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ReportsPage;
