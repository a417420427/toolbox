import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { toolById } from '@/data/tools';
import { useToolShare } from '@/hooks/useShare';

import JsonToolPage from './subpages/jsonToolPage';
import Base64ToolPage from './subpages/base64ToolPage';
import UrlToolPage from './subpages/urlToolPage';
import TimestampToolPage from './subpages/timestampToolPage';
import ColorToolPage from './subpages/colorToolPage';
import HashToolPage from './subpages/hashToolPage';
import UuidToolPage from './subpages/uuidToolPage';
import JwtToolPage from './subpages/jwtToolPage';
import NumberBasePage from './subpages/numberBasePage';
import PasswordPage from './subpages/passwordPage';
import HtmlEntityPage from './subpages/htmlEntityPage';
import UnicodePage from './subpages/unicodePage';
import IpToolPage from './subpages/ipToolPage';
import DiffToolPage from './subpages/diffToolPage';
import RegexPage from './subpages/regexPage';
import TextCasePage from './subpages/textCasePage';
import TextStatsPage from './subpages/textStatsPage';
import CalculatorPage from './subpages/calculatorPage';
import UnitConverterPage from './subpages/unitConverterPage';
import DateCalcPage from './subpages/dateCalcPage';
import CountdownPage from './subpages/countdownPage';
import RandomSelectorPage from './subpages/randomSelectorPage';
import MortgagePage from './subpages/mortgagePage';
import HolidayPage from './subpages/holidayPage';
import AnniversaryPage from './subpages/anniversaryPage';
import TimezonePage from './subpages/timezonePage';
import EmojiPage from './subpages/emojiPage';
import InvestmentPage from './subpages/investmentPage';
import BmiPage from './subpages/bmiPage';
import SqlFormatterPage from './subpages/sqlFormatterPage';
import YamlJsonPage from './subpages/yamlJsonPage';
import XmlFormatterPage from './subpages/xmlFormatterPage';
import ColorSchemePage from './subpages/colorSchemePage';
import MarkdownPage from './subpages/markdownPage';
import SortPage from './subpages/sortPage';
import CronPage from './subpages/cronPage';
import UrlParserPage from './subpages/urlParserPage';
import AesPage from './subpages/aesPage';
import PomodoroPage from './subpages/pomodoroPage';
import StopwatchPage from './subpages/stopwatchPage';
import DrawingBoardPage from './subpages/drawingBoardPage';
import RegexVisualizerPage from './subpages/regexVisualizerPage';
import ColoringBookPage from './subpages/coloringBookPage';
import MdNotebookPage from './subpages/mdNotebookPage';
import WeatherPage from './subpages/weatherPage';
import LunarCalendarPage from './subpages/lunarCalendarPage';
import RetirementPage from './subpages/retirementPage';
import HoroscopePage from './subpages/horoscopePage';

const toolPages: Record<string, React.FC> = {
  calculator: CalculatorPage,
  unit_converter: UnitConverterPage,
  date_calc: DateCalcPage,
  countdown: CountdownPage,
  random_selector: RandomSelectorPage,
  text_stats: TextStatsPage,
  pomodoro: PomodoroPage,
  stopwatch: StopwatchPage,
  mortgage: MortgagePage,
  holiday: HolidayPage,
  anniversary: AnniversaryPage,
  timezone: TimezonePage,
  emoji: EmojiPage,
  investment: InvestmentPage,
  bmi: BmiPage,
  json: JsonToolPage,
  base64: Base64ToolPage,
  url: UrlToolPage,
  timestamp: TimestampToolPage,
  color: ColorToolPage,
  color_scheme: ColorSchemePage,
  markdown_preview: MarkdownPage,
  sort_tool: SortPage,
  sql_formatter: SqlFormatterPage,
  xml_formatter: XmlFormatterPage,
  yaml_json: YamlJsonPage,
  number_base: NumberBasePage,
  password: PasswordPage,
  uuid: UuidToolPage,
  hash: HashToolPage,
  jwt: JwtToolPage,
  aes: AesPage,
  ip_tool: IpToolPage,
  diff: DiffToolPage,
  regex: RegexPage,
  html_entity: HtmlEntityPage,
  unicode: UnicodePage,
  cron: CronPage,
  text_case: TextCasePage,
  url_parser: UrlParserPage,
  drawing_board: DrawingBoardPage,
  regex_visualizer: RegexVisualizerPage,
  coloring_book: ColoringBookPage,
  md_notebook: MdNotebookPage,
  weather: WeatherPage,
  lunar_calendar: LunarCalendarPage,
  retirement: RetirementPage,
  horoscope: HoroscopePage,
};

const ToolPage: React.FC = () => {
  const router = useRouter();
  const toolId = router.params.toolId as string;
  const tool = useMemo(() => toolById(toolId), [toolId]);
  const ToolComponent = toolPages[toolId];

  // 注册分享功能（右上角菜单 → 好友 + 朋友圈）
  useToolShare(toolId);

  if (!tool) {
    return (
      <View className={styles.page}>
        <View className={styles.placeholder}>
          <Text className={styles.placeholderTitle}>未找到该工具</Text>
          <Text className={styles.placeholderDesc}>请从首页重新进入</Text>
        </View>
      </View>
    );
  }

  if (!ToolComponent) {
    return (
      <View className={styles.page}>
        <View className={styles.header}>
          <Text className={styles.toolName}>{tool.name}</Text>
          <Text className={styles.toolDesc}>{tool.description}</Text>
        </View>
        <View className={styles.placeholder}>
          <Text className={styles.placeholderTitle}>功能开发中</Text>
          <Text className={styles.placeholderDesc}>该工具的小程序版本正在开发中</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.toolContent}>
        <View className={styles.header}>
          <Text className={styles.toolName}>{tool.name}</Text>
          <Text className={styles.toolDesc}>{tool.description}</Text>
        </View>
        <ToolComponent />
      </View>
    </ScrollView>
  );
};

export default ToolPage;
