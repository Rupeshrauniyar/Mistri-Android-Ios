import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mistri.app',
  appName: 'Mistri',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    App: {
      appUrlOpen: {
        schemes: ['mistri']
      }
    }
  }
};

export default config; 