
export interface BlotterDataStruct {
  clientOrderId: string
  orderId: string
  client_ac: any
  name: string
  side: string
  sentQty: any
  limit: any
  status: string
  orderStatus: string
  execution: string
  execQty: any
  execPx: string
  date: string
  time:string
}

export type BlotterDataType = {
  blotterDatas: BlotterDataStruct[];
  saveBlotterData: (data: BlotterDataStruct) => void;
};