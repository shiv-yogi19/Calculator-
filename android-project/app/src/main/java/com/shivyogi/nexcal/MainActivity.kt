package com.shivyogi.nexcal

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.shivyogi.nexcal.ui.screens.MainCalculatorScreen
import com.shivyogi.nexcal.ui.theme.NexcalTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            NexcalTheme(dynamicColor = true) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = Color.Black
                ) {
                    MainCalculatorScreen(
                        appName = getString(R.string.app_name),
                        developerCredit = getString(R.string.developer_credit)
                    )
                }
            }
        }
    }
}
