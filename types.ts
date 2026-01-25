
export interface FieldOffset {
  x: number;
  y: number;
}

export interface TicketData {
  cinema: string;
  date: string;
  time: string;
  movieName: string;
  seat: string;
  price: string;
  serviceFee1: string;
  serviceFee2: string;
  source: string;
  saleTime: string;
  employeeId: string;
  ticketId: string;
  hall: string;
  showGrid: boolean; // 是否显示参考网格
  // 存储各个元素的偏移量，key 为元素标识符
  offsets: Record<string, FieldOffset>;
}
