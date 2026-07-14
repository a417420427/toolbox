import 'package:flutter_test/flutter_test.dart';

import 'package:toolbox_app/main.dart';

void main() {
  testWidgets('App builds successfully', (WidgetTester tester) async {
    await tester.pumpWidget(const ToolboxApp());
    // Verify the app renders without crash
    expect(find.byType(ToolboxApp), findsOneWidget);
  });
}
