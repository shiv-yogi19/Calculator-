package com.shivyogi.nexcal.ui.screens

import androidx.compose.animation.*
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.shivyogi.nexcal.calculator.CalculatorEngine
import com.shivyogi.nexcal.ui.components.CalcButton
import com.shivyogi.nexcal.ui.theme.NeonGreen

@Composable
fun MainCalculatorScreen(
    appName: String = "NEXCAL",
    developerCredit: String = "Created By Shiv Yogi"
) {
    val engine = remember { CalculatorEngine() }
    var expression by remember { mutableStateOf("") }
    var previewResult by remember { mutableStateOf<String?>(null) }
    var lastEvaluatedResult by remember { mutableStateOf<String?>(null) }
    var isEvaluated by remember { mutableStateOf(false) }
    var angleMode by remember { mutableStateOf(CalculatorEngine.AngleMode.DEG) }

    val scrollState = rememberScrollState()

    // Auto calculate live preview
    LaunchedEffect(expression, angleMode) {
        if (!isEvaluated && expression.isNotBlank()) {
            previewResult = engine.getLivePreview(expression, angleMode)
        } else {
            previewResult = null
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
            .statusBarsPadding()
            .navigationBarsPadding()
            .padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = appName,
                        color = Color.White,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "PRO",
                        color = NeonGreen,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier
                            .background(NeonGreen.copy(alpha = 0.15f), shape = MaterialTheme.shapes.extraSmall)
                            .padding(horizontal = 4.dp, vertical = 2.dp)
                    )
                }
                Text(
                    text = developerCredit,
                    color = Color.Gray,
                    fontSize = 11.sp
                )
            }

            // DEG/RAD Toggle
            OutlinedButton(
                onClick = {
                    angleMode = if (angleMode == CalculatorEngine.AngleMode.DEG)
                        CalculatorEngine.AngleMode.RAD else CalculatorEngine.AngleMode.DEG
                },
                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)
            ) {
                Text(text = angleMode.name, color = NeonGreen, fontSize = 11.sp, fontWeight = FontWeight.Bold)
            }
        }

        // Calculation Display
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .padding(vertical = 16.dp),
            verticalArrangement = Arrangement.Bottom,
            horizontalAlignment = Alignment.End
        ) {
            // Expression Line
            Text(
                text = if (expression.isBlank()) "0" else expression,
                color = if (isEvaluated) Color.Gray else Color.White,
                fontSize = if (expression.length > 15) 26.sp else 38.sp,
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.SemiBold,
                textAlign = TextAlign.End,
                maxLines = 1,
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(scrollState)
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Slide-up Answer Preview / Final Answer
            Box(
                modifier = Modifier
                    .height(44.dp)
                    .fillMaxWidth(),
                contentAlignment = Alignment.CenterEnd
            ) {
                AnimatedVisibility(
                    visible = isEvaluated && lastEvaluatedResult != null,
                    enter = slideInVertically(
                        initialOffsetY = { 40 },
                        animationSpec = tween(250)
                    ) + fadeIn(),
                    exit = fadeOut()
                ) {
                    Text(
                        text = "= ${lastEvaluatedResult ?: ""}",
                        color = NeonGreen,
                        fontSize = 32.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold
                    )
                }

                AnimatedVisibility(
                    visible = !isEvaluated && previewResult != null,
                    enter = slideInVertically(
                        initialOffsetY = { 20 },
                        animationSpec = tween(200)
                    ) + fadeIn(),
                    exit = fadeOut()
                ) {
                    Text(
                        text = "= ${previewResult ?: ""}",
                        color = NeonGreen.copy(alpha = 0.75f),
                        fontSize = 24.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }

        // 4-Column Keypad
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            // Row 1
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                CalcButton("C", onClick = {
                    expression = ""
                    previewResult = null
                    lastEvaluatedResult = null
                    isEvaluated = false
                }, modifier = Modifier.weight(1f), isClear = true)

                CalcButton("⌫", onClick = {
                    if (expression.isNotEmpty()) expression = expression.dropLast(1)
                }, modifier = Modifier.weight(1f), isClear = true)

                CalcButton("%", onClick = {
                    if (expression.isNotEmpty()) expression += "%"
                }, modifier = Modifier.weight(1f), isOperator = true)

                CalcButton("÷", onClick = {
                    expression += "÷"
                }, modifier = Modifier.weight(1f), isOperator = true)
            }

            // Row 2
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                CalcButton("7", onClick = { expression += "7" }, modifier = Modifier.weight(1f))
                CalcButton("8", onClick = { expression += "8" }, modifier = Modifier.weight(1f))
                CalcButton("9", onClick = { expression += "9" }, modifier = Modifier.weight(1f))
                CalcButton("×", onClick = { expression += "×" }, modifier = Modifier.weight(1f), isOperator = true)
            }

            // Row 3
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                CalcButton("4", onClick = { expression += "4" }, modifier = Modifier.weight(1f))
                CalcButton("5", onClick = { expression += "5" }, modifier = Modifier.weight(1f))
                CalcButton("6", onClick = { expression += "6" }, modifier = Modifier.weight(1f))
                CalcButton("−", onClick = { expression += "−" }, modifier = Modifier.weight(1f), isOperator = true)
            }

            // Row 4
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                CalcButton("1", onClick = { expression += "1" }, modifier = Modifier.weight(1f))
                CalcButton("2", onClick = { expression += "2" }, modifier = Modifier.weight(1f))
                CalcButton("3", onClick = { expression += "3" }, modifier = Modifier.weight(1f))
                CalcButton("+", onClick = { expression += "+" }, modifier = Modifier.weight(1f), isOperator = true)
            }

            // Row 5
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                CalcButton("(", onClick = { expression += "(" }, modifier = Modifier.weight(0.5f), isOperator = true)
                CalcButton(")", onClick = { expression += ")" }, modifier = Modifier.weight(0.5f), isOperator = true)
                CalcButton("0", onClick = { expression += "0" }, modifier = Modifier.weight(1f))
                CalcButton(".", onClick = { expression += "." }, modifier = Modifier.weight(1f))
                CalcButton("=", onClick = {
                    val res = engine.evaluate(expression, angleMode)
                    if (res is CalculatorEngine.EvaluationResult.Success) {
                        lastEvaluatedResult = res.formatted
                        isEvaluated = true
                    }
                }, modifier = Modifier.weight(1f), isEquals = true)
            }
        }
    }
}
