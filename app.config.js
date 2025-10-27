export default {
  expo: {
    name: "fatto-a-mano-mobile",
    slug: "fatto-a-mano-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/notification-icon.jpeg",
    scheme: "fattoamanomobile",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./src/assets/images/notification-icon.jpeg",
        backgroundImage: "./src/assets/images/notification-icon.jpeg",
        monochromeImage: "./src/assets/images/notification-icon.jpeg",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: ["ACCESS_FINE_LOCATION"],
      package: "com.zakkiislami.fattoamanomobile",
      googleServicesFile: "./google-services.json",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      output: "static",
      favicon: "./src/assets/images/favicon.png",
      bundler: "metro",
    },
    plugins: [
      "expo-router",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@react-native-firebase/messaging",
      [
        "expo-notifications",
        {
          icon: "./src/assets/images/notification-icon.jpeg",
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow $(PRODUCT_NAME) to use your location.",
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./src/assets/images/notification-icon.jpeg",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
