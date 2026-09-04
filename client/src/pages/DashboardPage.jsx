import React from 'react';
import DashboardMain from '../components/Dashboard/DashboardMain';

const DashboardPage = () => {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-dark-100">Dashboard</h1>
                <p className="text-dark-200 text-sm mt-1">
                    Your progress overview at a glance
                </p>
            </div>
            <DashboardMain />
        </div>
    );
};

export default DashboardPage;