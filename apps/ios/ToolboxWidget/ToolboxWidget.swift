import WidgetKit
import SwiftUI

struct SimpleEntry: TimelineEntry {
    let date: Date
}

struct SimpleProvider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date())
    }
    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> Void) {
        completion(SimpleEntry(date: Date()))
    }
    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> Void) {
        let entry = SimpleEntry(date: Date())
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 24, to: Date())!
        completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
    }
}

struct SimpleWidgetEntryView: View {
    var entry: SimpleEntry

    var body: some View {
        Link(destination: URL(string: "toolbox://tool/calculator")!) {
            VStack {
                Image(systemName: "hammer.fill")
                    .font(.largeTitle)
                    .foregroundColor(.blue)
                Text("工具箱")
                    .font(.caption)
                    .fontWeight(.bold)
            }
            .containerBackground(.blue.gradient, for: .widget)
        }
    }
}

struct SimpleToolboxWidget: Widget {
    let kind: String = "com.toolbox.simple.widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: SimpleProvider()) { entry in
            SimpleWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("工具箱")
        .description("打开工具箱")
        .supportedFamilies([.systemSmall])
    }
}

#Preview(as: .systemSmall) {
    SimpleToolboxWidget()
} timeline: {
    SimpleEntry(date: Date())
}
