
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { RecognitionResult } from '@/types';

const ResultScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { result } = location.state as { result: RecognitionResult };

  const handleScanAgain = () => {
    navigate('/camera');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(1)}%`;
  };

  if (!result || !result.item) {
    return (
      <div className="min-h-screen flex flex-col bg-retailVision-light">
        <Header title="Item Not Found" showBackButton onBack={handleGoHome} />
        
        <main className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-x">
                <path d="M14.5 14.5 L19 19"/>
                <path d="m16 16-4-4"/>
                <circle cx="10" cy="10" r="7"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-retailVision-dark">Item Not Recognized</h2>
            <p className="text-gray-600 mt-2">We couldn't identify the item. Please try again.</p>
          </div>
          
          <div className="w-full max-w-xs">
            <Button 
              onClick={handleScanAgain} 
              className="w-full mb-3"
            >
              Try Again
            </Button>
            <Button 
              onClick={handleGoHome} 
              type="outline"
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-retailVision-light">
      <Header title="Item Details" showBackButton onBack={handleGoHome} />
      
      <main className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-retailVision-primary p-1" />
          
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mr-4 overflow-hidden">
                <img src={result.item.image || "/placeholder.svg"} alt={result.item.name} className="w-full h-full object-cover" />
              </div>
              
              <div>
                <span className="text-sm text-gray-500">{result.item.category}</span>
                <h2 className="text-2xl font-bold text-retailVision-dark">{result.item.name}</h2>
                <div className="flex items-center mt-1">
                  <span className="bg-retailVision-light text-retailVision-primary text-xs px-2 py-1 rounded-full">
                    Match: {formatConfidence(result.confidence)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Price</span>
                <span className="text-2xl font-bold text-retailVision-primary">{formatPrice(result.item.price)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Details</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-500">Product ID</span>
              <span className="font-medium">{result.item.id}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-500">Category</span>
              <span className="font-medium">{result.item.category}</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleScanAgain} 
            className="w-full"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
              </svg>
            }
          >
            Scan Another Item
          </Button>
          <Button 
            onClick={handleGoHome} 
            type="outline"
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ResultScreen;
