import 'package:flutter/foundation.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// 收藏夹项
class FavoriteEntry {
  final String toolId;
  final String folder; // '' 表示未分类
  final int sortOrder;

  const FavoriteEntry({
    required this.toolId,
    this.folder = '',
    this.sortOrder = 0,
  });

  Map<String, dynamic> toJson() => {
    'toolId': toolId,
    'folder': folder,
    'sortOrder': sortOrder,
  };

  factory FavoriteEntry.fromJson(Map<String, dynamic> json) => FavoriteEntry(
    toolId: json['toolId'] as String,
    folder: json['folder'] as String? ?? '',
    sortOrder: json['sortOrder'] as int? ?? 0,
  );

  FavoriteEntry copyWith({String? folder, int? sortOrder}) => FavoriteEntry(
    toolId: toolId,
    folder: folder ?? this.folder,
    sortOrder: sortOrder ?? this.sortOrder,
  );
}

/// 收藏文件夹
class FavoriteFolder {
  final String id;
  final String name;
  final int sortOrder;

  const FavoriteFolder({
    required this.id,
    required this.name,
    this.sortOrder = 0,
  });

  factory FavoriteFolder.fromJson(Map<String, dynamic> json) => FavoriteFolder(
    id: json['id'] as String,
    name: json['name'] as String,
    sortOrder: json['sortOrder'] as int? ?? 0,
  );
}

/// 全局认证状态
class AuthProvider extends ChangeNotifier {
  final ApiClient _api = ApiClient();

  Map<String, dynamic>? _user;
  List<FavoriteEntry> _favorites = [];
  List<FavoriteFolder> _folders = [];
  bool _loading = false;
  String? _error;

  Map<String, dynamic>? get user => _user;
  bool get isLoggedIn => _user != null;
  List<FavoriteEntry> get favoriteEntries => _favorites;
  List<FavoriteFolder> get folders => _folders;
  bool get loading => _loading;
  String? get error => _error;
  ApiClient get api => _api;

  /// 收藏的工具 ID 集合（快速查询用）
  Set<String> get favoriteIds => _favorites.map((e) => e.toolId).toSet();

  /// 所有文件夹名称（包含"未分类"）
  List<String> get folderNames {
    final names = _folders.map((f) => f.name).toList()..sort();
    return ['未分类', ...names];
  }

  /// 按文件夹分组
  Map<String, List<FavoriteEntry>> get favoritesByFolder {
    final map = <String, List<FavoriteEntry>>{};
    for (final entry in _favorites) {
      final folder = entry.folder.isEmpty ? '未分类' : entry.folder;
      map.putIfAbsent(folder, () => []).add(entry);
    }
    // 保持文件夹顺序
    final ordered = <String, List<FavoriteEntry>>{};
    final seen = <String>{};
    for (final f in _folders) {
      if (map.containsKey(f.name)) {
        ordered[f.name] = map[f.name]!;
        seen.add(f.name);
      }
    }
    if (map.containsKey('未分类')) {
      ordered['未分类'] = map['未分类']!;
      seen.add('未分类');
    }
    // 其他游离的
    for (final entry in map.entries) {
      if (!seen.contains(entry.key)) {
        ordered[entry.key] = entry.value;
      }
    }
    return ordered;
  }

  /// 尝试从本地恢复登录状态
  Future<void> tryRestore() async {}

  Future<String?> login(String email, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();

    final r = await _api.login(email: email, password: password);
    _loading = false;

    if (r.error != null) {
      _error = r.error;
      notifyListeners();
      return r.error;
    }

    _user = r.data?['user'] as Map<String, dynamic>?;
    if (_user != null) {
      _api.setToken(r.data?['token'] as String?);
      await _loadFavorites();
      await _loadFolders();
    }
    notifyListeners();
    return null;
  }

