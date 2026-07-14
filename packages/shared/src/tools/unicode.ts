/**
 * Unicode 码点查询工具
 *
 * 输入字符/码点，查询 Unicode 信息。
 * 使用内置的 Unicode 属性，无外部数据源。
 */

export interface UnicodeCharInfo {
  /** 字符本身 */
  char: string;
  /** Unicode 码点（十六进制，如 U+4E2D） */
  codePoint: string;
  /** 码点数值 */
  codePointValue: number;
  /** 十进制编号 */
  decimal: number;
  /** Unicode 区块 */
  block: string;
  /** 字符分类（如 "Lu" 大写字母、"Ll" 小写字母） */
  generalCategory: string;
  /** 分类名称 */
  categoryName: string;
  /** 名称（根据标准，简化版） */
  name?: string;
}

/**
 * Unicode 区块定义
 */
const BLOCKS: [number, number, string][] = [
  [0x0000, 0x007F, "基本拉丁字母 (ASCII)"],
  [0x0080, 0x00FF, "拉丁字母补充-1"],
  [0x0100, 0x017F, "拉丁字母扩展-A"],
  [0x0180, 0x024F, "拉丁字母扩展-B"],
  [0x0250, 0x02AF, "国际音标扩展"],
  [0x02B0, 0x02FF, "修饰字母带符号"],
  [0x0300, 0x036F, "组合附加符号"],
  [0x0370, 0x03FF, "希腊字母及科普特字母"],
  [0x0400, 0x04FF, "西里尔字母"],
  [0x0500, 0x052F, "西里尔字母补充"],
  [0x0530, 0x058F, "亚美尼亚字母"],
  [0x0590, 0x05FF, "希伯来字母"],
  [0x0600, 0x06FF, "阿拉伯字母"],
  [0x0700, 0x074F, "叙利亚字母"],
  [0x0750, 0x077F, "阿拉伯字母补充"],
  [0x0780, 0x07BF, "它拿字母"],
  [0x07C0, 0x07FF, "恩科字母"],
  [0x0900, 0x097F, "天城文"],
  [0x0980, 0x09FF, "孟加拉文"],
  [0x0A00, 0x0A7F, "古木基文"],
  [0x0A80, 0x0AFF, "古吉拉特文"],
  [0x0B00, 0x0B7F, "奥里亚文"],
  [0x0B80, 0x0BFF, "泰米尔文"],
  [0x0C00, 0x0C7F, "泰卢固文"],
  [0x0C80, 0x0CFF, "卡纳达文"],
  [0x0D00, 0x0D7F, "马拉雅拉姆文"],
  [0x0D80, 0x0DFF, "僧伽罗文"],
  [0x0E00, 0x0E7F, "泰文"],
  [0x0E80, 0x0EFF, "老挝文"],
  [0x0F00, 0x0FFF, "藏文"],
  [0x1000, 0x109F, "缅甸文"],
  [0x10A0, 0x10FF, "格鲁吉亚字母"],
  [0x1100, 0x11FF, "谚文字母"],
  [0x1200, 0x137F, "吉兹字母"],
  [0x13A0, 0x13FF, "切罗基字母"],
  [0x1400, 0x167F, "统一加拿大原住民音节文字"],
  [0x1680, 0x169F, "欧甘字母"],
  [0x16A0, 0x16FF, "卢恩字母"],
  [0x1700, 0x171F, "他加禄文"],
  [0x1720, 0x173F, "哈努诺文"],
  [0x1740, 0x175F, "布迪文"],
  [0x1760, 0x177F, "巴布亚文"],
  [0x1780, 0x17FF, "高棉文"],
  [0x1800, 0x18AF, "蒙古文"],
  [0x1900, 0x194F, "林布文"],
  [0x1950, 0x197F, "泰文扩展"],
  [0x1980, 0x19DF, "新傣仂文"],
  [0x1A00, 0x1A1F, "布吉文"],
  [0x1AB0, 0x1AFF, "组合附加符号扩展"],
  [0x1B00, 0x1B7F, "巴厘文"],
  [0x1B80, 0x1BBF, "巽他文"],
  [0x1BC0, 0x1BFF, "巴塔克文"],
  [0x1C00, 0x1C4F, "雷布查文"],
  [0x1C50, 0x1C7F, "奥纳加文"],
  [0x1D00, 0x1D7F, "语音学扩展"],
  [0x1D80, 0x1DBF, "语音学扩展补充"],
  [0x1DC0, 0x1DFF, "组合附加符号补充"],
  [0x1E00, 0x1EFF, "拉丁字母扩展附加"],
  [0x1F00, 0x1FFF, "希腊字母扩展"],
  [0x2000, 0x206F, "一般标点符号"],
  [0x2070, 0x209F, "上标和下标"],
  [0x20A0, 0x20CF, "货币符号"],
  [0x20D0, 0x20FF, "组合用附加符号"],
  [0x2100, 0x214F, "字母符号"],
  [0x2150, 0x218F, "数字形式"],
  [0x2190, 0x21FF, "箭头"],
  [0x2200, 0x22FF, "数学运算符"],
  [0x2300, 0x23FF, "杂项工业符号"],
  [0x2400, 0x243F, "控制图片"],
  [0x2440, 0x245F, "光学识别"],
  [0x2460, 0x24FF, "带括号字母数字"],
  [0x2500, 0x257F, "制表符"],
  [0x2580, 0x259F, "区块符号"],
  [0x25A0, 0x25FF, "几何形状"],
  [0x2600, 0x26FF, "杂项符号"],
  [0x2700, 0x27BF, "茶花符号（装饰符号）"],
  [0x27C0, 0x27EF, "杂项数学符号-A"],
  [0x27F0, 0x27FF, "补充箭头-A"],
  [0x2800, 0x28FF, "盲文模式"],
  [0x2900, 0x297F, "补充箭头-B"],
  [0x2980, 0x29FF, "杂项数学符号-B"],
  [0x2A00, 0x2AFF, "补充数学运算符"],
  [0x2B00, 0x2BFF, "杂项符号和箭头"],
  [0x2C00, 0x2C5F, "格拉哥里字母"],
  [0x2C60, 0x2C7F, "拉丁字母扩展-C"],
  [0x2C80, 0x2CFF, "科普特字母"],
  [0x2D00, 0x2D2F, "格鲁吉亚字母补充"],
  [0x2D30, 0x2D7F, "提非纳文"],
  [0x2D80, 0x2DDF, "埃塞俄比亚字母扩展"],
  [0x2E00, 0x2E7F, "补充标点符号"],
  [0x2E80, 0x2EFF, "CJK 部首补充"],
  [0x2F00, 0x2FDF, "康熙部首"],
  [0x2FF0, 0x2FFF, "表意文字描述符"],
  [0x3000, 0x303F, "CJK 符号和标点"],
  [0x3040, 0x309F, "日文平假名"],
  [0x30A0, 0x30FF, "日文片假名"],
  [0x3100, 0x312F, "注音字母"],
  [0x3130, 0x318F, "谚文兼容字母"],
  [0x3190, 0x319F, "汉字用扩展符号"],
  [0x31A0, 0x31BF, "注音字母扩展"],
  [0x31C0, 0x31EF, "CJK 笔画"],
  [0x31F0, 0x31FF, "日文片假名语音学扩展"],
  [0x3200, 0x32FF, "带括号 CJK 字母和月份"],
  [0x3300, 0x33FF, "CJK 兼容符号"],
  [0x3400, 0x4DBF, "CJK 统一表意文字扩展 A"],
  [0x4DC0, 0x4DFF, "易经六十四卦符号"],
  [0x4E00, 0x9FFF, "CJK 统一表意文字"],
  [0xA000, 0xA4CF, "彝文音节"],
  [0xA4D0, 0xA4FF, "彝文字根"],
  [0xA500, 0xA63F, "瓦伊文"],
  [0xA640, 0xA69F, "西里尔字母扩展-B"],
  [0xA700, 0xA71F, "声调修饰字母"],
  [0xA720, 0xA7FF, "拉丁字母扩展-D"],
  [0xA800, 0xA82F, "锡尔赫特文"],
  [0xA840, 0xA87F, "菲利普文"],
  [0xA880, 0xA8DF, "克耶文"],
  [0xA8E0, 0xA8FF, "天城文扩展"],
  [0xA900, 0xA92F, "克耶李文"],
  [0xA930, 0xA95F, "勒姜文"],
  [0xA960, 0xA97F, "谚文字母扩展-A"],
  [0xA980, 0xA9DF, "爪哇文"],
  [0xAA00, 0xAA5F, "查克马文"],
  [0xAA60, 0xAA7F, "曼尼普尔文"],
  [0xAA80, 0xAADF, "曼尼普尔文扩展"],
  [0xAB00, 0xAB2F, "埃塞俄比亚字母扩展-A"],
  [0xAB30, 0xAB6F, "拉丁字母扩展-E"],
  [0xAC00, 0xD7AF, "谚文音节"],
  [0xD7B0, 0xD7FF, "谚文字母扩展-B"],
  [0xE000, 0xF8FF, "私用区"],
  [0xF900, 0xFAFF, "CJK 兼容表意文字"],
  [0xFB00, 0xFB4F, "字母表达形式"],
  [0xFB50, 0xFDFF, "阿拉伯表达形式-A"],
  [0xFE00, 0xFE0F, "异体字选择符"],
  [0xFE10, 0xFE1F, "竖排形式"],
  [0xFE20, 0xFE2F, "组合半标记"],
  [0xFE30, 0xFE4F, "CJK 兼容形式"],
  [0xFE50, 0xFE6F, "小变体形式"],
  [0xFE70, 0xFEFF, "阿拉伯表达形式-B"],
  [0xFF00, 0xFFEF, "半角及全角形式"],
  [0xFFF0, 0xFFFF, "特殊符号"],
  [0x10000, 0x1007F, "线形文字 B 音节"],
  [0x10080, 0x100FF, "线形文字 B 表意文字"],
  [0x10100, 0x1013F, "爱琴海数字"],
  [0x10140, 0x1018F, "古希腊数字"],
  [0x10190, 0x101CF, "古代符号"],
  [0x101D0, 0x101FF, "法伊斯特斯圆盘"],
  [0x10280, 0x1029F, "吕西亚文"],
  [0x102A0, 0x102DF, "卡里亚文"],
  [0x102E0, 0x102FF, "科普特字母数字"],
  [0x10300, 0x1032F, "古意大利字母"],
  [0x10330, 0x1034F, "哥特字母"],
  [0x10350, 0x1037F, "古老彼尔姆文"],
  [0x10380, 0x1039F, "乌加里特文"],
  [0x103A0, 0x103DF, "古代波斯文"],
  [0x10400, 0x1044F, "德瑟雷特字母"],
  [0x10450, 0x1047F, "沙维安字母"],
  [0x10480, 0x104AF, "奥斯曼亚文"],
  [0x104B0, 0x104FF, "欧塞奇文"],
  [0x10500, 0x1052F, "埃尔巴桑文"],
  [0x10530, 0x1056F, "高加索阿尔巴尼亚文"],
  [0x10600, 0x1077F, "线形文字 A"],
  [0x10780, 0x107BF, "拉丁字母扩展-F"],
  [0x10800, 0x1083F, "西巴伊文"],
  [0x10840, 0x1085F, "古北阿拉伯文"],
  [0x10860, 0x1087F, "帕尔迈拉文"],
  [0x10880, 0x108AF, "纳巴泰文"],
  [0x108E0, 0x108FF, "哈特兰文"],
  [0x10900, 0x1091F, "腓尼基字母"],
  [0x10920, 0x1093F, "利迪亚文"],
  [0x10980, 0x1099F, "麦罗埃文圣书体"],
  [0x109A0, 0x109FF, "麦罗埃文草书体"],
  [0x10A00, 0x10A5F, "库施特文"],
  [0x10A60, 0x10A7F, "古南阿拉伯文"],
  [0x10A80, 0x10A9F, "古北阿拉伯文"],
  [0x10AC0, 0x10AFF, "玛尼文"],
  [0x10B00, 0x10B3F, "阿维斯塔文"],
  [0x10B40, 0x10B5F, "巴拉望文"],
  [0x10B60, 0x10B7F, "巴克特里亚文"],
  [0x10B80, 0x10BAF, "克哈罗斯文"],
  [0x10C00, 0x10C4F, "古突厥文"],
  [0x10C80, 0x10CFF, "古匈牙利文"],
  [0x10D00, 0x10D3F, "哈奈文"],
  [0x10E60, 0x10E7F, "鲁米数字"],
  [0x10E80, 0x10EBF, "雅兹迪文"],
  [0x10F00, 0x10F2F, "古粟特文"],
  [0x10F30, 0x10F6F, "粟特文"],
  [0x10F70, 0x10FAF, "花剌子模文"],
  [0x10FB0, 0x10FDF, "埃利迈斯文"],
  [0x10FE0, 0x10FFF, "西夏文"],
  [0x11000, 0x1107F, "婆罗米文"],
  [0x11080, 0x110CF, "凯提文"],
  [0x110D0, 0x110FF, "索拉僧平文"],
  [0x11100, 0x1114F, "查克马文"],
  [0x11150, 0x1117F, "玛哈贾尼文"],
  [0x11180, 0x111DF, "沙罗达文"],
  [0x111E0, 0x111FF, "锡兰僧伽罗文"],
  [0x11200, 0x1124F, "可吉文"],
  [0x11280, 0x112AF, "穆尔塔尼文"],
  [0x112B0, 0x112FF, "库达瓦迪文"],
  [0x11300, 0x1137F, "格兰塔文"],
  [0x11400, 0x1147F, "尼瓦尔文"],
  [0x11480, 0x114DF, "提尔胡塔文"],
  [0x11580, 0x115FF, "悉昙文"],
  [0x11600, 0x1165F, "莫迪文"],
  [0x11660, 0x1167F, "蒙古文补充"],
  [0x11680, 0x116CF, "塔克里文"],
  [0x11700, 0x1173F, "阿洪姆文"],
  [0x11800, 0x1184F, "多格拉文"],
  [0x118A0, 0x118FF, "望加锡文"],
  [0x11900, 0x1195F, "贡贾尔贡德语"],
  [0x119A0, 0x119FF, "努瓦布文"],
  [0x11A00, 0x11A4F, "扎纳巴扎尔方字"],
  [0x11A50, 0x11AAF, "索永布文"],
  [0x11AB0, 0x11ABF, "加拿大音节扩展"],
  [0x11AC0, 0x11AFF, "包钦豪文"],
  [0x11B00, 0x11B5F, "德维那加利扩展"],
  [0x11C00, 0x11C6F, "拜克苏基文"],
  [0x11C70, 0x11CBF, "玛尔申文"],
  [0x11D00, 0x11D5F, "马萨拉姆贡德语"],
  [0x11D60, 0x11DAF, "贡贾拉贡德语"],
  [0x11EE0, 0x11EFF, "马肯文"],
  [0x11F00, 0x11F5F, "卡维文"],
  [0x11FB0, 0x11FBF, "利苏苏文"],
  [0x11FC0, 0x11FFF, "泰米尔文补充"],
  [0x12000, 0x123FF, "楔形文字"],
  [0x12400, 0x1247F, "楔形文字数字-标点"],
  [0x12480, 0x1254F, "早期楔形文字"],
  [0x12F90, 0x12FFF, "埃及圣书体扩展-A"],
  [0x13000, 0x1342F, "埃及圣书体"],
  [0x13430, 0x1345F, "埃及圣书体格式控制"],
  [0x14400, 0x1467F, "安纳托利亚象形文字"],
  [0x16800, 0x16A3F, "八思巴文"],
  [0x16A40, 0x16A6F, "苗文"],
  [0x16A70, 0x16ACF, "苗文补充"],
  [0x16AD0, 0x16AFF, "巴纹"],
  [0x16B00, 0x16B8F, "帕拉文"],
  [0x16C00, 0x16C6F, "西夏文补充"],
  [0x16D40, 0x16D7F, "西里尔字母扩展"],
  [0x16E00, 0x16E3F, "姆罗文"],
  [0x16F00, 0x16F9F, "门德文"],
  [0x16FE0, 0x16FFF, "表意符号和标点"],
  [0x17000, 0x187FF, "西夏文"],
  [0x18800, 0x18AFF, "西夏文补充"],
  [0x18B00, 0x18CFF, "契丹大字"],
  [0x18D00, 0x18D8F, "西夏文扩展"],
  [0x1AFF0, 0x1AFFF, "谚文字母扩展"],
  [0x1B000, 0x1B0FF, "假名补充"],
  [0x1B100, 0x1B12F, "假名扩展-A"],
  [0x1B130, 0x1B16F, "小假名扩展"],
  [0x1B170, 0x1B2FF, "女书"],
  [0x1BC00, 0x1BC9F, "杜普洛扬文"],
  [0x1BCA0, 0x1BCAF, "速记格式控制"],
  [0x1CF00, 0x1CF2F, "苏美尔-阿卡德楔形文字"],
  [0x1D000, 0x1D0FF, "拜占庭音乐符号"],
  [0x1D100, 0x1D1FF, "音乐符号"],
  [0x1D200, 0x1D24F, "古希腊音乐符号"],
  [0x1D2E0, 0x1D2FF, "马雅数字"],
  [0x1D300, 0x1D35F, "易经符号"],
  [0x1D360, 0x1D37F, "十进制计数符号"],
  [0x1D400, 0x1D7FF, "数学字母数字符号"],
  [0x1D800, 0x1DAAF, "萨顿手语符号"],
  [0x1DA00, 0x1DAFF, "萨顿手语符号补充"],
  [0x1DF00, 0x1DFFF, "拉丁字母扩展-G"],
  [0x1E000, 0x1E02F, "格拉哥里字母补充"],
  [0x1E100, 0x1E14F, "尼亚凯恩普埃语"],
  [0x1E290, 0x1E2BF, "托托文"],
  [0x1E2C0, 0x1E2FF, "万乔文"],
  [0x1E4D0, 0x1E4FF, "亚齐文"],
  [0x1E5D0, 0x1E5FF, "阿萨姆文"],
  [0x1E7E0, 0x1E7FF, "埃塞俄比亚字母扩展-B"],
  [0x1E800, 0x1E8DF, "孟南文"],
  [0x1E900, 0x1E95F, "梅德法伊德林文"],
  [0x1EC70, 0x1ECBF, "印度西亚克数字"],
  [0x1ED00, 0x1ED4F, "纳古尔数字"],
  [0x1EE00, 0x1EEFF, "阿拉伯数学字母符号"],
  [0x1F000, 0x1F02F, "麻将牌"],
  [0x1F030, 0x1F09F, "多米诺骨牌"],
  [0x1F0A0, 0x1F0FF, "扑克牌"],
  [0x1F100, 0x1F1FF, "带括号字母数字补充"],
  [0x1F200, 0x1F2FF, "带括号汉字补充"],
  [0x1F300, 0x1F5FF, "杂项符号和象形文字"],
  [0x1F600, 0x1F64F, "表情符号（Emoji）"],
  [0x1F650, 0x1F67F, "装饰符号"],
  [0x1F680, 0x1F6FF, "交通和地图符号"],
  [0x1F700, 0x1F77F, "炼金术符号"],
  [0x1F780, 0x1F7FF, "几何形状扩展"],
  [0x1F800, 0x1F8FF, "补充箭头-C"],
  [0x1F900, 0x1F9FF, "补充符号和象形文字"],
  [0x1FA00, 0x1FA6F, "国际象棋符号"],
  [0x1FA70, 0x1FAFF, "象形文字和符号扩展-A"],
  [0x1FB00, 0x1FBFF, "方块元素补充"],
  [0x20000, 0x2A6DF, "CJK 统一表意文字扩展 B"],
  [0x2A700, 0x2B73F, "CJK 统一表意文字扩展 C"],
  [0x2B740, 0x2B81F, "CJK 统一表意文字扩展 D"],
  [0x2B820, 0x2CEAF, "CJK 统一表意文字扩展 E"],
  [0x2CEB0, 0x2EBE0, "CJK 统一表意文字扩展 F"],
  [0x2EBF0, 0x2EE5F, "CJK 统一表意文字扩展 G"],
  [0x2F800, 0x2FA1F, "CJK 兼容表意文字补充"],
  [0x30000, 0x3134F, "CJK 统一表意文字扩展 H"],
  [0x31350, 0x323AF, "CJK 统一表意文字扩展 I"],
  [0xE0100, 0xE01EF, "异体字选择符补充"],
  [0xF0000, 0xFFFFF, "补充私用区-A"],
  [0x100000, 0x10FFFF, "补充私用区-B"],
];

