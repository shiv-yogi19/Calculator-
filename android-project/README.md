# NEXCAL — Native Android Application
**Application Name:** NEXCAL  
**Branding:** Created By Shiv Yogi  
**Package ID:** `com.shivyogi.nexcal`  
**Minimum SDK:** 26 (Android 8.0)  
**Target / Compile SDK:** 35 (Android 15)  
**Architecture:** Jetpack Compose + Material 3 Dynamic Colour  

---

## 🛠️ Step-by-Step Instructions to Compile Installable APK

### Method 1: Using Android Studio (Recommended)
1. Download and extract this project folder (`nexcal-android-project.zip`).
2. Open **Android Studio** (Ladybug 2024.2+ or Koala).
3. Select **Open** and choose the extracted `NEXCAL` directory.
4. Wait 30 seconds for Gradle sync to complete automatically.
5. In the top menu, click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**.
6. When the build completes, Android Studio will show a popup:
   > *APK(s) generated successfully for 1 module: Locate*
7. Click **Locate**. The generated APK file is at:
   `app/build/outputs/apk/debug/app-debug.apk`
8. Rename `app-debug.apk` to **`NEXCAL.apk`**.

---

### Method 2: Command Line (Terminal / CI)
Run the Gradle wrapper in this directory:
```bash
./gradlew assembleDebug
```
The APK will be generated at:
```bash
app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 Installation on Android Device
1. Transfer `NEXCAL.apk` to your Android phone via USB cable, Google Drive, or Bluetooth.
2. Open your phone's **Files** or **Downloads** app and tap on `NEXCAL.apk`.
3. If Android prompts *"For your security, your phone is not allowed to install unknown apps from this source"*, tap **Settings** and toggle **Allow from this source**.
4. Return to the installer and tap **Install**.
5. Once installation finishes, tap **Open** to launch **NEXCAL**.
