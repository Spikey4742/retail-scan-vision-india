
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import CameraView from './CameraView';
import ResultScreen from './ResultScreen';

const Index = () => {
  return (
    <div className="min-h-screen bg-retailVision-light">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/camera" element={<CameraView />} />
        <Route path="/result" element={<ResultScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default Index;