const CATEGORY_NAMES: Record<string, string> = {
  Lu: "大写字母",
  Ll: "小写字母",
  Lt: "词首大写字母",
  Lm: "修饰字母",
  Lo: "其他字母",
  Mn: "非空白标记",
  Mc: "空白标记",
  Me: "封闭标记",
  Nd: "十进制数字",
  Nl: "字母数字",
  No: "其他数字",
  Pc: "连接符标点",
  Pd: "连接号标点",
  Ps: "左标点",
  Pe: "右标点",
  Pi: "首引号",
  Pf: "尾引号",
  Po: "其他标点",
  Sm: "数学符号",
  Sc: "货币符号",
  Sk: "修饰符符号",
  So: "其他符号",
  Zs: "空格分隔符",
  Zl: "行分隔符",
  Zp: "段分隔符",
  Cc: "控制字符",
  Cf: "格式字符",
  Cs: "代理项",
  Co: "私用字符",
  Cn: "未分配字符",
};

/**
 * 根据码点值查询 Unicode 信息。
 */
export function queryByCodePoint(codePoint: number): UnicodeCharInfo {
  if (codePoint < 0 || codePoint > 0x10FFFF) {
    throw new Error(`无效的码点值: U+${codePoint.toString(16).toUpperCase()}`);
  }

  const hex = `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`;
  const char = String.fromCodePoint(codePoint);

  let block = "未知区块";
  for (const [start, end, name] of BLOCKS) {
    if (codePoint >= start && codePoint <= end) {
      block = name;
      break;
    }
  }

  // 简化版 General Category（通过字符特性推断）
  const generalCategory = getGeneralCategory(codePoint, char);
  const categoryName = CATEGORY_NAMES[generalCategory] || "未知";

  // 对于 CJK 字符，附加一个简化的"名称"
  let name: string | undefined;
  if (codePoint >= 0x4E00 && codePoint <= 0x9FFF) {
    name = `CJK 统一表意文字 U+${codePoint.toString(16).toUpperCase()}`;
  } else if (codePoint >= 0x3400 && codePoint <= 0x4DBF) {
    name = `CJK 统一表意文字扩展 A U+${codePoint.toString(16).toUpperCase()}`;
  } else if (codePoint >= 0x1F300 && codePoint <= 0x1F9FF) {
    name = "Emoji";
  }

  return {
    char,
    codePoint: hex,
    codePointValue: codePoint,
    decimal: codePoint,
    block,
    generalCategory,
    categoryName,
    name,
  };
}

