import {ColDef, ValueParserParams} from 'ag-grid-community'
function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue)
}

const PORTFOLIO_INIT_VALUE: ColDef[] = [
  {
    field: 'client_code',
    headerName: 'Client Code',
    hide: false,
    width: 160,
    valueParser: numberValueParser,
    cellStyle: () => {
      return {textAlign: 'right'}
    },
  },
  {
    field: 'dsc_db_id',
    headerName: 'DSC BD ID',
    hide: false,
    width: 160,
  },
  {
    field: 'scrip',
    headerName: 'Company Code',
    hide: false,
    width: 150,
  },
  {
    field: 'buy_qty',
    headerName: 'Buy Quantity',
    hide: false,
    width: 150,
    valueParser: numberValueParser,
    cellStyle: () => {
      return {textAlign: 'right'}
    },
  },
  {
    field: 'sell_qty',
    headerName: 'Sell Quantity',
    hide: false,
    width: 150,
    valueParser: numberValueParser,
    cellStyle: () => {
      return {textAlign: 'right'}
    },
  },
  {
    field: 'remaining_qty',
    headerName: 'Remaining Quantity',
    hide: false,
    width: 150,
    valueParser: numberValueParser,
    cellStyle: () => {
      return {textAlign: 'right'}
    },
  },
  {
    field: 'created_at',
    headerName: 'Created At',
    hide: false,
    width: 250,
  },
  {
    field: 'dsc_time',
    headerName: 'DSC Time',
    hide: false,
    width: 250,
  },
]

export default PORTFOLIO_INIT_VALUE
