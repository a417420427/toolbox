import AppIntents
import Foundation
import SwiftUI
import WidgetKit

// MARK: - 工具定义

/// 可配置的工具项
struct ConfigurableTool: Identifiable, Hashable {
    let id: String
    let name: String
    let icon: String
    let color: Color

    var deepLinkURL: URL {
        URL(string: "toolbox://tool/\(id)")!
    }
}

// MARK: - 工具列表

let allTools: [ConfigurableTool] = [
    ConfigurableTool(id: "calculator",     name: "计算器",     icon: "function",                     color: .blue),
    ConfigurableTool(id: "unit_converter", name: "单位换算",   icon: "arrow.triangle.swap",          color: .green),
    ConfigurableTool(id: "date_calc",      name: "日期计算",   icon: "calendar",                     color: .orange),
    ConfigurableTool(id: "countdown",      name: "倒计时",     icon: "timer",                        color: .red),
    ConfigurableTool(id: "random_selector",name: "随机选择器", icon: "dice",                         color: .purple),
    ConfigurableTool(id: "text_stats",     name: "字数统计",   icon: "text.alignleft",               color: .teal),
    ConfigurableTool(id: "json",           name: "JSON",       icon: "curlybraces",                  color: .orange),
    ConfigurableTool(id: "base64",         name: "Base64",     icon: "lock.shield",                  color: .purple),
    ConfigurableTool(id: "url",            name: "URL 编解码", icon: "link",                         color: .blue),
    ConfigurableTool(id: "timestamp",      name: "时间戳",     icon: "clock",                        color: .teal),
    ConfigurableTool(id: "color",          name: "颜色工具",   icon: "paintpalette",                 color: .pink),
    ConfigurableTool(id: "uuid",           name: "UUID",       icon: "key",                          color: .indigo),
    ConfigurableTool(id: "hash",           name: "哈希",       icon: "ellipsis.circle",              color: .gray),
    ConfigurableTool(id: "jwt",            name: "JWT 解码器", icon: "person.badge.key",             color: .red),
    ConfigurableTool(id: "text_case",      name: "文字格式",   icon: "textformat",                   color: .cyan),
    ConfigurableTool(id: "regex",          name: "正则测试器", icon: "magnifyingglass",              color: .mint),
    ConfigurableTool(id: "html_entity",    name: "HTML 实体",  icon: "chevron.left.forwardslash.chevron.right", color: .brown),
    ConfigurableTool(id: "unicode",        name: "Unicode",    icon: "character",                    color: .indigo),
    ConfigurableTool(id: "cron",           name: "Cron 解析器",icon: "calendar.day.timeline.left",    color: .orange),
    ConfigurableTool(id: "sql_formatter",  name: "SQL 格式化", icon: "tablecells",                   color: .blue),
    ConfigurableTool(id: "yaml_json",      name: "YAML↔JSON",  icon: "arrow.triangle.branch",        color: .green),
    ConfigurableTool(id: "xml_formatter",  name: "XML 格式化", icon: "chevron.left.slash.chevron.right", color: .purple),
    ConfigurableTool(id: "emoji",          name: "Emoji",      icon: "face.smiling",                 color: .yellow),
    ConfigurableTool(id: "investment",     name: "投资计算",   icon: "chart.line.uptrend.xyaxis",    color: .green),
    ConfigurableTool(id: "qr_code",        name: "二维码",     icon: "qrcode",                       color: .black),
    ConfigurableTool(id: "number_base",    name: "进制转换",   icon: "number",                       color: .cyan),
    ConfigurableTool(id: "password",       name: "密码生成",   icon: "lock",                         color: .red),
    ConfigurableTool(id: "ip_tool",        name: "IP 工具",    icon: "network",                      color: .blue),
    ConfigurableTool(id: "diff",           name: "文本对比",   icon: "doc.text.magnifyingglass",     color: .orange),
    ConfigurableTool(id: "pomodoro",       name: "番茄钟",     icon: "stopwatch",                    color: .cyan),
    ConfigurableTool(id: "stopwatch",      name: "秒表",       icon: "timer",                        color: .teal),
    ConfigurableTool(id: "mortgage",       name: "房贷计算器", icon: "house",                        color: .brown),
    ConfigurableTool(id: "holiday",        name: "节假日",     icon: "calendar.badge.checkmark",     color: .red),
    ConfigurableTool(id: "anniversary",    name: "纪念日",     icon: "gift",                         color: .pink),
    ConfigurableTool(id: "timezone",       name: "世界时区",   icon: "globe",                        color: .blue),
    ConfigurableTool(id: "bmi",            name: "健康指标",   icon: "heart",                        color: .green),
    ConfigurableTool(id: "markdown_preview",name: "Markdown",  icon: "doc.text",                     color: .purple),
    ConfigurableTool(id: "sort_tool",      name: "排序/去重",  icon: "arrow.up.arrow.down",          color: .indigo),
    ConfigurableTool(id: "url_parser",     name: "URL 解析器", icon: "link",                         color: .cyan),
    ConfigurableTool(id: "aes",            name: "AES 加解密", icon: "lock.rectangle",               color: .indigo),
]

/// 通过 ID 查找工具
func toolById(_ id: String) -> ConfigurableTool? {
    allTools.first { $0.id == id }
}

// MARK: - 小组件配置 Intent

/// 使用 String 参数，避免 AppEnum 协议复杂性
struct ToolboxWidgetConfigurationIntent: WidgetConfigurationIntent {
    static let title: LocalizedStringResource = "选择工具"
    static let description: LocalizedStringResource = "选择小组件上显示的工具"

    @Parameter(title: "工具", default: "calculator")
    var toolId: String

    var selectedTool: ConfigurableTool {
        toolById(toolId) ?? allTools[0]
    }
}
