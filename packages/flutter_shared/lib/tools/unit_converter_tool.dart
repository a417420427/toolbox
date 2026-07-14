/// 单位换算工具
class UnitConverterTool {
  UnitConverterTool._();

  // ── 分类 ──
  static const List<String> categories = [
    '长度', '重量', '温度', '面积', '体积', '数据存储', '速度', '时间',
  ];

  // ── 各分类的单位和换算基准（到 base 单位的系数）──

  /// 长度：基准 = 米
  static const List<String> lengthUnits = [
    '毫米 (mm)', '厘米 (cm)', '分米 (dm)', '米 (m)', '千米 (km)',
    '英寸 (in)', '英尺 (ft)', '码 (yd)', '英里 (mi)', '海里 (nmi)',
    '光年 (ly)',
  ];
  static const List<double> lengthRates = [
    0.001, 0.01, 0.1, 1, 1000,
    0.0254, 0.3048, 0.9144, 1609.344, 1852,
    9.4607e15,
  ];

  /// 重量：基准 = 克
  static const List<String> weightUnits = [
    '毫克 (mg)', '克 (g)', '千克 (kg)', '吨 (t)',
    '盎司 (oz)', '磅 (lb)', '石 (st)',
  ];
  static const List<double> weightRates = [
    0.001, 1, 1000, 1e6,
    28.3495, 453.592, 6350.29,
  ];

  /// 温度：特殊公式
  static const List<String> tempUnits = ['摄氏度 (°C)', '华氏度 (°F)', '开尔文 (K)'];

  /// 面积：基准 = 平方米
  static const List<String> areaUnits = [
    '平方毫米 (mm²)', '平方厘米 (cm²)', '平方米 (m²)', '公顷 (ha)',
    '平方千米 (km²)', '平方英寸 (in²)', '平方英尺 (ft²)', '英亩 (ac)',
  ];
  static const List<double> areaRates = [
    1e-6, 1e-4, 1, 10000,
    1e6, 0.00064516, 0.092903, 4046.86,
  ];

  /// 体积：基准 = 升
  static const List<String> volumeUnits = [
    '毫升 (mL)', '升 (L)', '立方米 (m³)', '加仑 (gal)',
    '夸脱 (qt)', '品脱 (pt)', '杯 (cup)', '液体盎司 (fl oz)',
    '立方英寸 (in³)', '立方英尺 (ft³)',
  ];
  static const List<double> volumeRates = [
    0.001, 1, 1000, 3.78541,
    0.946353, 0.473176, 0.236588, 0.0295735,
    0.0163871, 28.3168,
  ];

  /// 数据存储：基准 = 字节
  static const List<String> storageUnits = [
    'B', 'KB', 'MB', 'GB', 'TB', 'PB',
    'KiB', 'MiB', 'GiB', 'TiB',
  ];
  static const List<double> storageRates = [
    1, 1000, 1e6, 1e9, 1e12, 1e15,
    1024, 1048576, 1.07374e9, 1.09951e12,
  ];

  /// 速度：基准 = 米/秒
  static const List<String> speedUnits = [
    '米/秒 (m/s)', '千米/小时 (km/h)', '英里/小时 (mph)',
    '节 (kn)', '马赫 (Mach)',
  ];
  static const List<double> speedRates = [
    1, 0.277778, 0.44704,
    0.514444, 340.29,
  ];

  /// 时间：基准 = 秒
  static const List<String> timeUnits = [
    '毫秒 (ms)', '秒 (s)', '分钟 (min)', '小时 (h)',
    '天 (d)', '周 (wk)', '月 (mo)', '年 (yr)',
  ];
  static const List<double> timeRates = [
    0.001, 1, 60, 3600,
    86400, 604800, 2592000, 31536000,
  ];

  /// 获取指定分类的单位列表
  static List<String> unitsFor(String category) {
    return switch (category) {
      '长度' => lengthUnits,
      '重量' => weightUnits,
      '温度' => tempUnits,
      '面积' => areaUnits,
      '体积' => volumeUnits,
      '数据存储' => storageUnits,
      '速度' => speedUnits,
      '时间' => timeUnits,
      _ => lengthUnits,
    };
  }

  /// 换算
  static ({double result, String? error}) convert({
    required String category,
    required double value,
    required int fromIndex,
    required int toIndex,
  }) {
    if (category == '温度') {
      return _convertTemperature(value, fromIndex, toIndex);
    }

    final rates = _ratesFor(category);
    if (rates == null || fromIndex >= rates.length || toIndex >= rates.length) {
      return (result: double.nan, error: '单位索引超出范围');
    }

    // 先换算到 base，再换算到目标
    final baseValue = value * rates[fromIndex];
    final result = baseValue / rates[toIndex];

    return (result: result, error: null);
  }

  static List<double>? _ratesFor(String category) {
    return switch (category) {
      '长度' => lengthRates,
      '重量' => weightRates,
      '面积' => areaRates,
      '体积' => volumeRates,
      '数据存储' => storageRates,
      '速度' => speedRates,
      '时间' => timeRates,
      _ => null,
    };
  }

  static ({double result, String? error}) _convertTemperature(
    double value, int from, int to,
  ) {
    // 先转成摄氏
    double celsius;
    switch (from) {
      case 0: celsius = value;       // °C
      case 1: celsius = (value - 32) * 5 / 9;  // °F
      case 2: celsius = value - 273.15;         // K
      default: return (result: double.nan, error: '无效的温度单位');
    }

    // 从摄氏转目标
    switch (to) {
      case 0: return (result: celsius, error: null);
      case 1: return (result: celsius * 9 / 5 + 32, error: null);
      case 2: return (result: celsius + 273.15, error: null);
      default: return (result: double.nan, error: '无效的温度单位');
    }
  }

  /// 格式化结果
  static String format(double value) {
    if (value.isNaN) return '—';
    if (value.isInfinite) return '无穷大';
    if (value == value.roundToDouble()) {
      return value.toInt().toString();
    }
    return value.toStringAsFixed(6).replaceAll(RegExp(r'0+$'), '').replaceAll(RegExp(r'\.$'), '');
  }
}
