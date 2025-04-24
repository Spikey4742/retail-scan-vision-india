
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { tensorflowHelper } from '@/utils/tensorflowHelper';
import { RecognitionResult } from '@/types';

const CameraView = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  const handleCapture = async () => {
    setIsAnalyzing(true);
    
    try {
      // In a real app, this would capture an actual image and save its URI
      // For our mock app, we'll simulate getting the recognition result
      const imageUri = "mock-image-uri";
      
      // Simulate camera shutter effect
      setCameraActive(false);
      setTimeout(() => setCameraActive(true), 150);
      
      // Process the image with TensorFlow
      const { item, confidence } = await tensorflowHelper.recognizeImage(imageUri);
      
      const result: RecognitionResult = {
        item,
        confidence,
        success: true
      };
      
      // Navigate to result screen with the data
      navigate('/result', { state: { result } });
      
    } catch (error) {
      toast.error("Failed to analyze image. Please try again.");
      console.error(error);
      setIsAnalyzing(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header title="Scan Item" showBackButton onBack={handleBack} />
      
      <main className="flex-1 flex flex-col">
        {/* Camera Viewfinder */}
        <div className="flex-1 relative">
          <div className={`absolute inset-0 bg-retailVision-light ${cameraActive ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
            {/* Camera flash effect */}
          </div>
          
          {/* This would be a real camera view in a native app */}
          <div className="h-full flex items-center justify-center bg-gray-900">
            <div className="relative">
              <img 
                src="/placeholder.svg" 
                alt="Camera Feed" 
                className="min-h-[300px] w-full object-cover opacity-60"
              />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-retailVision-secondary rounded-lg flex items-center justify-center">
                  <div className={`w-full ${isAnalyzing ? 'h-1 animate-pulse-light bg-retailVision-secondary' : ''}`} />
                </div>
              </div>
              
              {/* Instruction text */}
              <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black bg-opacity-50 py-2">
                Position item in the frame
              </div>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="p-6 bg-black flex flex-col gap-4 items-center">
          <Button 
            onClick={handleCapture}
            disabled={isAnalyzing}
            className="w-16 h-16 rounded-full"
          >
            {isAnalyzing ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
            )}
          </Button>
          <p className="text-white text-sm">
            {isAnalyzing ? "Analyzing..." : "Tap to capture"}
          </p>
        </div>
      </main>
    </div>
  );
};

export default CameraView;