  Future<String?> register(String email, String password, {String? name}) async {
    _loading = true;
    _error = null;
    notifyListeners();

    final r = await _api.register(email: email, password: password, name: name);
    _loading = false;

    if (r.error != null) {
      _error = r.error;
      notifyListeners();
      return r.error;
    }

    _user = r.data?['user'] as Map<String, dynamic>?;
    if (_user != null) {
      _api.setToken(r.data?['token'] as String?);
      await _loadFavorites();
      await _loadFolders();
    }
    notifyListeners();
    return null;
  }

  void logout() {
    _user = null;
    _favorites = [];
    _folders = [];
    _api.setToken(null);
    _error = null;
    notifyListeners();
  }

  Future<void> _loadFavorites() async {
    final r = await _api.getFavorites();
    if (r.favorites != null) {
      _favorites = r.favorites!.map((json) => FavoriteEntry.fromJson(json)).toList();
    }
  }

  Future<void> _loadFolders() async {
    final r = await _api.getFolders();
    if (r.folders != null) {
      _folders = r.folders!.map((json) => FavoriteFolder.fromJson(json)).toList();
    }
  }

  /// 切换收藏（不带文件夹选择时，收藏到"未分类"）
  Future<void> toggleFavorite(String toolId, {String? folder}) async {
    if (!isLoggedIn) return;

    final existing = _favorites.where((e) => e.toolId == toolId).toList();
    if (existing.isNotEmpty) {
      // 已收藏 -> 取消
      _favorites.removeWhere((e) => e.toolId == toolId);
      notifyListeners();
      await _api.removeFavorite(toolId);
    } else {
      // 新增收藏
      final targetFolder = folder ?? '';
      _favorites.add(FavoriteEntry(toolId: toolId, folder: targetFolder));
      notifyListeners();
      await _api.addFavorite(toolId, folder: targetFolder.isEmpty ? null : targetFolder);
    }
  }

  /// 将收藏移到指定文件夹
  Future<void> moveToFolder(String toolId, String folder) async {
    if (!isLoggedIn) return;
    final idx = _favorites.indexWhere((e) => e.toolId == toolId);
    if (idx == -1) return;
    _favorites[idx] = _favorites[idx].copyWith(folder: folder);
    notifyListeners();
    await _api.moveFavorite(toolId, folder);
  }

  /// 创建收藏文件夹
  Future<String?> createFolder(String name) async {
    if (!isLoggedIn) return '未登录';
    final r = await _api.createFolder(name);
    if (r.folder != null) {
      _folders.add(FavoriteFolder.fromJson(r.folder!));
      notifyListeners();
      return null;
    }
    return r.error;
  }

  /// 重命名收藏文件夹
  Future<String?> renameFolder(String oldName, String newName) async {
    if (!isLoggedIn) return '未登录';
    final err = await _api.renameFolder(oldName, newName);
    if (err != null) return err;
    // 本地同步
    final idx = _folders.indexWhere((f) => f.name == oldName);
    if (idx != -1) {
      _folders[idx] = FavoriteFolder(
        id: _folders[idx].id,
        name: newName,
        sortOrder: _folders[idx].sortOrder,
      );
    }
    // 更新收藏项中的 folder 名
    for (var i = 0; i < _favorites.length; i++) {
      if (_favorites[i].folder == oldName) {
        _favorites[i] = _favorites[i].copyWith(folder: newName);
      }
    }
    notifyListeners();
    return null;
  }

  /// 删除收藏文件夹（内部收藏移入未分类）
  Future<String?> deleteFolder(String name) async {
    if (!isLoggedIn) return '未登录';
    final err = await _api.deleteFolder(name);
    if (err != null) return err;
    _folders.removeWhere((f) => f.name == name);
    // 更新收藏项 folder 为空
    for (var i = 0; i < _favorites.length; i++) {
      if (_favorites[i].folder == name) {
        _favorites[i] = _favorites[i].copyWith(folder: '');
      }
    }
    notifyListeners();
    return null;
  }

  bool isFavorite(String toolId) => _favorites.any((e) => e.toolId == toolId);
}
