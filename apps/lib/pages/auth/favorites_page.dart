import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';
import '../../providers/auth_provider.dart';

/// 收藏页面 — 仅登录用户可见
class FavoritesPage extends StatelessWidget {
  final ValueChanged<String>? onOpenTool;

  const FavoritesPage({super.key, this.onOpenTool});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    if (!auth.isLoggedIn) {
      return const Center(child: Text('请先登录'));
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('我的收藏'),
      ),
      body: auth.favoriteEntries.isEmpty
          ? _buildEmptyState()
          : _buildFavoriteList(context, auth),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.star_border, size: 64, color: AppColors.neutral300),
          const SizedBox(height: 16),
          Text('还没有收藏的工具', style: TextStyle(fontSize: 16, color: AppColors.neutral400)),
          const SizedBox(height: 8),
          Text('在工具页点击星标收藏', style: TextStyle(fontSize: 13, color: AppColors.neutral400)),
        ],
      ),
    );
  }

  Widget _buildFavoriteList(BuildContext context, AuthProvider auth) {
    final byFolder = auth.favoritesByFolder;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 顶部文件夹管理区
          _FolderToolbar(auth: auth),
          const SizedBox(height: 8),
          ...byFolder.entries.map((entry) {
            return _FolderSection(
              folderName: entry.key,
              entries: entry.value,
              onOpenTool: onOpenTool,
            );
          }),
        ],
      ),
    );
  }
}

// ─── 顶部文件夹管理栏 ───

class _FolderToolbar extends StatelessWidget {
  final AuthProvider auth;

  const _FolderToolbar({required this.auth});

  @override
  Widget build(BuildContext context) {
    final realFolders = auth.folders.where((f) => f.name != '未分类').toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.folder_special_outlined, size: 16, color: AppColors.neutral400),
            const SizedBox(width: 4),
            const Text('文件夹', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.neutral400)),
          ],
        ),
        const SizedBox(height: 8),
        // 水平滚动文件夹列表
        SizedBox(
          height: 42,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: realFolders.length + 1, // +1 是新建按钮
            separatorBuilder: (_, _) => const SizedBox(width: 8),
            itemBuilder: (context, index) {
              if (index == 0) {
                // 新建文件夹按钮
                return _FolderChip(
                  label: '新建',
                  icon: Icons.add,
                  onTap: () => _showCreateFolderDialog(context, auth),
                );
              }
              final folder = realFolders[index - 1];
              return _FolderChip(
                label: folder.name,
                icon: Icons.folder,
                onTap: () {},
                onRename: () => _showRenameFolderDialog(context, auth, folder.name),
                onDelete: () => _confirmDeleteFolder(context, auth, folder.name),
              );
            },
          ),
        ),
        const Divider(height: 24),
      ],
    );
  }

  void _showCreateFolderDialog(BuildContext context, AuthProvider auth) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('新建文件夹'),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(
            hintText: '输入文件夹名称',
            border: OutlineInputBorder(),
          ),
          onSubmitted: (value) async {
            if (value.trim().isNotEmpty) {
              Navigator.of(ctx).pop();
              final err = await auth.createFolder(value.trim());
              if (err != null && context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(err)));
              }
            }
          },
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('取消')),
          FilledButton(
            onPressed: () async {
              final value = controller.text.trim();
              if (value.isNotEmpty) {
                Navigator.of(ctx).pop();
                final err = await auth.createFolder(value);
                if (err != null && context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(err)));
                }
              }
            },
            child: const Text('创建'),
          ),
        ],
      ),
    );
  }

  void _showRenameFolderDialog(BuildContext context, AuthProvider auth, String oldName) {
    final controller = TextEditingController(text: oldName);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('重命名文件夹'),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(border: OutlineInputBorder()),
          onSubmitted: (value) async {
            if (value.trim().isNotEmpty && value.trim() != oldName) {
              Navigator.of(ctx).pop();
              final err = await auth.renameFolder(oldName, value.trim());
              if (err != null && context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(err)));
              }
            }
          },
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('取消')),
          FilledButton(
            onPressed: () async {
              final value = controller.text.trim();
              if (value.isNotEmpty && value != oldName) {
                Navigator.of(ctx).pop();
                final err = await auth.renameFolder(oldName, value);
                if (err != null && context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(err)));
                }
              }
            },
            child: const Text('重命名'),
          ),
        ],
      ),
    );
  }

  void _confirmDeleteFolder(BuildContext context, AuthProvider auth, String name) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('删除文件夹'),
        content: Text('删除「$name」后，里面的收藏会自动移入"未分类"。'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('取消')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: AppColors.error),
            onPressed: () async {
              Navigator.of(ctx).pop();
              await auth.deleteFolder(name);
            },
            child: const Text('删除'),
          ),
        ],
      ),
    );
  }
}

