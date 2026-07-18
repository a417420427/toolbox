/**
 * 单位换算工具
 * 移植自 flutter_shared/tools/unit_converter_tool.dart
 */

export interface ConvertParams {
  category: string;
  value: number;
  fromIndex: number;
  toIndex: number;
}

export const UnitConverterTool = {
  categories: ['长度', '重量', '温度', '面积', '体积', '数据存储', '速度', '时间'],

  lengthUnits: ['毫米 (mm)', '厘米 (cm)', '分米 (dm)', '米 (m)', '千米 (km)', '英寸 (in)', '英尺 (ft)', '码 (yd)', '英里 (mi)', '海里 (nmi)', '光年 (ly)'],
  lengthRates: [0.001, 0.01, 0.1, 1, 1000, 0.0254, 0.3048, 0.9144, 1609.344, 1852, 9.4607e15],

  weightUnits: ['毫克 (mg)', '克 (g)', '千克 (kg)', '吨 (t)', '盎司 (oz)', '磅 (lb)', '石 (st)'],
  weightRates: [0.001, 1, 1000, 1e6, 28.3495, 453.592, 6350.29],

  tempUnits: ['摄氏度 (°C)', '华氏度 (°F)', '开尔文 (K)'],

  areaUnits: ['平方毫米 (mm²)', '平方厘米 (cm²)', '平方米 (m²)', '公顷 (ha)', '平方千米 (km²)', '平方英寸 (in²)', '平方英尺 (ft²)', '英亩 (ac)'],
  areaRates: [1e-6, 1e-4, 1, 10000, 1e6, 0.00064516, 0.092903, 4046.86],

  volumeUnits: ['毫升 (mL)', '升 (L)', '立方米 (m³)', '加仑 (gal)', '夸脱 (qt)', '品脱 (pt)', '杯 (cup)', '液体盎司 (fl oz)', '立方英寸 (in³)', '立方英尺 (ft³)'],
  volumeRates: [0.001, 1, 1000, 3.78541, 0.946353, 0.473176, 0.236588, 0.0295735, 0.0163871, 28.3168],

  storageUnits: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'KiB', 'MiB', 'GiB', 'TiB'],
  storageRates: [1, 1000, 1e6, 1e9, 1e12, 1e15, 1024, 1048576, 1.07374e9, 1.09951e12],

  speedUnits: ['米/秒 (m/s)', '千米/小时 (km/h)', '英里/小时 (mph)', '节 (kn)', '马赫 (Mach)'],
  speedRates: [1, 0.277778, 0.44704, 0.514444, 340.29],

  timeUnits: ['毫秒 (ms)', '秒 (s)', '分钟 (min)', '小时 (h)', '天 (d)', '周 (wk)', '月 (mo)', '年 (yr)'],
  timeRates: [0.001, 1, 60, 3600, 86400, 604800, 2592000, 31536000],

  unitsFor(category: string): string[] {
    switch (category) {
      case '长度': return this.lengthUnits;
      case '重量': return this.weightUnits;
      case '温度': return this.tempUnits;
      case '面积': return this.areaUnits;
      case '体积': return this.volumeUnits;
      case '数据存储': return this.storageUnits;
      case '速度': return this.speedUnits;
      case '时间': return this.timeUnits;
      default: return this.lengthUnits;
    }
  },

  _ratesFor(category: string): number[] | null {
    switch (category) {
      case '长度': return this.lengthRates;
      case '重量': return this.weightRates;
      case '面积': return this.areaRates;
      case '体积': return this.volumeRates;
      case '数据存储': return this.storageRates;
      case '速度': return this.speedRates;
      case '时间': return this.timeRates;
      default: return null;
    }
  },

  _convertTemperature(value: number, from: number, to: number): { result: number; error?: string } {
    let celsius: number;
    switch (from) {
      case 0: celsius = value; break;
      case 1: celsius = (value - 32) * 5 / 9; break;
      case 2: celsius = value - 273.15; break;
      default: return { result: NaN, error: '无效的温度单位' };
    }
    switch (to) {
      case 0: return { result: celsius };
      case 1: return { result: celsius * 9 / 5 + 32 };
      case 2: return { result: celsius + 273.15 };
      default: return { result: NaN, error: '无效的温度单位' };
    }
  },

  convert(params: ConvertParams): { result: number; error?: string } {
    const { category, value, fromIndex, toIndex } = params;

    if (category === '温度') {
      return this._convertTemperature(value, fromIndex, toIndex);
    }

    const rates = this._ratesFor(category);
    if (!rates || fromIndex >= rates.length || toIndex >= rates.length) {
      return { result: NaN, error: '单位索引超出范围' };
    }

    const baseValue = value * rates[fromIndex];
    return { result: baseValue / rates[toIndex] };
  },

  format(value: number): string {
    if (isNaN(value)) return '—';
    if (!isFinite(value)) return '无穷大';
    if (value === Math.round(value)) return value.toString();
    return parseFloat(value.toFixed(6)).toString();
  },
};
