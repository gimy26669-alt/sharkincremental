import React from 'react';
import { formatNumber } from '../utils';

interface MainHeaderProps {
    fish: number;
    income: number;
}

const MainHeader: React.FC<MainHeaderProps> = ({ fish, income }) => {
    return (
        <div className="text-center py-6">
            <div className="text-shark-text text-lg font-medium">
                Your <span className="text-red-800 font-bold">Shark</span> has eaten{' '}
                <span className="text-4xl font-bold text-shark-orange drop-shadow-sm font-mono mx-1">
                    {formatNumber(fish)}
                </span>{' '}
                <span className="text-yellow-600">☢</span>
                <span className="text-sm text-gray-700 ml-2">
                    (+{formatNumber(income)}/s)
                </span>{' '}
                fish.
            </div>
        </div>
    );
};

export default MainHeader;