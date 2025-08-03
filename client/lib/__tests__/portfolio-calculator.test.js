class TestFramework {
  static tests = [];
  static results = { passed: 0, failed: 0 };

  static test(name, fn) {
    this.tests.push({ name, fn });
  }

  static async runAll() {
    console.log("🧪 Running Portfolio Calculator Tests\n");

    for (const { name, fn } of this.tests) {
      try {
        await fn();
        console.log(`✅ ${name}`);
        this.results.passed++;
      } catch (error) {
        console.log(`❌ ${name}`);
        console.log(`   Error: ${error.message}\n`);
        this.results.failed++;
      }
    }

    console.log(
      `\n📊 Results: ${this.results.passed} passed, ${this.results.failed} failed`
    );
    process.exit(this.results.failed > 0 ? 1 : 0);
  }

  static assertEqual(actual, expected, message = "") {
    if (actual !== expected) {
      throw new Error(`${message} Expected: ${expected}, Got: ${actual}`);
    }
  }

  static assertTrue(condition, message = "") {
    if (!condition) {
      throw new Error(`${message} Expected truthy value`);
    }
  }

  static assertGreaterThan(actual, expected, message = "") {
    if (actual <= expected) {
      throw new Error(`${message} Expected ${actual} > ${expected}`);
    }
  }
}

const mockHistoricalData = [
  [
    { date: "2024-01-01", close: 150 },
    { date: "2024-01-02", close: 152 },
    { date: "2024-01-03", close: 151 },
    { date: "2024-01-04", close: 155 },
    { date: "2024-01-05", close: 158 },
  ],
  [
    { date: "2024-01-01", close: 300 },
    { date: "2024-01-02", close: 305 },
    { date: "2024-01-03", close: 302 },
    { date: "2024-01-04", close: 310 },
    { date: "2024-01-05", close: 315 },
  ],
];

class PortfolioCalculator {
  static findLatestStartDate(historicalData) {
    const startDates = historicalData
      .map((data) => data[0]?.date)
      .filter(Boolean)
      .sort();
    return startDates[startDates.length - 1];
  }

  static calculateVolatility(returns) {
    if (returns.length === 0) return 0;
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance =
      returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) /
      returns.length;
    return Math.sqrt(variance);
  }

  static calculateMaxDrawdown(chartData) {
    let peak = chartData[0]?.value || 10000;
    let maxDrawdown = 0;

    for (const point of chartData) {
      if (point.value > peak) {
        peak = point.value;
      }
      const drawdown = ((point.value - peak) / peak) * 100;
      if (drawdown < maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return maxDrawdown;
  }
}

TestFramework.test(
  "findLatestStartDate should return the latest start date",
  () => {
    const result = PortfolioCalculator.findLatestStartDate(mockHistoricalData);
    TestFramework.assertEqual(
      result,
      "2024-01-01",
      "Should return latest start date"
    );
  }
);

TestFramework.test(
  "calculateVolatility should calculate standard deviation",
  () => {
    const returns = [0.01, -0.005, 0.02, -0.01, 0.015];
    const volatility = PortfolioCalculator.calculateVolatility(returns);
    TestFramework.assertGreaterThan(
      volatility,
      0,
      "Volatility should be positive"
    );
    TestFramework.assertTrue(volatility < 1, "Volatility should be reasonable");
  }
);

TestFramework.test(
  "calculateMaxDrawdown should handle positive returns",
  () => {
    const chartData = [
      { value: 10000 },
      { value: 10500 },
      { value: 11000 },
      { value: 10800 },
      { value: 11200 },
    ];
    const maxDrawdown = PortfolioCalculator.calculateMaxDrawdown(chartData);
    TestFramework.assertTrue(
      maxDrawdown <= 0,
      "Max drawdown should be negative or zero"
    );
  }
);

TestFramework.test(
  "calculateMaxDrawdown should handle declining portfolio",
  () => {
    const chartData = [
      { value: 10000 },
      { value: 9500 },
      { value: 9000 },
      { value: 8500 },
      { value: 8000 },
    ];
    const maxDrawdown = PortfolioCalculator.calculateMaxDrawdown(chartData);
    TestFramework.assertTrue(
      maxDrawdown < -15,
      "Should detect significant drawdown"
    );
  }
);

TestFramework.test("volatility calculation should handle empty array", () => {
  const volatility = PortfolioCalculator.calculateVolatility([]);
  TestFramework.assertEqual(
    volatility,
    0,
    "Empty array should return 0 volatility"
  );
});

TestFramework.test("volatility calculation should handle single return", () => {
  const volatility = PortfolioCalculator.calculateVolatility([0.05]);
  TestFramework.assertEqual(
    volatility,
    0,
    "Single return should have 0 volatility"
  );
});

TestFramework.runAll();
