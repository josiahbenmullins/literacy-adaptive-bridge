import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.josiahbenmullins.gntreader',
  appName: 'GNT LAB',
  webDir: 'out',

  ios: {
    contentInset: 'never'
  },

  plugins: {
    StatusBar: {
      overlaysWebView: true,
      style: 'DEFAULT'
    }
  }
};

export default config;