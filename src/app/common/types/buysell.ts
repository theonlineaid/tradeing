export interface TradingInterface {
  id : number
  audited_pe : number
  authorized_cap : number
  business_segment: string
  change : number
  change_per : number
  close : number
  eps : number
  floor_price : number
  foreign : number
  free_float : number
  full_name : string
  gov : number
  high : number
  institute : number
  instrument_type : string
  lpt : number
  low : number
  market_map : number
  market_category : string | null
  nav : number
  nav_price : number
  oci : number
  open : number
  open_cahnge_per : number
  pe : number
  paid_up_cap : number
  public : number
  q1eps :  number
  q2eps :  number
  q3eps :  number
  q4eps :  number
  reserve_surplus : number
  scrip : string
  spark_line : null
  sponsor_director : number
  total_securites : number
  trade : number
  un_audit_pe : number
  v_change : number
  value : number
  vol_change_per : number
  volume : number
  ycp : number
  yvolume : number
  yearend1 : null
  yearend2 : null
  yearend3 : null
  yearend4 : null
  yearend5 : null
  yearend6 : null
  yearend7 : null
  yearend8 : null
  year_end_pe_count1 : number
  year_end_pe_count2 : number
  year_end_pe_count3 : number
  year_end_pe_count4 : number
  year_end_pe_count5 : number
  year_end_pe_count6 : number
  year_end_pe_count7 : number
  year_end_pe_count8 : number
}

export interface ModalDataType{
  open: number 
  high: number
  low:number
  ltp:number
  chg: number
  status:number
  dh:number
  val:number
  dl:number
  vol:number
  vwap:number
}