/**
 * 输入单个字符，查询其 Unicode 信息。
 */
export function queryByChar(char: string): UnicodeCharInfo {
  const codePoint = char.codePointAt(0);
  if (codePoint === undefined) {
    throw new Error("无效的字符输入");
  }
  return queryByCodePoint(codePoint);
}

/**
 * 批量查询一段文本中所有字符的 Unicode 信息。
 */
export function queryText(input: string): UnicodeCharInfo[] {
  const chars = [...input];
  return chars.map((ch) => queryByChar(ch));
}

/**
 * 查询码点支持：支持 U+XXXX / 0xXXXX / 十进制格式。
 */
export function queryByCodePointString(input: string): UnicodeCharInfo {
  const trimmed = input.trim();

  // U+XXXX 或 u+XXXX 格式
  const uMatch = trimmed.match(/^[Uu]\+([0-9a-fA-F]+)$/);
  if (uMatch) {
    return queryByCodePoint(parseInt(uMatch[1], 16));
  }

  // 0xXXXX 格式
  const hexMatch = trimmed.match(/^0x([0-9a-fA-F]+)$/);
  if (hexMatch) {
    return queryByCodePoint(parseInt(hexMatch[1], 16));
  }

  // 纯十进制数字
  const decMatch = trimmed.match(/^\d+$/);
  if (decMatch) {
    return queryByCodePoint(parseInt(decMatch[0], 10));
  }

  throw new Error(`无法解析的码点格式: ${trimmed}。支持 U+XXXX、0xXXXX、十进制`);
}

