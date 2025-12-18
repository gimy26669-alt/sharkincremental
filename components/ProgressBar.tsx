import React from 'react';

const ProgressBar: React.FC = () => {
  return (
    <div className="fixed bottom-0 w-full bg-gray-900 border-t-2 border-black z-50">
        <div className="relative w-full h-8 bg-gray-800">
             {/* Progress Fill */}
            <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-700 to-green-500 transition-all duration-500"
                style={{ width: '64.95%' }}
            ></div>
            
            {/* Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm drop-shadow-md tracking-wider">
                Fill 6 particle accelerators (64.95%)
            </div>
        </div>
    </div>
  );
};

export default ProgressBar;