
import React, { useState, useEffect } from 'react';
import { TicketData } from './types';
import TicketPreview from './components/TicketPreview';
import EditorForm from './components/EditorForm';

const App: React.FC = () => {
  const generateRandomTicketId = () => {
    const digits = '0123456789';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let d = '';
    for (let i = 0; i < 9; i++) d += digits.charAt(Math.floor(Math.random() * digits.length));
    let l = '';
    for (let i = 0; i < 6; i++) l += letters.charAt(Math.floor(Math.random() * letters.length));
    return d + l;
  };

  const getInitialEmployeeId = (cinema: string) => {
    return cinema === '加州环球影城' ? 'LAJZ02' : 'LAXY02';
  };

  const getNowFormatted = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}`;
  };

  const [ticketData, setTicketData] = useState<TicketData>({
    cinema: '加州环球影城',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    movieName: '',
    seat: '',
    price: '50.00',
    serviceFee1: '0.00',
    serviceFee2: '0.00',
    source: '一卡通/现金',
    saleTime: getNowFormatted(),
    employeeId: 'LAJZ02',
    ticketId: generateRandomTicketId(),
    hall: '3号厅',
    showGrid: true,
    offsets: {}
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTicketData(prev => ({ ...prev, saleTime: getNowFormatted() }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handlePrint = () => {
    window.print();
    // 打印完以后自动清空关键信息，方便下一张录入
    setTicketData(prev => ({ 
      ...prev, 
      ticketId: generateRandomTicketId(),
      seat: '',       // 清空座号（排/座）
      movieName: '',  // 清空影片名称
    }));
  };

  const handleDataChange = (newData: TicketData) => {
    if (newData.cinema !== ticketData.cinema) {
      newData.employeeId = getInitialEmployeeId(newData.cinema);
    }
    setTicketData(newData);
  };

  const handleRestoreV3 = () => {
    if (window.confirm('确定要恢复到 V3.0 基准坐标吗？所有手动微调将被清除。')) {
      setTicketData(prev => ({ ...prev, offsets: {} }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100 font-['Noto_Sans_SC']">
      <div className="w-full md:w-[400px] p-4 md:p-6 overflow-y-auto h-screen no-print border-r border-slate-300 bg-white shadow-xl z-10">
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#D23228] text-white p-2 rounded-lg shadow-md">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">打印票务系统</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Precision Ticket v3.0 基准版</p>
            </div>
          </div>
        </header>

        <EditorForm 
          data={ticketData} 
          onChange={handleDataChange} 
          onPrintTrigger={handlePrint}
          onRestoreV3={handleRestoreV3}
        />
        
        <button
          onClick={handlePrint}
          className="w-full mt-8 bg-[#D23228] hover:bg-[#b02820] text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 group"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          确认打印 (Enter)
        </button>
      </div>

      <div className="flex-grow p-4 md:p-8 flex items-start justify-center bg-zinc-700 overflow-auto h-screen scroll-smooth">
        <div className="flex flex-col items-center py-5 w-full">
          <div className="bg-white/95 backdrop-blur px-6 py-2 rounded-full border border-white/50 shadow-md no-print mb-6">
            <span className="text-[11px] font-black text-zinc-800 uppercase tracking-widest flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              V3.0 物理复刻预览 (80mm × 85mm)
            </span>
          </div>
          
          <div id="printable-ticket" className="bg-white shadow-[0_40px_80px_rgba(0,0,0,0.6)] rounded-sm overflow-hidden mb-10">
            <TicketPreview data={ticketData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
