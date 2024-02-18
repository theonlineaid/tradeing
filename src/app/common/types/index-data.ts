export interface IndexDataStruct {
  date: string
  time: string
  group: string
  security_name: string
  value: number
  stream_id: number
}

export type IndexDataType = {
  indexData: IndexDataStruct[]
}
