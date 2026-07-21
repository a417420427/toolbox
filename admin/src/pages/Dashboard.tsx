import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAdminCategories,
  getAdminTools,
  createCategory,
  updateCategory,
  deleteCategory,
  createTool,
  updateTool,
  deleteTool,
  type Category,
  type ToolItem,
} from '../api/tools';

const CATEGORY_ICONS = ['cat_tools', 'smile', 'pen-tool', 'braces', 'globe', 'database', 'clock', 'shield', 'code', 'search', 'link', 'file-code'];
const TOOL_ICONS = ['smile', 'pen-tool', 'paintbrush', 'dice', 'ruler', 'clock', 'stopwatch', 'timer', 'bar-chart', 'home', 'calendar-check', 'heart', 'globe', 'trending-up', 'activity', 'braces', 'file-code', 'link', 'palette', 'database', 'code', 'shuffle', 'hash', 'key', 'fingerprint', 'shield', 'lock', 'file-diff', 'search', 'abc', 'text', 'git-branch', 'book', 'sort'];
const CAT_COLORS = ['#f43f5e', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#6366f1', '#ec4899', '#14b8a6', '#84cc16', '#06b6d4'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ── 弹窗状态 ──
  const [modal, setModal] = useState<{ type: string; data?: any } | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const showSuccess = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, ts] = await Promise.all([getAdminCategories(), getAdminTools()]);
      setCategories(cats);
      setTools(ts);
      setError('');
    } catch (err: any) {
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        localStorage.removeItem('toolbox_admin_token');
        navigate('/login');
        return;
      }
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('toolbox_admin_token');
    localStorage.removeItem('toolbox_admin_user');
    navigate('/login');
  };

  // ── 分类操作 ──
  const handleSaveCategory = async (data: any) => {
    try {
      if (modal?.type === 'cat-new') {
        await createCategory(data);
        showSuccess('分类已创建');
      } else {
        await updateCategory(data.key, data);
        showSuccess('分类已更新');
      }
      setModal(null);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (key: string) => {
    if (!confirm(`确认删除分类「${key}」？分类下必须没有工具才能删除。`)) return;
    try {
      await deleteCategory(key);
      showSuccess('分类已删除');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ── 工具操作 ──
  const handleSaveTool = async (data: any) => {
    try {
      if (modal?.type === 'tool-new') {
        await createTool(data);
        showSuccess('工具已创建');
      } else {
        await updateTool(data.toolId, data);
        showSuccess('工具已更新');
      }
      setModal(null);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteTool = async (toolId: string) => {
    if (!confirm(`确认删除工具「${toolId}」？`)) return;
    try {
      await deleteTool(toolId);
      showSuccess('工具已删除');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleTool = async (tool: ToolItem) => {
    try {
      await updateTool(tool.toolId, { enabled: !tool.enabled });
      showSuccess(tool.enabled ? '已禁用' : '已启用');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleCategory = async (cat: Category) => {
    try {
      await updateCategory(cat.key, { enabled: !cat.enabled });
      showSuccess(cat.enabled ? '已禁用' : '已启用');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toolsByCategory = (key: string) => tools.filter(t => t.category === key);

  if (loading) return <div style={centerStyle}><p>加载中...</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Header */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '14px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22, lineHeight: 1 }}>🧰</span>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
            工具箱管理后台
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => setModal({ type: 'cat-new' })} style={btnPrimary}>
            ＋ 新增分类
          </button>
          <button onClick={() => setModal({ type: 'tool-new' })} style={btnPrimary}>
            ＋ 新增工具
          </button>
          <button onClick={handleLogout} style={btnGhost}>退出</button>
        </div>
      </header>

      <div style={{ padding: '20px 32px', maxWidth: 1200, margin: '0 auto' }}>
        {/* 提示条 */}
        {error && (
          <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #fecaca' }}>
            <span>{error}</span>
            <span onClick={() => setError('')} style={{ cursor: 'pointer', fontWeight: 700, fontSize: 16, lineHeight: 1 }}>×</span>
          </div>
        )}
        {success && (
          <div style={{ background: '#f0fdf4', color: '#15803d', padding: '10px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16, border: '1px solid #bbf7d0' }}>
            ✓ {success}
          </div>
        )}

        {/* 分类卡片列表 */}
        {categories.map(cat => {
          const catTools = toolsByCategory(cat.key);
          return (
            <div key={cat.key} style={{
              background: '#fff',
              borderRadius: 12,
              marginBottom: 20,
              border: `1px solid ${cat.enabled ? '#e2e8f0' : '#f1f5f9'}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              overflow: 'hidden',
              opacity: cat.enabled ? 1 : 0.55,
              transition: 'opacity 0.2s',
            }}>
              {/* 分类头部 */}
              <div
                onClick={() => {
                  setCollapsed(prev => {
                    const next = new Set(prev);
                    if (next.has(cat.key)) next.delete(cat.key); else next.add(cat.key);
                    return next;
                  });
                }}
                style={{ cursor: 'pointer', userSelect: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 20px',
                background: 'linear-gradient(to right, #fafbfc, #fff)',
                borderBottom: '1px solid #e2e8f0',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    display: 'inline-flex',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: cat.color,
                    boxShadow: `0 0 0 3px ${cat.color}22`,
                  }} />
                  <strong style={{ fontSize: 15, color: '#0f172a' }}>{cat.label}</strong>
                  <code style={{ fontSize: 11, color: '#94a3b8', background: '#f1f5f9', padding: '1px 6px', borderRadius: 4 }}>{cat.key}</code>
                  <span style={{ fontSize: 12, color: '#64748b', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.description}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>排序 {cat.sortOrder}</span>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: cat.enabled ? '#dcfce7' : '#fef2f2',
                    color: cat.enabled ? '#16a34a' : '#dc2626',
                  }}>
                    {cat.enabled ? '已启用' : '已禁用'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button onClick={e => { e.stopPropagation(); handleToggleCategory(cat); }} style={btnSmall}>
                    {cat.enabled ? '禁用' : '启用'}
                  </button>
                  <button onClick={e => { e.stopPropagation(); setModal({ type: 'cat-edit', data: cat }); }} style={btnSmall}>
                    编辑
                  </button>
                  <button onClick={e => { e.stopPropagation(); handleDeleteCategory(cat.key); }} style={{ ...btnSmall, color: '#dc2626' }}>
                    删除
                  </button>
                  <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 4, transition: 'transform 0.2s', display: 'inline-block', transform: collapsed.has(cat.key) ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                    ▾
                  </span>
                </div>
              </div>

              {/* 工具列表 */}
              {!collapsed.has(cat.key) && (
              <div style={{ padding: '8px 16px' }}>
                {catTools.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: 13 }}>
                    该分类暂无工具，点击右上角「新增工具」添加
                  </div>
                ) : (
                  catTools.map(tool => (
                    <div key={tool.toolId} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      borderRadius: 8,
                      margin: '6px 0',
                      background: tool.enabled ? '#fff' : '#fafbfc',
                      opacity: tool.enabled ? 1 : 0.55,
                      border: `1px solid ${tool.enabled ? '#f1f5f9' : '#e2e8f0'}`,
                      transition: 'all 0.15s',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                        <span style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#0f172a',
                          minWidth: 90,
                        }}>
                          {tool.name}
                        </span>
                        <code style={{
                          fontSize: 11,
                          color: '#64748b',
                          background: '#f1f5f9',
                          padding: '1px 6px',
                          borderRadius: 4,
                          whiteSpace: 'nowrap',
                        }}>
                          {tool.toolId}
                        </code>
                        <span style={{
                          fontSize: 12,
                          color: '#64748b',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                          minWidth: 0,
                        }}>
                          {tool.description}
                        </span>
                        <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                          icon: {tool.icon} · 排序 {tool.sortOrder}
                        </span>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 10,
                          whiteSpace: 'nowrap',
                          background: tool.enabled ? '#dcfce7' : '#fef2f2',
                          color: tool.enabled ? '#16a34a' : '#dc2626',
                        }}>
                          {tool.enabled ? '启用' : '禁用'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 4, marginLeft: 12, flexShrink: 0 }}>
                        <button onClick={() => handleToggleTool(tool)} style={btnSmall}>
                          {tool.enabled ? '禁用' : '启用'}
                        </button>
                        <button onClick={() => setModal({ type: 'tool-edit', data: tool })} style={btnSmall}>
                          编辑
                        </button>
                        <button onClick={() => handleDeleteTool(tool.toolId)} style={{ ...btnSmall, color: '#dc2626' }}>
                          删除
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 弹窗 */}
      {modal && (
        <ModalForm
          type={modal.type}
          data={modal.data}
          categories={categories}
          onSave={modal.type.startsWith('cat') ? handleSaveCategory : handleSaveTool}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════
//  Modal 表单
// ══════════════════════════════════

function ModalForm({
  type,
  data,
  categories,
  onSave,
  onClose,
}: {
  type: string;
  data: any;
  categories: Category[];
  onSave: (data: any) => void;
  onClose: () => void;
}) {
  const isCategory = type.startsWith('cat');
  const isNew = type.endsWith('new');

  const [form, setForm] = useState<any>(() => {
    if (isNew) {
      return isCategory
        ? { key: '', label: '', description: '', icon: 'cat_tools', color: '#3b82f6', sortOrder: 0 }
        : { toolId: '', name: '', description: '', icon: 'tools', category: categories[0]?.key || '', sortOrder: 0, enabled: true };
    }
    return { ...data };
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, backdropFilter: 'blur(2px)',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 14, padding: 28, width: 480,
          maxWidth: '90vw', maxHeight: '80vh', overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
              {isNew ? `新建${isCategory ? '分类' : '工具'}` : `编辑${isCategory ? '分类' : '工具'}`}
            </h2>
            <span onClick={onClose} style={{ cursor: 'pointer', fontSize: 20, color: '#94a3b8', lineHeight: 1 }}>×</span>
          </div>

          {isCategory ? (
            <>
              <ModalField label="Key" value={form.key} onChange={v => handleChange('key', v)} disabled={!isNew} placeholder="fun / tools / dev" />
              <ModalField label="名称" value={form.label} onChange={v => handleChange('label', v)} placeholder="娱乐工具" />
              <ModalField label="描述" value={form.description} onChange={v => handleChange('description', v)} placeholder="星座、画板、填色等" />
              <ModalSelect label="图标" value={form.icon} options={CATEGORY_ICONS} onChange={v => handleChange('icon', v)} />
              <ModalSelect label="颜色" value={form.color} options={CAT_COLORS} onChange={v => handleChange('color', v)} renderOption={v => (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', background: v }} />
                  {v}
                </span>
              )} />
              <ModalField label="排序" type="number" value={form.sortOrder} onChange={v => handleChange('sortOrder', Number(v))} />
            </>
          ) : (
            <>
              <ModalField label="ToolId" value={form.toolId} onChange={v => handleChange('toolId', v)} disabled={!isNew} placeholder="json / base64 / uuid" />
              <ModalField label="名称" value={form.name} onChange={v => handleChange('name', v)} placeholder="JSON 工具" />
              <ModalField label="描述" value={form.description} onChange={v => handleChange('description', v)} placeholder="格式化 / 压缩 / 校验" />
              <ModalSelect label="所属分类" value={form.category} options={categories.map(c => c.key)} onChange={v => handleChange('category', v)} renderOption={v => {
                const cat = categories.find(c => c.key === v);
                return <>{cat?.label || v} <span style={{ color: '#94a3b8' }}>({v})</span></>;
              }} />
              <ModalSelect label="图标" value={form.icon} options={TOOL_ICONS} onChange={v => handleChange('icon', v)} />
              <ModalField label="排序" type="number" value={form.sortOrder} onChange={v => handleChange('sortOrder', Number(v))} />
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#475569' }}>
                  <input type="checkbox" checked={form.enabled !== false} onChange={e => handleChange('enabled', e.target.checked)} />
                  创建后立即启用
                </label>
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
            <button type="button" onClick={onClose} style={btnGhost}>取消</button>
            <button type="submit" style={btnPrimary}>保存</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── 表单小组件 ──

function ModalField({ label, value, onChange, type = 'text', disabled = false, placeholder }: {
  label: string; value: any; onChange: (v: string) => void; type?: string; disabled?: boolean; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4, color: '#334155' }}>{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8,
          fontSize: 13, boxSizing: 'border-box', background: disabled ? '#f8fafc' : '#fff',
          outline: 'none', transition: 'border-color 0.15s',
        }}
        onFocus={e => { e.target.style.borderColor = '#3b82f6'; }}
        onBlur={e => { e.target.style.borderColor = '#cbd5e1'; }}
      />
    </div>
  );
}

function ModalSelect({ label, value, options, onChange, renderOption }: {
  label: string; value: any; options: string[]; onChange: (v: string) => void; renderOption?: (v: string) => React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4, color: '#334155' }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8,
          fontSize: 13, boxSizing: 'border-box', background: '#fff', outline: 'none',
        }}
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{renderOption ? renderOption(opt) : opt}</option>
        ))}
      </select>
    </div>
  );
}

// ── 样式 ──

const centerStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',
  background: '#f1f5f9',
};

const btnPrimary: React.CSSProperties = {
  padding: '7px 16px', fontSize: 13, fontWeight: 600, background: '#3b82f6',
  color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer',
  transition: 'background 0.15s',
};

const btnGhost: React.CSSProperties = {
  padding: '7px 16px', fontSize: 13, fontWeight: 600,
  background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0',
  borderRadius: 8, cursor: 'pointer',
};

const btnSmall: React.CSSProperties = {
  padding: '3px 10px', fontSize: 11, fontWeight: 600,
  background: '#fff', color: '#475569',
  border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer',
  transition: 'all 0.15s',
};
