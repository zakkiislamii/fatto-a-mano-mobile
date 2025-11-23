# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npx expo start
```

Expo DevTools will open, and you can run the app on Android, iOS, or the web.

---

## 📱 Running as Native Apps (Android & iOS)

If you want to run the project as a full native app (outside of Expo Go), you need to prebuild the native folders.

### Generate native Android/iOS projects

```bash
npx expo prebuild
```

This creates the `android/` and `ios/` folders.

### Run the Android app

```bash
npx expo run:android
```

Make sure an emulator or physical device is connected.

### Run the iOS app (macOS only)

```bash
npx expo run:ios
```

---

## 🔄 Reset to a Fresh Project

```bash
npm run reset-project
```

This moves the starter code to `app-example/` and creates a blank `app/` directory.

---

If you run `expo prebuild`, you'll also see:

```
├── android/            # Native Android project
└── ios/                # Native iOS project
```

---

## 📘 Learn More

- Expo Documentation: https://docs.expo.dev/
- Guides: https://docs.expo.dev/guides
- Expo Tutorial: https://docs.expo.dev/tutorial/introduction
