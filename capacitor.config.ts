import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'int_.rimes.tnsmart_admin',
  appName: 'tnalert_7_admin',
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
