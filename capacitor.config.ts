import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rimes.tnsmartadmin',
  appName: 'TN-ADMIN',
  webDir: 'www',
  server: {
    androidScheme: 'http',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      splashFullScreen: true,
      splashImmersive: true,
      showSpinner: true,
    },

    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    android: {
      useLegacyBridge: true,
    },
  },
};

export default config;
