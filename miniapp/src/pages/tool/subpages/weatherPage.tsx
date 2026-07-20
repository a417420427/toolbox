import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import ToolPageLayout from './common/toolPageLayout';
import { WeatherTool, WeatherData } from '@/utils/tools/weatherTool';
import toolStyles from '@/styles/tool-common.module.scss';

const WeatherPage: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');

  const load = useCallback(async (cityName?: string) => {
    setLoading(true);
    setError('');
    try {
      const c = cityName || await WeatherTool.detectCity();
      setCity(c);
      const data = await WeatherTool.getWeather(c);
      if (data) {
        setWeather(data);
      } else {
        setError('获取天气数据失败，请检查网络');
      }
    } catch (e: any) {
      setError(`获取失败: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = () => load(city);

  const getWeatherIcon = (condition: string): string => {
    if (condition.includes('☀️')) return '☀️';
    if (condition.includes('⛅')) return '⛅';
    if (condition.includes('☁️')) return '☁️';
    if (condition.includes('🌦️') || condition.includes('🌧️')) return '🌧️';
    if (condition.includes('🌨️') || condition.includes('❄️')) return '❄️';
    if (condition.includes('⛈️')) return '⛈️';
    if (condition.includes('🌫️')) return '🌫️';
    return '🌤️';
  };

  return (
    <View>
      {/* 城市头部 */}
      <View className={toolStyles.section} style={{ textAlign: 'center', padding: '24rpx 0' }}>
        <Text style={{ fontSize: '36rpx', fontWeight: 600, color: '#1a1a1a' }}>{city || '定位中...'}</Text>
        <Text
          style={{ fontSize: '22rpx', color: '#3b82f6', marginTop: '8rpx', display: 'inline-block' }}
          onClick={refresh}
        >🔄 刷新</Text>
      </View>

      {loading && (
        <View className={toolStyles.section} style={{ textAlign: 'center', padding: '40rpx 0' }}>
          <Text style={{ fontSize: '28rpx', color: '#9ca3af' }}>获取天气数据中...</Text>
        </View>
      )}

      {error && (
        <View className={toolStyles.errorBox}>
          <Text className={toolStyles.errorText}>{error}</Text>
        </View>
      )}

      {weather && !loading && (
        <>
          {/* 当前天气大卡片 */}
          <View className={toolStyles.section} style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20rpx',
            padding: '32rpx',
            marginBottom: '24rpx',
          }}>
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: '80rpx' }}>{getWeatherIcon(weather.condition)}</Text>
              <Text style={{ fontSize: '72rpx', fontWeight: 700, color: '#fff' }}>{weather.currentTemp}</Text>
            </View>
            <Text style={{ fontSize: '32rpx', color: 'rgba(255,255,255,0.9)', marginTop: '8rpx' }}>
              {weather.condition}
            </Text>
            <Text style={{ fontSize: '24rpx', color: 'rgba(255,255,255,0.7)', marginTop: '4rpx' }}>
              体感 {weather.feelsLike} · 湿度 {weather.humidity} · 风速 {weather.windSpeed}
            </Text>
            <View style={{ display: 'flex', gap: '32rpx', marginTop: '20rpx' }}>
              <View>
                <Text style={{ fontSize: '22rpx', color: 'rgba(255,255,255,0.7)' }}>日出</Text>
                <Text style={{ fontSize: '28rpx', color: '#fff', fontWeight: 500 }} selectable>{weather.sunrise}</Text>
              </View>
              <View>
                <Text style={{ fontSize: '22rpx', color: 'rgba(255,255,255,0.7)' }}>日落</Text>
                <Text style={{ fontSize: '28rpx', color: '#fff', fontWeight: 500 }} selectable>{weather.sunset}</Text>
              </View>
              <View>
                <Text style={{ fontSize: '22rpx', color: 'rgba(255,255,255,0.7)' }}>紫外线</Text>
                <Text style={{ fontSize: '28rpx', color: '#fff', fontWeight: 500 }}>{weather.uvIndex}</Text>
              </View>
            </View>
          </View>

          {/* 逐小时 */}
          {weather.hourly.length > 0 && (
            <View className={toolStyles.section}>
              <Text className={toolStyles.sectionTitle}>今天逐小时</Text>
              <View style={{ display: 'flex', gap: '16rpx', overflowX: 'auto', paddingBottom: '8rpx' }}>
                {weather.hourly.map((h, i) => (
                  <View key={i} style={{
                    flexShrink: 0,
                    background: '#fff',
                    border: '1rpx solid #e5e7eb',
                    borderRadius: '12rpx',
                    padding: '16rpx',
                    width: '120rpx',
                    textAlign: 'center',
                  }}>
                    <Text style={{ fontSize: '22rpx', color: '#6b7280', display: 'block' }}>{h.time}</Text>
                    <Text style={{ fontSize: '36rpx', margin: '8rpx 0', display: 'block' }}>{h.condition.split(' ')[0]}</Text>
                    <Text style={{ fontSize: '28rpx', fontWeight: 600, color: '#1a1a1a' }}>{h.temp}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 逐日预报 */}
          <View className={toolStyles.section}>
            <Text className={toolStyles.sectionTitle}>未来几天</Text>
            {weather.daily.map((d, i) => (
              <View key={i} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12rpx 0',
                borderBottom: i < weather.daily.length - 1 ? '1rpx solid #f3f4f6' : 'none',
              }}>
                <Text style={{ width: '120rpx', fontSize: '24rpx', color: '#6b7280' }}>
                  {i === 0 ? '今天' : d.dayOfWeek}
                </Text>
                <Text style={{ flex: 1, fontSize: '28rpx', textAlign: 'center' }}>
                  {d.condition.split(' ')[0]}
                </Text>
                <View style={{ display: 'flex', gap: '16rpx', width: '160rpx', justifyContent: 'flex-end' }}>
                  <Text style={{ fontSize: '24rpx', color: '#ef4444' }}>{d.high}</Text>
                  <Text style={{ fontSize: '24rpx', color: '#3b82f6' }}>{d.low}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* 能见度 */}
          <View className={toolStyles.section}>
            <View className={toolStyles.grid}>
              <View className={toolStyles.gridItem}>
                <Text className={toolStyles.statLabel}>能见度</Text>
                <Text className={toolStyles.statValue}>{weather.visibility}</Text>
              </View>
              <View className={toolStyles.gridItem}>
                <Text className={toolStyles.statLabel}>体感温度</Text>
                <Text className={toolStyles.statValue}>{weather.feelsLike}</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default WeatherPage;
