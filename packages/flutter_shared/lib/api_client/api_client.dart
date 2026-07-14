import 'package:dio/dio.dart';

/// API 客户端 — 注册/登录 + 收藏
class ApiClient {
  static final ApiClient _instance = ApiClient._();
  factory ApiClient() => _instance;
  ApiClient._();

  static const String _baseUrl = 'http://localhost:3000/api';

  final Dio _dio = Dio(BaseOptions(
    baseUrl: _baseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
    headers: {'Content-Type': 'application/json'},
  ));

  String? _token;

  Dio get dio => _dio;

  /// 设置 JWT token
  void setToken(String? token) {
    _token = token;
    if (token != null) {
      _dio.options.headers['Authorization'] = 'Bearer $token';
    } else {
      _dio.options.headers.remove('Authorization');
    }
  }

  bool get isAuthenticated => _token != null;

  // ── Auth ──

  Future<({String? error, Map<String, dynamic>? data})> register({
    required String email,
    required String password,
    String? name,
  }) async {
    try {
      final res = await _dio.post('/auth/register', data: {
        'email': email,
        'password': password,
        if (name != null) 'name': name,
      });
      return (error: null, data: res.data as Map<String, dynamic>);
    } on DioException catch (e) {
      return (error: _errorMessage(e), data: null);
    }
  }

  Future<({String? error, Map<String, dynamic>? data})> login({
    required String email,
    required String password,
  }) async {
    try {
      final res = await _dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });
      final data = res.data as Map<String, dynamic>;
      setToken(data['token'] as String?);
      return (error: null, data: data);
    } on DioException catch (e) {
      return (error: _errorMessage(e), data: null);
    }
  }

  Future<({String? error, Map<String, dynamic>? data})> getProfile() async {
    try {
      final res = await _dio.get('/auth/profile');
      return (error: null, data: res.data as Map<String, dynamic>);
    } on DioException catch (e) {
      return (error: _errorMessage(e), data: null);
    }
  }

  // ── Favorites ──

  /// 安全地将 API 返回的 List 转为 List<Map<String, dynamic>>，兼容旧版纯 string[]
  List<Map<String, dynamic>> _parseFavoritesList(dynamic data) {
    final list = data as List;
    return list.map((item) {
      if (item is Map) return Map<String, dynamic>.from(item);
      // 兼容旧格式：纯 string（toolId），转成 { toolId, folder: '' }
      return {'toolId': item.toString(), 'folder': '', 'sortOrder': 0};
    }).toList();
  }

  /// 收藏项响应
  Future<({String? error, List<Map<String, dynamic>>? favorites})> getFavorites() async {
    try {
      final res = await _dio.get('/user/favorites');
      return (error: null, favorites: _parseFavoritesList(res.data));
    } on DioException catch (e) {
      return (error: _errorMessage(e), favorites: null);
    }
  }

  Future<({String? error, List<Map<String, dynamic>>? favorites})> addFavorite(String toolId, {String? folder}) async {
    try {
      final res = await _dio.post('/user/favorites', data: {
        'toolId': toolId,
        if (folder != null && folder.isNotEmpty) 'folder': folder,
      });
      return (error: null, favorites: _parseFavoritesList(res.data));
    } on DioException catch (e) {
      return (error: _errorMessage(e), favorites: null);
    }
  }

  Future<({String? error, List<Map<String, dynamic>>? favorites})> removeFavorite(String toolId) async {
    try {
      final res = await _dio.delete('/user/favorites/$toolId');
      return (error: null, favorites: _parseFavoritesList(res.data));
    } on DioException catch (e) {
      return (error: _errorMessage(e), favorites: null);
    }
  }

  Future<({String? error, List<Map<String, dynamic>>? favorites})> reorderFavorites(List<String> toolIds) async {
    try {
      final res = await _dio.put('/user/favorites/reorder', data: {'toolIds': toolIds});
      return (error: null, favorites: _parseFavoritesList(res.data));
    } on DioException catch (e) {
      return (error: _errorMessage(e), favorites: null);
    }
  }

  Future<({String? error, List<Map<String, dynamic>>? favorites})> moveFavorite(String toolId, String folder) async {
    try {
      final res = await _dio.put('/user/favorites/$toolId/move', data: {'folder': folder});
      return (error: null, favorites: _parseFavoritesList(res.data));
    } on DioException catch (e) {
      return (error: _errorMessage(e), favorites: null);
    }
  }

  // ── Folders ──

  Future<({String? error, List<Map<String, dynamic>>? folders})> getFolders() async {
    try {
      final res = await _dio.get('/user/favorites/folders');
      return (error: null, folders: (res.data as List).cast<Map<String, dynamic>>());
    } on DioException catch (e) {
      return (error: _errorMessage(e), folders: null);
    }
  }

  Future<({String? error, Map<String, dynamic>? folder})> createFolder(String name) async {
    try {
      final res = await _dio.post('/user/favorites/folders', data: {'name': name});
      return (error: null, folder: res.data as Map<String, dynamic>);
    } on DioException catch (e) {
      return (error: _errorMessage(e), folder: null);
    }
  }

  Future<String?> renameFolder(String oldName, String newName) async {
    try {
      await _dio.put('/user/favorites/folders/rename', data: {
        'oldName': oldName,
        'newName': newName,
      });
      return null;
    } on DioException catch (e) {
      return _errorMessage(e);
    }
  }

  Future<String?> deleteFolder(String name) async {
    try {
      await _dio.delete('/user/favorites/folders/$name');
      return null;
    } on DioException catch (e) {
      return _errorMessage(e);
    }
  }

  String _errorMessage(DioException e) {
    if (e.response?.data is Map) {
      return (e.response!.data as Map)['message']?.toString() ?? e.message ?? '请求失败';
    }
    return e.message ?? '网络错误';
  }
}
