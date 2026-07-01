import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import {
    CloudUploadOutlined,
    LockOutlined,
    LineChartOutlined,
    UserOutlined,
    HeartFilled,
} from '@ant-design/icons';
import PublicLayout from '../components/PublicLayout';

const LandingPage = () => {
    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="pt-16 pb-16 md:pt-24 md:pb-32 px-6">
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
                    <h1 className="text-5xl md:text-7xl md:text-[5rem] font-extrabold text-zinc-900 leading-[1.1] tracking-tight">
                        Support. <span className="text-[#800000]">Connect.</span> Thrive.
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-600 max-w-2xl leading-relaxed">
                        A student-run platform dedicated to fostering a supportive community, providing transparent financial assistance, and promoting student well-being when it matters most.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 w-full sm:w-auto">
                        <Link to="/signup">
                            <Button type="primary" size="large" className="bg-[#800000] hover:bg-[#600000] border-none h-12 px-10 rounded-full text-white font-medium shadow-md shadow-[#800000]/20 w-full sm:w-auto text-lg">
                                Start Contributing
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button size="large" className="h-12 px-10 rounded-full border-zinc-300 text-zinc-700 hover:text-[#800000] hover:border-[#800000] w-full sm:w-auto font-medium text-lg">
                                View Campaigns
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Impact / Metrics Section */}
            <section className="py-16 bg-white border-y border-zinc-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-zinc-100">
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-[#800000]">100%</div>
                            <div className="text-zinc-500 font-medium">Transparent</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-[#800000]">500+</div>
                            <div className="text-zinc-500 font-medium">Students Helped</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-[#800000]">24/7</div>
                            <div className="text-zinc-500 font-medium">Support Access</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-[#800000]">Fast</div>
                            <div className="text-zinc-500 font-medium">M-Pesa Integration</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bento Grid Features */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight">Everything you need to support the community</h2>
                    <p className="text-zinc-500 text-lg">We've built a platform that makes giving and receiving help as frictionless as possible.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Large feature card */}
                    <div className="md:col-span-2 bg-[#800000] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden group">
                        <div className="relative z-10 max-w-md">
                            <LineChartOutlined className="text-4xl text-[#b5e487] mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Transparent Reporting</h3>
                            <p className="text-white/80 leading-relaxed text-lg">
                                Track campaign progress in real-time. See exactly how your contributions are being utilized with detailed fund allocation reports and disbursement histories.
                            </p>
                        </div>
                        {/* Decorative circle */}
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full transition-transform group-hover:scale-110 duration-700"></div>
                    </div>

                    {/* Small feature card 1 */}
                    <div className="bg-white border border-zinc-200 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300">
                        <CloudUploadOutlined className="text-4xl text-[#800000] mb-6" />
                        <h3 className="text-xl font-bold text-zinc-900 mb-3">Easy Contributions</h3>
                        <p className="text-zinc-500">
                            Donate to active campaigns quickly and securely using our seamless M-Pesa integration.
                        </p>
                    </div>

                    {/* Small feature card 2 */}
                    <div className="bg-[#b5e487]/20 border border-[#b5e487]/30 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300">
                        <LockOutlined className="text-4xl text-[#800000] mb-6" />
                        <h3 className="text-xl font-bold text-zinc-900 mb-3">Secure Transactions</h3>
                        <p className="text-zinc-700">
                            Your financial information is protected with enterprise-grade robust security measures.
                        </p>
                    </div>

                    {/* Small feature card 3 */}
                    <div className="md:col-span-2 bg-white border border-zinc-200 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex-1">
                            <UserOutlined className="text-4xl text-[#800000] mb-6" />
                            <h3 className="text-2xl font-bold text-zinc-900 mb-4">Dedicated Support</h3>
                            <p className="text-zinc-500 text-lg">
                                Our administrative team is always ready to assist students in need. Submit a campaign request easily and get guidance throughout the approval process.
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-full bg-zinc-50 flex items-center justify-center border-8 border-white shadow-xl">
                                <HeartFilled className="text-4xl text-[#800000]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto bg-zinc-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl mb-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#800000]/40 to-transparent opacity-50"></div>
                    <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Make a Difference Today</h2>
                        <p className="text-lg text-zinc-300">
                            Join our community and support fellow students in need. Every single contribution builds a stronger, thriving environment for all.
                        </p>
                        <Link to="/signup" className="inline-block">
                            <Button type="primary" size="large" className="bg-[#b5e487] text-[#800000] hover:bg-white border-none h-14 px-10 rounded-full font-bold text-lg shadow-lg hover:-translate-y-1 transition-transform duration-300">
                                Join the Community
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};

export default LandingPage;
