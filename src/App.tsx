/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Settings, 
  Eye, 
  Code, 
  Download, 
  Copy, 
  ExternalLink, 
  Palette, 
  Type,
  Layout,
  Maximize2,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IndexItem, GlobalSettings } from './types';
import { FONTS, DEFAULT_SETTINGS, INITIAL_DATA } from './constants';
import { generateFullHTML } from './lib/exporter';

export default function App() {
  const [items, setItems] = useState<IndexItem[]>(INITIAL_DATA);
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [showCode, setShowCode] = useState(false);
  const [previewSize, setPreviewSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const addItem = (parentId?: string) => {
    const newItem: IndexItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nuovo Elemento',
      children: [],
      isOpen: false,
      url: '#'
    };

    if (!parentId) {
      setItems([...items, newItem]);
    } else {
      const updateChildren = (list: IndexItem[]): IndexItem[] => {
        return list.map(item => {
          if (item.id === parentId) {
            return { ...item, children: [...item.children, newItem], isOpen: true };
          }
          return { ...item, children: updateChildren(item.children) };
        });
      };
      setItems(updateChildren(items));
    }
  };

  const deleteItem = (id: string) => {
    const removeItem = (list: IndexItem[]): IndexItem[] => {
      return list.filter(item => item.id !== id).map(item => ({
        ...item,
        children: removeItem(item.children)
      }));
    };
    setItems(removeItem(items));
  };

  const updateItem = (id: string, updates: Partial<IndexItem>) => {
    const update = (list: IndexItem[]): IndexItem[] => {
      return list.map(item => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        return { ...item, children: update(item.children) };
      });
    };
    setItems(update(items));
  };

  const toggleItem = (id: string) => {
    const toggle = (list: IndexItem[]): IndexItem[] => {
      return list.map(item => {
        if (item.id === id) {
          return { ...item, isOpen: !item.isOpen };
        }
        return { ...item, children: toggle(item.children) };
      });
    };
    setItems(toggle(items));
  };

  const fullHTML = useMemo(() => generateFullHTML(items, settings), [items, settings]);

  const downloadHTML = () => {
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'indice-multimediale.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullHTML);
    alert('Codice copiato negli appunti!');
  };

  const previewFrameWidth = {
    mobile: 'max-w-[375px]',
    tablet: 'max-w-[768px]',
    desktop: 'max-w-full'
  };

  const totalItems = useMemo(() => {
    const count = (list: IndexItem[]): number => 
      list.reduce((acc, item) => acc + 1 + count(item.children), 0);
    return count(items);
  }, [items]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900" id="app-root">
      {/* Header */}
      <header className="h-14 flex-shrink-0 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-10" id="main-header">
        <div className="flex items-center gap-3" id="logo-container">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold" id="logo-icon">I</div>
          <h1 className="font-bold text-lg tracking-tight" id="app-title">
            HyperIndex <span className="text-slate-400 font-normal text-sm ml-2 italic">v2.4 — Multimedia Indexer</span>
          </h1>
        </div>

        <div className="flex items-center gap-3" id="header-actions">
          <div className="flex bg-slate-100 rounded-md p-0.5 mr-2" id="view-toggles">
            <button 
              onClick={() => setPreviewSize('mobile')}
              className={`p-1 rounded transition-all ${previewSize === 'mobile' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              id="btn-mobile-view"
            >
              <Smartphone size={16} />
            </button>
            <button 
              onClick={() => setPreviewSize('tablet')}
              className={`p-1 rounded transition-all ${previewSize === 'tablet' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              id="btn-tablet-view"
            >
              <Tablet size={16} />
            </button>
            <button 
              onClick={() => setPreviewSize('desktop')}
              className={`p-1 rounded transition-all ${previewSize === 'desktop' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              id="btn-desktop-view"
            >
              <Monitor size={16} />
            </button>
          </div>
          <button 
            onClick={() => setShowCode(true)}
            className="btn-secondary flex items-center gap-2"
            id="btn-export"
          >
            <Code size={16} />
            <span>Show Source</span>
          </button>
          <button 
            onClick={downloadHTML}
            className="btn-primary flex items-center gap-2" 
            id="btn-save"
          >
            <Download size={16} />
            <span>Export HTML</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden" id="main-content">
        {/* Left Sidebar: Structure */}
        <aside className="w-72 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col" id="structure-sidebar">
          <div className="p-4 flex items-center justify-between border-b border-slate-100" id="sidebar-header">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Structure</h2>
            <button 
              onClick={() => addItem()}
              className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold"
            >
              + Add Section
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-1" id="items-list">
            {items.map(item => (
              <IndexItemEditor 
                key={item.id} 
                item={item} 
                onUpdate={updateItem} 
                onDelete={deleteItem} 
                onToggle={toggleItem}
                onAddChild={(id) => addItem(id)}
              />
            ))}
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50" id="active-selection">
            <div className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-tighter">Usage Statistics</div>
            <div className="p-3 bg-white border border-slate-200 rounded text-xs leading-relaxed shadow-sm">
              <strong>Total Nodes:</strong> {totalItems}<br/>
              <strong>Status:</strong> <span className="text-indigo-600 font-bold">Draft Ready</span>
            </div>
          </div>
        </aside>

        {/* Center: Appearance & Code Snippet */}
        <section className="flex-1 bg-white flex flex-col p-6 overflow-hidden shadow-inner" id="editor-section">
          <div className="grid grid-cols-2 gap-8 h-full">
            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Global Theme</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {(['minimal', 'technical', 'brutalist', 'atmospheric', 'editorial'] as const).map(t => (
                      <button 
                        key={t}
                        onClick={() => setSettings({...settings, theme: t})}
                        className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded border transition-all ${settings.theme === t ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Typography & Fonts</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">Base Font</label>
                      <select 
                        value={settings.fontFamily}
                        onChange={(e) => setSettings({...settings, fontFamily: e.target.value})}
                        className="w-full text-sm border border-slate-200 rounded bg-slate-50 p-2"
                      >
                        {FONTS.map(font => <option key={font} value={font}>{font}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">Title Size</label>
                      <select 
                        value={settings.titleFontSize}
                        onChange={(e) => setSettings({...settings, titleFontSize: e.target.value})}
                        className="w-full text-sm border border-slate-200 rounded bg-slate-50 p-2"
                      >
                        <option value="1rem">Small</option>
                        <option value="1.125rem">Medium</option>
                        <option value="1.25rem">Large</option>
                        <option value="1.5rem">Extra Large</option>
                        <option value="2rem">Huge</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Background & Colors</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">Accent Color</label>
                      <div className="flex gap-2">
                        <input 
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                          className="w-9 h-9 border-2 border-slate-200 rounded cursor-pointer p-0 overflow-hidden"
                        />
                        <div className="text-xs font-mono flex items-center text-slate-400">{settings.primaryColor}</div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">Background Type</label>
                      <div className="flex bg-slate-100 rounded-md p-0.5">
                        <button 
                          onClick={() => setSettings({...settings, bgType: 'solid'})}
                          className={`flex-1 py-1 text-[10px] uppercase font-bold rounded ${settings.bgType === 'solid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                        >
                          Solid
                        </button>
                        <button 
                          onClick={() => setSettings({...settings, bgType: 'gradient'})}
                          className={`flex-1 py-1 text-[10px] uppercase font-bold rounded ${settings.bgType === 'gradient' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                        >
                          Grad
                        </button>
                        <button 
                          onClick={() => setSettings({...settings, bgType: 'mesh'})}
                          className={`flex-1 py-1 text-[10px] uppercase font-bold rounded ${settings.bgType === 'mesh' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                        >
                          Mesh
                        </button>
                      </div>
                    </div>
                  </div>
                  {settings.bgType === 'gradient' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">Gradient CSS</label>
                      <input 
                        value={settings.bgGradient}
                        onChange={(e) => setSettings({...settings, bgGradient: e.target.value})}
                        className="w-full text-[10px] font-mono border border-slate-200 rounded p-2 bg-slate-50"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Border Radius: {settings.borderRadius}</label>
                    <input 
                      type="range" min="0" max="40" 
                      value={parseInt(settings.borderRadius)}
                      onChange={(e) => setSettings({...settings, borderRadius: `${e.target.value}px`})}
                      className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Container Spacing: {settings.spacing}</label>
                    <input 
                      type="range" min="8" max="80" 
                      value={parseInt(settings.spacing)}
                      onChange={(e) => setSettings({...settings, spacing: `${e.target.value}px`})}
                      className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">Animation</label>
                      <select 
                        value={settings.animationType}
                        onChange={(e) => setSettings({...settings, animationType: e.target.value as any})}
                        className="w-full text-sm border border-slate-200 rounded bg-slate-50 p-2"
                      >
                        <option value="none">None</option>
                        <option value="fade">Fade</option>
                        <option value="slide">Slide</option>
                        <option value="bounce">Bounce</option>
                        <option value="zoom">Zoom</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">Item Shape</label>
                      <select 
                        value={settings.itemShape}
                        onChange={(e) => setSettings({...settings, itemShape: e.target.value as any})}
                        className="w-full text-sm border border-slate-200 rounded bg-slate-50 p-2"
                      >
                        <option value="square">Square</option>
                        <option value="rounded">Rounded</option>
                        <option value="pill">Pill</option>
                        <option value="skew">Skewed</option>
                        <option value="organic">Organic</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">Separator</label>
                      <select 
                        value={settings.borderStyle}
                        onChange={(e) => setSettings({...settings, borderStyle: e.target.value as any})}
                        className="w-full text-sm border border-slate-200 rounded bg-slate-50 p-2"
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                        <option value="double">Double</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-lg text-slate-300 font-mono text-[10px] h-48 overflow-hidden relative" id="code-snippet-preview">
                <div className="text-indigo-400 mb-2">// Generated Output Preview (Partial)</div>
                <pre className="opacity-70">
                  {`&lt;nav class=&quot;toc-container&quot;&gt;\n  &lt;ul class=&quot;toc-list&quot;&gt;\n${items.slice(0, 2).map(i => `    &lt;li&gt;&lt;span class=&quot;emoji&quot;&gt;${i.icon || '🎬'}&lt;/span&gt; ${i.title}&lt;/li&gt;`).join('\n')}\n    &lt;li&gt;&nbsp;&nbsp;&lt;ul&gt;...&lt;/ul&gt;&lt;/li&gt;\n  &lt;/ul&gt;\n&lt;/nav&gt;`}
                </pre>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Right half: Live Render Preview */}
            <div className="flex flex-col h-full border border-slate-200 rounded-xl overflow-hidden shadow-2xl" id="preview-wrapper">
              <div className="bg-slate-100 border-b border-slate-200 p-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Render Preview</span>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                </div>
              </div>
              <div 
                className="flex-1 p-8 overflow-y-auto" 
                style={{ 
                  fontFamily: `'${settings.fontFamily}', serif`,
                  background: settings.bgType === 'gradient' 
                    ? settings.bgGradient 
                    : (settings.bgType === 'mesh' 
                        ? 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)'
                        : settings.backgroundColor),
                  color: settings.textColor
                }}
              >
                <div className={`mx-auto transition-all duration-300 ${previewFrameWidth[previewSize]}`}>
                  <h4 className="text-3xl font-black border-b-4 inline-block mb-12 pb-2" style={{ borderColor: settings.primaryColor, fontFamily: settings.theme === 'editorial' ? 'Playfair Display' : 'inherit' }}>Table of Contents</h4>
                  <RecursiveList items={items} settings={settings} depth={0} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-8 flex-shrink-0 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-[10px] text-slate-400 font-medium z-10">
        <div>Auto-saving in background...</div>
        <div className="flex items-center gap-4">
          <span>{items.length} Root Sections • {totalItems} Total Nodes</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Live Connection Active
          </div>
        </div>
      </footer>

      {/* Code Modal (unchanged functionality, just themed) */}
      <AnimatePresence>
        {showCode && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
            onClick={() => setShowCode(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[80vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Your Index is Ready</h2>
                  <p className="text-sm text-slate-500">Copy and paste this snippet into your existing website.</p>
                </div>
                <button onClick={() => setShowCode(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <Maximize2 size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden p-6">
                <div className="relative h-full">
                  <pre className="bg-slate-950 text-slate-300 p-6 rounded-xl font-mono text-sm overflow-auto h-full scrollbar-thin scrollbar-thumb-slate-700">
                    {fullHTML}
                  </pre>
                  <button onClick={copyToClipboard} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg backdrop-blur-md flex items-center gap-2 text-xs font-semibold">
                    <Copy size={16} /> Copy Code
                  </button>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
                <button onClick={() => setShowCode(false)} className="px-5 py-2 text-slate-600 font-semibold hover:text-slate-900">Close</button>
                <button onClick={copyToClipboard} className="btn-primary px-5 py-2">Copy to Clipboard</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RecursiveList({ items, settings, depth }: { items: IndexItem[], settings: GlobalSettings, depth: number }) {
  const getShapeStyles = (shape: string) => {
    switch (shape) {
      case 'pill': return { borderRadius: '9999px' };
      case 'skew': return { transform: 'skew(-6deg)', borderRadius: '4px' };
      case 'organic': return { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' };
      case 'square': return { borderRadius: '0' };
      default: return { borderRadius: settings.borderRadius };
    }
  };

  const themeConfig = {
    minimal: {
      padding: '1.5rem 0',
      borderBottom: `1px solid ${settings.textColor}11`,
      iconBg: 'transparent'
    },
    technical: {
      padding: '1rem',
      border: `1px solid ${settings.primaryColor}33`,
      iconBg: `${settings.primaryColor}11`,
      shadow: 'inset 0 0 10px rgba(0,0,0,0.02)'
    },
    brutalist: {
      padding: '1.5rem',
      border: `3px solid ${settings.textColor}`,
      shadow: `10px 10px 0px ${settings.primaryColor}`,
      iconBg: settings.primaryColor
    },
    atmospheric: {
      padding: '2rem',
      border: '1px solid rgba(255,255,255,0.3)',
      shadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
      iconBg: 'rgba(255,255,255,0.5)'
    },
    editorial: {
      padding: '2.5rem 0',
      borderBottom: `2px solid ${settings.textColor}22`,
      iconBg: 'transparent'
    }
  }[settings.theme] || { padding: '1rem', iconBg: 'transparent' };

  return (
    <ul className="space-y-6">
      {items.map((item) => (
        <li key={item.id} className="group transition-all">
          <div 
            className="flex items-center gap-6 transition-all duration-500 overflow-hidden"
            style={{
              padding: themeConfig.padding,
              border: (themeConfig as any).border || 'none',
              borderBottom: (themeConfig as any).borderBottom || 'none',
              boxShadow: (themeConfig as any).shadow || 'none',
              ...getShapeStyles(settings.itemShape),
              background: settings.theme === 'atmospheric' ? 'rgba(255,255,255,0.4)' : 'transparent',
              backdropFilter: settings.theme === 'atmospheric' ? 'blur(20px)' : 'none'
            }}
          >
            {depth === 0 && (
              <div 
                className="w-12 h-12 flex items-center justify-center flex-shrink-0 text-sm font-black border border-slate-200 rounded-full select-none"
                style={{ color: settings.primaryColor, borderColor: `${settings.primaryColor}33` }}
              >
                {String(items.indexOf(item) + 1).padStart(2, '0')}
              </div>
            )}
            
            {item.icon && (
              <div 
                className="text-2xl flex-shrink-0" 
                style={{ 
                  width: settings.iconSize, 
                  height: settings.iconSize, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: themeConfig.iconBg,
                  borderRadius: settings.itemShape === 'square' ? '0' : '16px',
                  color: settings.theme === 'brutalist' ? 'white' : 'inherit',
                  border: settings.theme === 'brutalist' ? `3px solid ${settings.textColor}` : 'none'
                }}
              >
                {item.icon}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <a 
                href={item.url} 
                target={item.isExternal ? '_blank' : undefined}
                rel={item.isExternal ? 'noopener noreferrer' : undefined}
                className="block truncate transition-all leading-none"
                style={{ 
                  color: item.color || (depth === 0 ? settings.primaryColor : settings.textColor), 
                  fontSize: depth === 0 ? `calc(${settings.titleFontSize} * 1.2)` : settings.subtitleFontSize,
                  fontWeight: depth === 0 ? 900 : 600,
                  textTransform: settings.theme === 'brutalist' ? 'uppercase' : 'none',
                  letterSpacing: settings.theme === 'brutalist' ? '0.15em' : 'normal',
                  fontFamily: settings.theme === 'editorial' ? 'Playfair Display' : 'inherit'
                }}
              >
                {item.title}
              </a>
              {item.subtitle && (
                <p 
                  className="text-[10px] opacity-60 truncate uppercase tracking-[0.2em] mt-2 font-black"
                  style={{ color: settings.primaryColor }}
                >
                  {item.subtitle}
                </p>
              )}
            </div>
            {item.isExternal && <ExternalLink size={20} className="opacity-20 flex-shrink-0" />}
          </div>
          
          {item.children.length > 0 && (
            <div 
              className="pl-16 mt-4 space-y-4" 
              style={{ borderLeft: settings.theme === 'technical' ? `2px dashed ${settings.primaryColor}33` : 'none' }}
            >
              <RecursiveList items={item.children} settings={settings} depth={depth + 1} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

const IndexItemEditor: React.FC<{ 
  item: IndexItem; 
  onUpdate: (id: string, updates: Partial<IndexItem>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onAddChild: (id: string) => void;
}> = ({ item, onUpdate, onDelete, onToggle, onAddChild }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="group mb-1" id={`editor-item-${item.id}`}>
      <div className={`flex items-center gap-2 p-2 rounded transition-all border ${isEditing ? 'bg-indigo-50 border-indigo-100' : 'bg-transparent border-transparent hover:bg-slate-50'}`}>
        <span className="text-slate-300 text-xs cursor-default">⋮⋮</span>
        <button onClick={() => onToggle(item.id)} className="text-slate-400">
          {item.icon || '🎬'}
        </button>
        <span 
          className="text-sm font-medium truncate flex-1 cursor-pointer"
          onClick={() => setIsEditing(!isEditing)}
        >
          {item.title}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onAddChild(item.id)} className="p-1 text-slate-400 hover:text-indigo-600" title="Add Child"><Plus size={14} /></button>
          <button onClick={() => setIsEditing(!isEditing)} className="p-1 text-slate-400 hover:text-indigo-600"><Settings size={14} /></button>
          <button onClick={() => onDelete(item.id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="border border-slate-200 rounded-md p-3 mt-1 ml-6 bg-white shadow-sm space-y-3 z-20 relative"
          >
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Title</label>
              <input 
                value={item.title} onChange={(e) => onUpdate(item.id, { title: e.target.value })}
                className="w-full p-1.5 text-xs border border-slate-200 rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Icon</label>
                <input 
                  value={item.icon} onChange={(e) => onUpdate(item.id, { icon: e.target.value })}
                  className="w-full p-1.5 text-xs border border-slate-200 rounded" placeholder="Emoji"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Meta/Sub</label>
                <input 
                  value={item.subtitle || ''} onChange={(e) => onUpdate(item.id, { subtitle: e.target.value })}
                  className="w-full p-1.5 text-xs border border-slate-200 rounded" placeholder="e.g. 05:20"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">URL</label>
              <input 
                value={item.url || ''} onChange={(e) => onUpdate(item.id, { url: e.target.value })}
                className="w-full p-1.5 text-xs border border-slate-200 rounded"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {item.isOpen && item.children.length > 0 && (
        <div className="pl-6 space-y-1 mt-1 border-l border-slate-100 ml-3">
          {item.children.map(child => (
            <IndexItemEditor key={child.id} item={child} onUpdate={onUpdate} onDelete={onDelete} onToggle={onToggle} onAddChild={(id) => onAddChild(id)} />
          ))}
        </div>
      )}
    </div>
  );
};

