
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { tensorflowHelper } from '@/utils/tensorflowHelper';

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Start loading the model when the app opens
    const preloadModel = async () => {
      try {
        await tensorflowHelper.loadModel();
      } catch (error) {
        console.error('Failed to preload model:', error);
      }
    };
    
    preloadModel();
  }, []);

  const handleScanClick = async () => {
    setIsLoading(true);
    try {
      const modelLoaded = await tensorflowHelper.loadModel();
      if (!modelLoaded) {
        toast.error("Failed to load recognition model. Please try again.");
        return;
      }
      navigate('/camera');
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-retailVision-light">
      <Header title="Retail Vision" />
      
      <main className="flex-1 p-6 flex flex-col justify-center items-center">
        <div className="mb-8 text-center">
          <div className="w-32 h-32 mb-6 mx-auto bg-retailVision-primary rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan-line">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
              <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
              <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
              <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
              <line x1="7" x2="17" y1="12" y2="12"/>
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-retailVision-dark mb-3">Welcome to Retail Vision</h2>
          <p className="text-gray-600 max-w-xs mx-auto">
            Quickly identify grocery items and check prices with your camera.
          </p>
        </div>

        <div className="w-full max-w-xs">
          <Button 
            onClick={handleScanClick} 
            disabled={isLoading}
            className="w-full mb-4 h-14 text-lg"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
            }
          >
            {isLoading ? "Loading..." : "Start Scanning"}
          </Button>
          
          <p className="text-center text-sm text-gray-500">
            Point your camera at any grocery item to identify it and check its price.
          </p>
        </div>
      </main>
      
      <footer className="p-4 bg-white border-t border-gray-200">
        <p className="text-center text-gray-500 text-sm">
          Retail Vision - powered by TensorFlow Lite
        </p>
      </footer>
    </div>
  );
};

export default Home;
