import {ColDef, ValueParserParams} from 'ag-grid-community'
function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue)
}

const PROFIT_LIST_INIT_VALUE: ColDef[] = [
  {
    field: 'client_code',
    headerName: 'Client Code',
    hide: true,
    width: 140,
    valueParser: numberValueParser,
    cellStyle: () => {
      return {textAlign: 'right'}
    },
  },
  {
    field: 'scrip',
    headerName: 'Company Code',
    hide: true,
    width: 160,
  },
  {
    field: 'buy_qty',
    headerName: 'Buy Quantity',
    hide: true,
    width: 160,
    valueParser: numberValueParser,
    cellStyle: () => {
      return {textAlign: 'right'}
    },
  },
  {
    field: 'sell_qty',
    headerName: 'Sell Quantity',
    hide: true,
    width: 150,
    valueParser: numberValueParser,
    cellStyle: () => {
      return {textAlign: 'right'}
    },
  },
  {
    field: 'avg_buy_price',
    headerName: 'Avg Buy Price',
    hide: true,
    width: 150,
    valueParser: numberValueParser,
    cellStyle: () => {
      return {textAlign: 'right'}
    },
  },
  {
    field: 'avg_sell_price',
    headerName: 'Avg Sell Price',
    hide: true,
    width: 150,
    valueParser: numberValueParser,
    cellStyle: () => {
      return {textAlign: 'right'}
    },
  },
  {
    field: 'side',
    headerName: 'Side',
    hide: true,
    width: 150,
  },
  {
    field: 'profit',
    headerName: 'Profit',
    hide: true,
    width: 150,
    valueParser: numberValueParser,
    cellStyle: () => {
      return {textAlign: 'right'}
    },
  },
  {
    field: 'loss',
    headerName: 'Loss',
    hide: true,
    width: 140,
    valueParser: numberValueParser,
    cellStyle: () => {
      return {textAlign: 'right'}
    },
  },
]

export default PROFIT_LIST_INIT_VALUE
