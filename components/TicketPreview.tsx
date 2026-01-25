
import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { TicketData } from '../types';

interface TicketPreviewProps {
  data: TicketData;
}

/**
 * 电影票打印系统 V3.0 精密规格说明：
 * 1. 坐标系: 基于 (y, x) 毫米坐标，1mm = 10px。
 * 2. 字体: 统一 30px (3mm高)。
 * 3. 汉字拉伸: scaleX(1.166) 达到 3.5mm 宽。
 * 4. 二维码: 严格 27mm x 27mm。
 * 5. 缺墨特效 (强化版): 大面积物理遮断，确保关键信息不可读。
 */
const TicketPreview: React.FC<TicketPreviewProps> = ({ data }) => {
  const TEXT_BLACK = "#000000"; 
  const mm = (v: number) => `${v * 10}px`;

  // V3.0 基准物理坐标
  const BASE_POSITIONS: Record<string, { y: number, x: number }> = {
    brand: { y: 16, x: 5 },
    hall: { y: 21, x: 10 },
    datetime: { y: 19, x: 38 },
    movieName: { y: 28, x: 12 },
    seat: { y: 34, x: 12 },
    priceService: { y: 34, x: 41 },
    source: { y: 39, x: 12 },
    saleTime: { y: 44, x: 12 },
    employeeId: { y: 45, x: 41 },
    qrCode: { y: 52, x: 16 },
    ticketId: { y: 80, x: 7 },
    stubHall: { y: 17, x: 60 },
    stubDateTime: { y: 29, x: 58 },
    stubSeat: { y: 45, x: 63 },
    stubTicketId: { y: 59, x: 61 },
    stubPrice: { y: 73, x: 64 },
  };

  const getPos = (key: string) => {
    const base = BASE_POSITIONS[key];
    const offset = data.offsets[key] || { x: 0, y: 0 };
    return {
      top: mm(base.y + offset.y),
      left: mm(base.x + offset.x)
    };
  };

  const [saleDate, saleHour] = data.saleTime.includes(' ') 
    ? data.saleTime.split(' ') 
    : [data.saleTime, ""];

  const containerStyle: React.CSSProperties = {
    width: mm(80), 
    height: mm(85),
    fontFamily: "'Noto Sans SC', sans-serif",
    color: TEXT_BLACK,
    backgroundImage: "url('111.png')", 
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    backgroundColor: '#fff',
    WebkitPrintColorAdjust: 'exact',
  };

  // 强化版缺墨特效组件
  const MajorInkSkip = ({ style }: { style: React.CSSProperties }) => (
    <div 
      className="pointer-events-none absolute z-[100]" 
      style={{
        ...style,
        background: `linear-gradient(to bottom, 
          transparent, 
          rgba(255,255,255,0.95) 15%, 
          rgba(255,255,255,1) 50%, 
          rgba(255,255,255,0.95) 85%, 
          transparent
        )`,
        boxShadow: '0 0 2px 1px rgba(255,255,255,0.5)',
      }}
    />
  );

  const FineInkSkip = ({ style }: { style: React.CSSProperties }) => (
    <div 
      className="pointer-events-none absolute z-[101]" 
      style={{
        ...style,
        background: `repeating-linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0.9) 0px,
          rgba(255, 255, 255, 0.9) 1px,
          transparent 1px,
          transparent 3px
        )`,
      }}
    />
  );

  return (
    <div className="ticket-canvas shadow-2xl" style={containerStyle}>
      <div className="no-print" style={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
        pointerEvents: 'none', zIndex: 50, opacity: data.showGrid ? 1 : 0,
        backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)',
        backgroundSize: '10px 10px'
      }}></div>

      <TicketText style={getPos('brand')} text={`来安${data.cinema}`} isChinese />
      <TicketText style={getPos('hall')} text={data.hall} isChinese />

      <div className="absolute font-black leading-none" style={{ ...getPos('datetime'), fontSize: '30px' }}>
        <div style={{ transform: 'scaleY(0.95)' }}>{data.date}</div>
        <div style={{ marginTop: '2px', transform: 'scaleY(0.95)' }}>{data.time}</div>
      </div>

      <TicketText style={getPos('movieName')} text={data.movieName} isChinese />
      <TicketText style={getPos('seat')} text={data.seat} isChinese />

      <div className="absolute font-black leading-tight" style={{ ...getPos('priceService'), fontSize: '30px' }}>
        <div>{data.price}</div>
        <div style={{ marginTop: '2px' }}>{data.serviceFee1}</div>
      </div>

      <TicketText style={getPos('source')} text={data.source} isChinese />

      <div className="absolute font-black leading-none whitespace-nowrap" style={{ ...getPos('saleTime'), fontSize: '30px' }}>
        <div>{saleDate}</div>
        <div style={{ marginTop: '2px' }}>{saleHour}</div>
      </div>

      <TicketText style={getPos('employeeId')} text={data.employeeId} />

      {/* 二维码遮挡区: 强制破坏 */}
      <div 
        className="absolute"
        style={{ ...getPos('qrCode'), width: mm(27), height: mm(27), zIndex: 10 }}
      >
        <QRCodeCanvas value={data.ticketId} size={270} level="H" bgColor="transparent" fgColor="#000" style={{ width: '100%', height: '100%' }} />
        {/* 大面积遮断 */}
        <MajorInkSkip style={{ top: '35%', left: '-20%', width: '140%', height: '8px' }} />
        <MajorInkSkip style={{ top: '60%', left: '-20%', width: '140%', height: '12px' }} />
        <FineInkSkip style={{ top: '30%', left: '-20%', width: '140%', height: '40%' }} />
      </div>

      {/* 底部票号遮挡区: 掩盖中间关键位 */}
      <div 
        className="absolute font-black tracking-tighter whitespace-nowrap" 
        style={{ ...getPos('ticketId'), fontSize: '30px', fontFamily: "'Courier Prime', monospace" }}
      >
        {data.ticketId}
        <MajorInkSkip style={{ top: '20%', left: '15%', width: '60%', height: '15px' }} />
        <FineInkSkip style={{ top: '10%', left: '10%', width: '70%', height: '80%' }} />
      </div>

      {/* 副券区 */}
      <div className="absolute font-black text-center" style={{ ...getPos('stubHall'), width: mm(20), fontSize: '30px' }}>{data.hall}</div>
      <div className="absolute font-black text-center leading-none" style={{ ...getPos('stubDateTime'), width: mm(20), fontSize: '30px' }}>
        <div>{data.date}</div>
        <div style={{ marginTop: '4px' }}>{data.time}</div>
      </div>
      <div className="absolute font-black text-center" style={{ ...getPos('stubSeat'), width: mm(20), fontSize: '30px' }}>{data.seat}</div>

      {/* 副券票号遮挡区: 交叉遮断 */}
      <div className="absolute font-black text-center leading-tight" style={{ ...getPos('stubTicketId'), width: mm(20), fontSize: '30px' }}>
        <div className="relative">
          <div>{data.ticketId.substring(0, 9)}</div>
          <div>{data.ticketId.substring(9)}</div>
          <MajorInkSkip style={{ top: '25%', left: '-30%', width: '160%', height: '10px' }} />
          <MajorInkSkip style={{ top: '70%', left: '-30%', width: '160%', height: '8px' }} />
          <FineInkSkip style={{ top: '10%', left: '-20%', width: '140%', height: '80%' }} />
        </div>
      </div>

      <div className="absolute font-black text-center" style={{ ...getPos('stubPrice'), width: mm(20), fontSize: '30px' }}>{data.price}</div>
    </div>
  );
};

const TicketText: React.FC<{ text: string, style: React.CSSProperties, isChinese?: boolean }> = ({ text, style, isChinese }) => {
  return (
    <div 
      className="absolute font-black whitespace-nowrap origin-left"
      style={{ ...style, fontSize: '30px', lineHeight: '30px', height: '30px', transform: isChinese ? 'scaleX(1.166)' : 'none' }}
    >
      {text}
    </div>
  );
};

export default TicketPreview;
