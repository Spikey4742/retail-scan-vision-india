
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.retailscanindia',
  appName: 'retail-scan-vision-india',
  webDir: 'dist',
  server: {
    url: 'https://30ef66ec-4a9e-41cb-8dbf-87c1022e0467.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissionText: "Enable camera access to scan grocery items."
    }
  }
};

export default config;
