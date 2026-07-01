import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import { RollbackOutlined } from '@ant-design/icons';
import PublicLayout from '../components/PublicLayout';

const NotFoundPage = () => {
    return (
        <PublicLayout>
            <div className="flex-1 flex justify-center items-center px-6 py-12">
                <div className="max-w-xl w-full bg-white rounded-3xl border border-zinc-200 shadow-lg p-8 md:p-12 text-center">
                    <Result
                        status="404"
                        title={<span className="text-5xl font-extrabold text-[#800000]">404</span>}
                        subTitle={<span className="text-lg text-zinc-600">Sorry, the page you visited does not exist.</span>}
                        extra={
                            <Link to="/">
                                <Button 
                                    type="primary" 
                                    size="large"
                                    icon={<RollbackOutlined />}
                                    className="bg-[#800000] hover:bg-[#600000] border-none rounded-full h-12 px-8 font-bold shadow-md shadow-[#800000]/20"
                                >
                                    Back to Home
                                </Button>
                            </Link>
                        }
                    />
                    
                    <div className="mt-8 pt-8 border-t border-zinc-100 text-left">
                        <h3 className="text-xl font-bold text-zinc-800 mb-2">What happened?</h3>
                        <p className="text-zinc-500 mb-2">
                            It seems like you've followed a broken link or entered an incorrect URL.
                            Don't worry, it happens to the best of us!
                        </p>
                        <p className="text-zinc-500">
                            Use the button above to return to the homepage and navigate from there.
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default NotFoundPage;