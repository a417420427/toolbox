import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';
import '../../providers/auth_provider.dart';

class AuthPage extends StatefulWidget {
  const AuthPage({super.key});

  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  bool _isLogin = true;
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _nameCtrl = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _nameCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final email = _emailCtrl.text.trim();
    final password = _passwordCtrl.text;

    if (email.isEmpty || password.isEmpty) {
      _showError('请填写邮箱和密码');
      return;
    }

    if (!RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(email)) {
      _showError('邮箱格式不正确');
      return;
    }

    if (password.length < 6) {
      _showError('密码至少 6 位');
      return;
    }

    final auth = context.read<AuthProvider>();
    String? error;

    if (_isLogin) {
      error = await auth.login(email, password);
    } else {
      error = await auth.register(email, password, name: _nameCtrl.text.trim());
    }

    if (error != null && mounted) {
      _showError(error);
    }
  }

  void _showError(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: AppColors.error,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    if (auth.isLoggedIn) {
      return _buildProfile(auth);
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const SizedBox(height: 48),
          Icon(Icons.build_circle, size: 64, color: AppColors.brand500),
          const SizedBox(height: 16),
          Text(
            '工具箱',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 4),
          const Text('登录以同步收藏和设置', style: TextStyle(color: AppColors.neutral400)),
          const SizedBox(height: 48),

          // Tab
          Row(
            children: [
              Expanded(
                child: _tabButton('登录', _isLogin, () => setState(() => _isLogin = true)),
              ),
              Expanded(
                child: _tabButton('注册', !_isLogin, () => setState(() => _isLogin = false)),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // 昵称（注册时）
          if (!_isLogin) ...[
            TextField(
              controller: _nameCtrl,
              decoration: const InputDecoration(
                labelText: '昵称（可选）',
                prefixIcon: Icon(Icons.person_outline),
              ),
            ),
            const SizedBox(height: 16),
          ],

          // 邮箱
          TextField(
            controller: _emailCtrl,
            decoration: const InputDecoration(
              labelText: '邮箱',
              prefixIcon: Icon(Icons.email_outlined),
            ),
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 16),

          // 密码
          TextField(
            controller: _passwordCtrl,
            obscureText: _obscurePassword,
            decoration: InputDecoration(
              labelText: '密码',
              prefixIcon: const Icon(Icons.lock_outline),
              suffixIcon: IconButton(
                icon: Icon(_obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined),
                onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
              ),
            ),
            textInputAction: TextInputAction.done,
            onSubmitted: (_) => _submit(),
          ),
          const SizedBox(height: 24),

          SizedBox(
            width: double.infinity,
            height: 48,
            child: FilledButton(
              onPressed: auth.loading ? null : _submit,
              child: auth.loading
                  ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                  : Text(_isLogin ? '登录' : '注册', style: const TextStyle(fontSize: 16)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfile(AuthProvider auth) {
    final user = auth.user;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const SizedBox(height: 32),
          CircleAvatar(
            radius: 40,
            backgroundColor: AppColors.brand100,
            child: Text(
              (user?['name'] as String? ?? '?')[0].toUpperCase(),
              style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w600, color: AppColors.brand600),
            ),
          ),
          const SizedBox(height: 16),
          Text(user?['name'] as String? ?? '', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 4),
          Text(user?['email'] as String? ?? '', style: const TextStyle(color: AppColors.neutral400)),
          const SizedBox(height: 32),

          // 预留设置区域
          Card(
            margin: EdgeInsets.zero,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _infoRow(Icons.info_outline, '版本', '1.0.0'),
                  const Divider(height: 16),
                  _infoRow(Icons.storage_outlined, '后端地址', 'localhost:3000'),
                ],
              ),
            ),
          ),

          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () => auth.logout(),
              icon: const Icon(Icons.logout),
              label: const Text('退出登录'),
              style: OutlinedButton.styleFrom(foregroundColor: AppColors.error),
            ),
          ),
          const SizedBox(height: 48),
        ],
      ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 18, color: AppColors.neutral400),
        const SizedBox(width: 12),
        Text(label, style: const TextStyle(fontSize: 14, color: AppColors.neutral500)),
        const Spacer(),
        Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
      ],
    );
  }

  Widget _tabButton(String label, bool active, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: active ? AppColors.brand500 : Colors.transparent,
              width: 2,
            ),
          ),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              fontSize: 16,
              fontWeight: active ? FontWeight.w600 : FontWeight.w400,
              color: active ? AppColors.brand500 : AppColors.neutral400,
            ),
          ),
        ),
      ),
    );
  }
}
