package com.shivyogi.nexcal.calculator

import kotlin.math.*

/**
 * NEXCAL High-Precision Mathematical Evaluation Engine
 * Uses Shunting-yard algorithm and RPN stack evaluation without unsafe eval
 */
class CalculatorEngine {
    enum class AngleMode { DEG, RAD }

    sealed class EvaluationResult {
        data class Success(val value: Double, val formatted: String) : EvaluationResult()
        data class Error(val message: String) : EvaluationResult()
    }

    private val precedenceMap = mapOf(
        "+" to 1, "-" to 1,
        "*" to 2, "/" to 2, "%" to 2, "mod" to 2,
        "^" to 3, "NEG" to 4, "!" to 4
    )

    fun evaluate(expression: String, angleMode: AngleMode = AngleMode.DEG): EvaluationResult {
        if (expression.isBlank()) return EvaluationResult.Error("Empty expression")

        val sanitized = expression
            .replace("×", "*")
            .replace("÷", "/")
            .replace("−", "-")
            .replace("π", Math.PI.toString())
            .replace("e", Math.E.toString())

        return try {
            val tokens = tokenize(sanitized)
            val rpn = shuntingYard(tokens)
            val result = evaluateRPN(rpn, angleMode)
            EvaluationResult.Success(result, formatResult(result))
        } catch (e: Exception) {
            EvaluationResult.Error(e.message ?: "Evaluation error")
        }
    }

    fun getLivePreview(expression: String, angleMode: AngleMode = AngleMode.DEG): String? {
        if (expression.isBlank() || expression.trim().endsWith("+") ||
            expression.trim().endsWith("-") || expression.trim().endsWith("×") ||
            expression.trim().endsWith("÷") || expression.trim().endsWith("/") ||
            expression.trim().endsWith("*")
        ) {
            return null
        }
        var expr = expression
        val open = expr.count { it == '(' }
        val closed = expr.count { it == ')' }
        if (open > closed) {
            expr += ")".repeat(open - closed)
        }
        return when (val res = evaluate(expr, angleMode)) {
            is EvaluationResult.Success -> res.formatted
            is EvaluationResult.Error -> null
        }
    }

    private fun tokenize(expr: String): List<String> {
        val tokens = mutableListOf<String>()
        val regex = Regex("""(\d+(\.\d+)?([eE][+-]?\d+)?|[+\-*/%^()]|mod|sin|cos|tan|asin|acos|atan|log|ln|sqrt|cbrt|!)""")
        var lastWasOperator = true

        regex.findAll(expr).forEach { match ->
            val v = match.value
            if (v == "-" && lastWasOperator) {
                tokens.add("NEG")
            } else {
                tokens.add(v)
            }
            lastWasOperator = v in listOf("+", "-", "*", "/", "%", "^", "NEG", "(")
        }
        return tokens
    }

    private fun shuntingYard(tokens: List<String>): List<String> {
        val output = mutableListOf<String>()
        val stack = ArrayDeque<String>()

        for (token in tokens) {
            when {
                token.toDoubleOrNull() != null -> output.add(token)
                token in listOf("sin", "cos", "tan", "asin", "acos", "atan", "log", "ln", "sqrt", "cbrt") -> {
                    stack.addFirst(token)
                }
                token in precedenceMap.keys -> {
                    val p1 = precedenceMap[token] ?: 0
                    while (stack.isNotEmpty()) {
                        val top = stack.first()
                        val p2 = precedenceMap[top] ?: 0
                        if (p2 >= p1 && token != "NEG" && token != "^") {
                            output.add(stack.removeFirst())
                        } else {
                            break
                        }
                    }
                    stack.addFirst(token)
                }
                token == "(" -> stack.addFirst(token)
                token == ")" -> {
                    while (stack.isNotEmpty() && stack.first() != "(") {
                        output.add(stack.removeFirst())
                    }
                    if (stack.isNotEmpty()) stack.removeFirst()
                    if (stack.isNotEmpty() && stack.first() in listOf("sin", "cos", "tan", "asin", "acos", "atan", "log", "ln", "sqrt", "cbrt")) {
                        output.add(stack.removeFirst())
                    }
                }
            }
        }
        while (stack.isNotEmpty()) {
            output.add(stack.removeFirst())
        }
        return output
    }

    private fun evaluateRPN(rpn: List<String>, angleMode: AngleMode): Double {
        val stack = ArrayDeque<Double>()
        val toRad = { deg: Double -> if (angleMode == AngleMode.DEG) Math.toRadians(deg) else deg }
        val fromRad = { rad: Double -> if (angleMode == AngleMode.DEG) Math.toDegrees(rad) else rad }

        for (token in rpn) {
            val num = token.toDoubleOrNull()
            if (num != null) {
                stack.addFirst(num)
                continue
            }

            when (token) {
                "NEG" -> {
                    val a = stack.removeFirst()
                    stack.addFirst(-a)
                }
                "!" -> {
                    val a = stack.removeFirst().toInt()
                    var f = 1.0
                    for (i in 2..a) f *= i
                    stack.addFirst(f)
                }
                "sin" -> stack.addFirst(sin(toRad(stack.removeFirst())))
                "cos" -> stack.addFirst(cos(toRad(stack.removeFirst())))
                "tan" -> stack.addFirst(tan(toRad(stack.removeFirst())))
                "asin" -> stack.addFirst(fromRad(asin(stack.removeFirst())))
                "acos" -> stack.addFirst(fromRad(acos(stack.removeFirst())))
                "atan" -> stack.addFirst(fromRad(atan(stack.removeFirst())))
                "log" -> stack.addFirst(log10(stack.removeFirst()))
                "ln" -> stack.addFirst(ln(stack.removeFirst()))
                "sqrt" -> stack.addFirst(sqrt(stack.removeFirst()))
                "cbrt" -> stack.addFirst(cbrt(stack.removeFirst()))
                else -> {
                    val b = stack.removeFirst()
                    val a = stack.removeFirst()
                    val res = when (token) {
                        "+" -> a + b
                        "-" -> a - b
                        "*" -> a * b
                        "/" -> if (b == 0.0) throw ArithmeticException("Cannot divide by 0") else a / b
                        "%" -> (a * b) / 100.0
                        "mod" -> a % b
                        "^" -> a.pow(b)
                        else -> 0.0
                    }
                    stack.addFirst(res)
                }
            }
        }
        return stack.removeFirst()
    }

    private fun formatResult(num: Double): String {
        if (num.isNaN()) return "Error"
        if (num.isInfinite()) return if (num > 0) "Infinity" else "-Infinity"
        val rounded = Math.round(num * 1e10) / 1e10
        return if (rounded == rounded.toLong().toDouble()) {
            rounded.toLong().toString()
        } else {
            rounded.toString()
        }
    }
}