// ---- 辅助 ----

function getGeneralCategory(codePoint: number, char: string): string {
  if (codePoint <= 0x1F || (codePoint >= 0x7F && codePoint <= 0x9F)) return "Cc";
  if (codePoint === 0x20) return "Zs";

  // 通过 Unicode 正则特性推断
  if (/^\p{Lu}$/u.test(char)) return "Lu";
  if (/^\p{Ll}$/u.test(char)) return "Ll";
  if (/^\p{Lt}$/u.test(char)) return "Lt";
  if (/^\p{Lm}$/u.test(char)) return "Lm";
  if (/^\p{Lo}$/u.test(char)) return "Lo";
  if (/^\p{Nd}$/u.test(char)) return "Nd";
  if (/^\p{Nl}$/u.test(char)) return "Nl";
  if (/^\p{No}$/u.test(char)) return "No";
  if (/^\p{Pd}$/u.test(char)) return "Pd";
  if (/^\p{Ps}$/u.test(char)) return "Ps";
  if (/^\p{Pe}$/u.test(char)) return "Pe";
  if (/^\p{Pi}$/u.test(char)) return "Pi";
  if (/^\p{Pf}$/u.test(char)) return "Pf";
  if (/^\p{Po}$/u.test(char)) return "Po";
  if (/^\p{Sm}$/u.test(char)) return "Sm";
  if (/^\p{Sc}$/u.test(char)) return "Sc";
  if (/^\p{Sk}$/u.test(char)) return "Sk";
  if (/^\p{So}$/u.test(char)) return "So";
  if (/^\p{Mn}$/u.test(char)) return "Mn";
  if (/^\p{Mc}$/u.test(char)) return "Mc";
  if (/^\p{Zs}$/u.test(char)) return "Zs";
  if (/^\p{Zl}$/u.test(char)) return "Zl";
  if (/^\p{Zp}$/u.test(char)) return "Zp";
  if (/^\p{Cf}$/u.test(char)) return "Cf";
  if (/^\p{Pc}$/u.test(char)) return "Pc";

  return "So";
}