/// 文件夹 Chip — 可点击、可长按重命名/删除
class _FolderChip extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;
  final VoidCallback? onRename;
  final VoidCallback? onDelete;

  const _FolderChip({
    required this.label,
    required this.icon,
    required this.onTap,
    this.onRename,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      onLongPress: (onRename != null || onDelete != null)
          ? () => _showActions(context)
          : null,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.neutral200),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: AppColors.warning),
            const SizedBox(width: 6),
            Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }

  void _showActions(BuildContext context) {
    showMenu(
      context: context,
      position: RelativeRect.fromLTRB(100, 100, 100, 100),
      items: [
        if (onRename != null)
          const PopupMenuItem(value: 'rename', child: Row(
            children: [Icon(Icons.edit_outlined, size: 16), SizedBox(width: 8), Text('重命名')],
          )),
        if (onDelete != null)
          const PopupMenuItem(value: 'delete', child: Row(
            children: [Icon(Icons.delete_outline, size: 16, color: AppColors.error), SizedBox(width: 8), Text('删除', style: TextStyle(color: AppColors.error))],
          )),
      ],
    ).then((action) {
      if (action == 'rename') onRename?.call();
      if (action == 'delete') onDelete?.call();
    });
  }
}

// ─── Folder Section ───

class _FolderSection extends StatefulWidget {
  final String folderName;
  final List<FavoriteEntry> entries;
  final ValueChanged<String>? onOpenTool;

  const _FolderSection({
    required this.folderName,
    required this.entries,
    this.onOpenTool,
  });

  @override
  State<_FolderSection> createState() => _FolderSectionState();
}

class _FolderSectionState extends State<_FolderSection> {
  bool _collapsed = false;

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          InkWell(
            onTap: () => setState(() => _collapsed = !_collapsed),
            borderRadius: BorderRadius.circular(8),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
              child: Row(
                children: [
                  Icon(
                    widget.folderName == '未分类'
                        ? Icons.folder_outlined
                        : Icons.folder,
                    size: 18,
                    color: AppColors.warning,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    widget.folderName,
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '${widget.entries.length}',
                    style: const TextStyle(fontSize: 12, color: AppColors.neutral400),
                  ),
                  const Spacer(),
                  Icon(
                    _collapsed ? Icons.expand_more : Icons.expand_less,
                    size: 20, color: AppColors.neutral400,
                  ),
                ],
              ),
            ),
          ),
          if (!_collapsed)
            ...widget.entries.map((entry) {
              final def = ToolRegistry.byId(entry.toolId);
              return _FavoriteItem(
                toolId: entry.toolId,
                name: def?.name ?? entry.toolId,
                icon: def?.icon ?? Icons.help_outline,
                onTap: () => widget.onOpenTool?.call(entry.toolId),
                onRemove: () => auth.toggleFavorite(entry.toolId),
                onMove: (folder) => auth.moveToFolder(entry.toolId, folder),
              );
            }),
        ],
      ),
    );
  }
}

// ─── Favorite Item ───

class _FavoriteItem extends StatelessWidget {
  final String toolId;
  final String name;
  final IconData icon;
  final VoidCallback onTap;
  final VoidCallback onRemove;
  final ValueChanged<String> onMove;

  const _FavoriteItem({
    required this.toolId,
    required this.name,
    required this.icon,
    required this.onTap,
    required this.onRemove,
    required this.onMove,
  });

  void _showMoveSheet(BuildContext context) {
    final auth = context.read<AuthProvider>();
    final folders = auth.folderNames;
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Padding(
              padding: EdgeInsets.all(16),
              child: Text('移动到文件夹', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
            ),
            const Divider(height: 1),
            ...folders.map((folder) => ListTile(
              leading: Icon(
                folder == '未分类' ? Icons.folder_outlined : Icons.folder,
                color: AppColors.warning,
                size: 20,
              ),
              title: Text(folder),
              onTap: () {
                Navigator.of(ctx).pop();
                final target = folder == '未分类' ? '' : folder;
                onMove(target);
              },
            )),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 4),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: Theme.of(context).dividerTheme.color ?? AppColors.neutral200,
          ),
        ),
        child: Row(
          children: [
            Icon(icon, size: 20, color: AppColors.brand500),
            const SizedBox(width: 12),
            Expanded(
              child: Text(name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
            ),
            PopupMenuButton<String>(
              iconSize: 18,
              onSelected: (action) {
                if (action == 'remove') onRemove();
                if (action == 'move') _showMoveSheet(context);
              },
              itemBuilder: (ctx) => [
                const PopupMenuItem(
                  value: 'move',
                  child: Row(
                    children: [
                      Icon(Icons.drive_file_move_outline, size: 16),
                      SizedBox(width: 8),
                      Text('移动到文件夹'),
                    ],
                  ),
                ),
                const PopupMenuItem(
                  value: 'remove',
                  child: Row(
                    children: [
                      Icon(Icons.delete_outline, size: 16, color: AppColors.error),
                      SizedBox(width: 8),
                      Text('取消收藏', style: TextStyle(color: AppColors.error)),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
