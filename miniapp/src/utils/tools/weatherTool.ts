/**
 * 天气查询工具 — 接入免费天气 API
 * 使用 wttr.in API（无需 API Key）
 */

export interface WeatherData {
  city: string;
  currentTemp: string;
  feelsLike: string;
  condition: string;
  humidity: string;
  windSpeed: string;
  visibility: string;
  uvIndex: string;
  sunrise: string;
  sunset: string;
  hourly: { time: string; temp: string; condition: string }[];
  daily: { date: string; dayOfWeek: string; high: string; low: string; condition: string; precip: string }[];
}

export interface SearchCity {
  name: string;
  country: string;
}

export const WeatherTool = {
  /** 通过 IP 获取城市 */
  async detectCity(): Promise<string> {
    try {
      const res = await fetch('https://wttr.in?format=%C+%l');
      const text = await res.text();
      // 格式如: "Clear Shenzhen" 或 "Overcast Beijing, China"
      const parts = text.split(' ');
      for (let i = parts.length - 1; i >= 0; i--) {
        const candidate = parts[i].split(',')[0].replace(/[^a-zA-Z\u4e00-\u9fff-]/g, '');
        if (candidate && candidate !== 'Unknown') return candidate;
      }
      return 'Shenzhen';
    } catch {
      return 'Shenzhen';
    }
  },

  /** 获取今日+未来几天的天气 */
  async getWeather(city: string): Promise<WeatherData | null> {
    try {
      const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=zh`;
      const res = await fetch(url);
      const data = await res.json();

      const current = data.current_condition?.[0];
      const forecasts = data.weather || [];
      const areaName = data.nearest_area?.[0]?.areaName?.[0]?.value || city;
      const country = data.nearest_area?.[0]?.country?.[0]?.value || '';

      const hourly: WeatherData['hourly'] = [];
      const now = new Date().getHours();

      if (forecasts[0]?.hourly) {
        for (const h of forecasts[0].hourly) {
          const hour = parseInt(h.time?.padStart(4, '0').substring(0, 2), 10);
          if (hour >= now) {
            hourly.push({
              time: `${hour.toString().padStart(2, '0')}:00`,
              temp: `${h.tempC}°`,
              condition: this._mapCondition(h.weatherDesc?.[0]?.value || ''),
            });
            if (hourly.length >= 6) break;
          }
        }
      }

      const daily: WeatherData['daily'] = forecasts.map((d: any) => ({
        date: d.date,
        dayOfWeek: this._getDayOfWeek(d.date),
        high: `${d.maxtempC}°`,
        low: `${d.mintempC}°`,
        condition: this._mapCondition(d.hourly?.[0]?.weatherDesc?.[0]?.value || ''),
        precip: d.hourly?.[0]?.precipMM || '0',
      }));

      return {
        city: country ? `${areaName}, ${country}` : areaName,
        currentTemp: `${current?.temp_C || '--'}°C`,
        feelsLike: `${current?.FeelsLikeC || '--'}°C`,
        condition: this._mapCondition(current?.weatherDesc?.[0]?.value || ''),
        humidity: `${current?.humidity || '--'}%`,
        windSpeed: `${current?.windspeedKmph || '--'} km/h`,
        visibility: `${current?.visibility || '--'} km`,
        uvIndex: current?.uvIndex || '--',
        sunrise: forecasts[0]?.astronomy?.[0]?.sunrise || '--:--',
        sunset: forecasts[0]?.astronomy?.[0]?.sunset || '--:--',
        hourly,
        daily,
      };
    } catch {
      return null;
    }
  },

  /** 搜索城市（简单模拟，使用内置列表） */
  async searchCities(query: string): Promise<SearchCity[]> {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return this._commonCities.filter(c =>
      c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    ).slice(0, 10);
  },

  /** 常用城市 */
  _commonCities: [
    { name: 'Beijing', country: 'China' },
    { name: 'Shanghai', country: 'China' },
    { name: 'Guangzhou', country: 'China' },
    { name: 'Shenzhen', country: 'China' },
    { name: 'Hangzhou', country: 'China' },
    { name: 'Chengdu', country: 'China' },
    { name: 'Wuhan', country: 'China' },
    { name: 'Nanjing', country: 'China' },
    { name: 'Xi\'an', country: 'China' },
    { name: 'Changsha', country: 'China' },
    { name: 'Suzhou', country: 'China' },
    { name: 'Tianjin', country: 'China' },
    { name: 'Chongqing', country: 'China' },
    { name: 'Tokyo', country: 'Japan' },
    { name: 'Seoul', country: 'South Korea' },
    { name: 'New York', country: 'USA' },
    { name: 'London', country: 'UK' },
    { name: 'Paris', country: 'France' },
    { name: 'Singapore', country: 'Singapore' },
    { name: 'Bangkok', country: 'Thailand' },
    { name: 'Sydney', country: 'Australia' },
  ],

  _getDayOfWeek(dateStr: string): string {
    const d = new Date(dateStr);
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[d.getDay()];
  },

  _mapCondition(desc: string): string {
    const map: Record<string, string> = {
      'Clear': '☀️ 晴',
      'Sunny': '☀️ 晴',
      'Partly cloudy': '⛅ 多云',
      'Cloudy': '☁️ 阴',
      'Overcast': '☁️ 阴',
      'Mist': '🌫️ 雾',
      'Fog': '🌫️ 雾',
      'Light rain': '🌦️ 小雨',
      'Moderate rain': '🌧️ 中雨',
      'Heavy rain': '🌧️ 大雨',
      'Light snow': '🌨️ 小雪',
      'Moderate snow': '❄️ 中雪',
      'Heavy snow': '❄️ 大雪',
      'Thunderstorm': '⛈️ 雷暴',
      'Thunder': '⛈️ 雷暴',
      'Drizzle': '🌦️ 毛毛雨',
      'Haze': '🌫️ 霾',
      'Smoke': '🌫️ 烟雾',
      'Dust': '🌪️ 扬尘',
    };
    return map[desc] || `🌤️ ${desc}`;
  },
};
