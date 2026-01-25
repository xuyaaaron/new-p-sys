
import React, { useState, useEffect } from 'react';
import { TicketData, FieldOffset } from '../types';

interface EditorFormProps {
  data: TicketData;
  onChange: (newData: TicketData) => void;
  onPrintTrigger?: () => void;
  onRestoreV3?: () => void;
}

const EditorForm: React.FC<EditorFormProps> = ({ data, onChange, onPrintTrigger, onRestoreV3 }) => {
  const seatMatch = data.seat.match(/(.*?)排(.*?)座/);
  const [row, setRow] = useState(seatMatch ? seatMatch[1] : '');
  const [col, setCol] = useState(seatMatch ? seatMatch[2] : '');
  
  const [selectedField, setSelectedField] = useState('hall');

  // 影片名称记忆逻辑：从本地存储加载，默认为空或初始列表
  const [movieList, setMovieList] = useState<string[]>(() => {
    const saved = localStorage.getItem('movie_history');
    return saved ? JSON.parse(saved) : [
      "哪吒之魔童闹海",
      "封神第二部：战火西岐",
      "唐探1900",
      "熊出没·逆转时空",
      "飞驰人生2"
    ];
  });

  const fieldOptions = [
    { id: 'brand', name: '品牌行 (来安...)' },
    { id: 'hall', name: '主券-影厅' },
    { id: 'datetime', name: '主券-时间' },
    { id: 'movieName', name: '主券-片名' },
    { id: 'seat', name: '主券-座号' },
    { id: 'priceService', name: '主券-票价费用' },
    { id: 'source', name: '主券-票类' },
    { id: 'saleTime', name: '主券-售票时间' },
    { id: 'employeeId', name: '主券-工号' },
    { id: 'qrCode', name: '主券-二维码' },
    { id: 'ticketId', name: '主券-底部票号' },
    { id: 'stubHall', name: '副券-影厅' },
    { id: 'stubDateTime', name: '副券-时间' },
    { id: 'stubSeat', name: '副券-座号' },
    { id: 'stubTicketId', name: '副券-票号' },
    { id: 'stubPrice', name: '副券-票价' },
  ];

  // 持久化存储影片列表
  useEffect(() => {
    localStorage.setItem('movie_history', JSON.stringify(movieList));
  }, [movieList]);

  // 监听打印触发或失焦，将新影片加入记忆
  const recordMovie = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    
    setMovieList(prev => {
      // 如果已存在，先移除旧的，再放到最后（更新活跃度）或者保持原位
      // 这里按用户要求：输入第11个顶掉第一个，实现 FIFO
      if (prev.includes(trimmed)) return prev;
      
      const newList = [...prev, trimmed];
      if (newList.length > 10) {
        return newList.slice(1); // 删掉第一个，保留后10个
      }
      return newList;
    });
  };

  // 同步清空逻辑
  useEffect(() => {
    if (!data.seat) {
      setRow('');
      setCol('');
    } else {
      const match = data.seat.match(/(.*?)排(.*?)座/);
      if (match) {
        setRow(match[1]);
        setCol(match[2]);
      }
    }
  }, [data.seat]);

  useEffect(() => {
    const newSeat = (row || col) ? `${row}排${col}座` : '';
    if (data.seat !== newSeat) {
      onChange({ ...data, seat: newSeat });
    }
  }, [row, col]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const moveField = (dx: number, dy: number) => {
    const currentOffsets = { ...data.offsets };
    const currentPos = currentOffsets[selectedField] || { x: 0, y: 0 };
    currentOffsets[selectedField] = {
      x: Number((currentPos.x + dx).toFixed(2)),
      y: Number((currentPos.y + dy).toFixed(2))
    };
    onChange({ ...data, offsets: currentOffsets });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      recordMovie(data.movieName);
      if (onPrintTrigger) onPrintTrigger();
    }
  };

  return (
    <div className="space-y-6">
      {/* 布局微调面板 */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
        <div className="flex items-center justify-between mb-3">
          <label className="text-[11px] font-black text-red-600 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            右图位置微调 (0.1mm)
          </label>
          <button 
            onClick={onRestoreV3}
            className="px-2 py-1 bg-black text-white rounded text-[10px] font-bold hover:bg-zinc-800 transition-colors"
          >
            恢复 V3.0 基准
          </button>
        </div>
        
        <div className="space-y-3">
          <select 
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold focus:ring-2 focus:ring-red-500"
          >
            {fieldOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>

          <div className="flex items-center justify-between gap-4">
            <div className="grid grid-cols-3 gap-1">
              <div></div>
              <button onClick={() => moveField(0, -0.1)} className="p-2 bg-white border border-slate-300 rounded hover:bg-slate-50 active:bg-slate-200 shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg></button>
              <div></div>
              <button onClick={() => moveField(-0.1, 0)} className="p-2 bg-white border border-slate-300 rounded hover:bg-slate-50 active:bg-slate-200 shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg></button>
              <div className="flex items-center justify-center text-[10px] font-mono text-slate-400 bg-slate-100 rounded min-w-[60px]">
                {data.offsets[selectedField]?.x || 0}, {data.offsets[selectedField]?.y || 0}
              </div>
              <button onClick={() => moveField(0.1, 0)} className="p-2 bg-white border border-slate-300 rounded hover:bg-slate-50 active:bg-slate-200 shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg></button>
              <div></div>
              <button onClick={() => moveField(0, 0.1)} className="p-2 bg-white border border-slate-300 rounded hover:bg-slate-50 active:bg-slate-200 shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg></button>
              <div></div>
            </div>
            
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-slate-400 uppercase">网格</span>
                 <button 
                   onClick={() => onChange({...data, showGrid: !data.showGrid})}
                   className={`w-8 h-4 rounded-full transition-colors relative ${data.showGrid ? 'bg-red-500' : 'bg-slate-300'}`}
                 >
                   <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${data.showGrid ? 'left-4.5' : 'left-0.5'}`} style={{ left: data.showGrid ? '18px' : '2px' }}></div>
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* 核心表单 */}
      <div>
        <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1.5">影院全称</label>
        <select
          name="cinema"
          value={data.cinema}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 text-sm appearance-none cursor-pointer"
        >
          <option value="加州环球影城">加州环球影城</option>
          <option value="鑫影国际影城">鑫影国际影城</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1.5">排</label>
          <input
            type="text"
            value={row}
            onChange={(e) => setRow(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="数字"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-red-500 font-bold"
          />
        </div>
        <div>
          <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1.5">座</label>
          <input
            type="text"
            value={col}
            onChange={(e) => setCol(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="数字"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-red-500 font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1.5">上映日期</label>
          <input type="date" name="date" value={data.date} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none cursor-pointer" />
        </div>
        <div>
          <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1.5">上映时间</label>
          <input type="time" name="time" value={data.time} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none cursor-pointer" />
        </div>
      </div>

      {/* 影片名称：记忆功能实现 */}
      <div>
        <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1.5 flex justify-between">
          <span>影片名称</span>
          <span className="text-[9px] text-slate-400">已记忆 {movieList.length}/10</span>
        </label>
        <div className="space-y-2">
          <select
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 font-bold"
            onChange={(e) => {
              if (e.target.value) {
                onChange({ ...data, movieName: e.target.value });
              }
            }}
            value={movieList.includes(data.movieName) ? data.movieName : ""}
          >
            <option value="">-- 选择历史记忆 --</option>
            {movieList.map((movie, index) => (
              <option key={index} value={movie}>{movie}</option>
            ))}
          </select>
          <input
            type="text"
            name="movieName"
            value={data.movieName}
            onChange={handleChange}
            onBlur={() => recordMovie(data.movieName)} // 离开输入框时尝试记录
            onKeyDown={handleKeyDown}
            placeholder="输入新片名 (自动记忆)"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-red-500 font-black"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1.5">结算票价</label>
          <input type="text" name="price" value={data.price} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none font-bold" />
        </div>
        <div>
          <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1.5">购票渠道</label>
          <input type="text" name="source" value={data.source} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none" />
        </div>
      </div>
    </div>
  );
};

export default EditorForm;
