package com.shivyogi.nexcal.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = NeonGreen,
    secondary = NeonCyan,
    tertiary = CyberViolet,
    background = AmoledBlack,
    surface = DarkSurface,
    onPrimary = AmoledBlack,
    onBackground = KeypadNumberText,
    onSurface = KeypadNumberText
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF00897B),
    secondary = Color(0xFF0288D1),
    background = Color(0xFFF5F7FA),
    surface = Color(0xFFFFFFFF),
    onPrimary = Color(0xFFFFFFFF)
)

@Composable
fun NexcalTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        // Genuine Android 12+ Wallpaper-derived Dynamic Color
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
