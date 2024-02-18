import {ColDef, ValueParserParams} from 'ag-grid-community'
function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue)
}
const TRANSACTION_HISTORY_INIT_VALUE: ColDef[] = [
  {
    field: 'scrip',
    headerName: 'Company Code',
    hide: false,
    width: 160,
  },
  {
    field: 'client_code',
    headerName: 'Client Code',
    hide: false,
    width: 100,
    valueParser: numberValueParser,
    cellStyle: () => {
      return {textAlign: 'right'}
    },
  },
  {
    field: 'created_at',
    headerName: 'Date',
    hide: false,
    width: 250,
  },
  {
    field: 'side',
    headerName: 'Side',
    hide: false,
    width: 150,
  },
  {
    field: 'qty',
    headerName: 'Quantity',
    hide: false,
    width: 150,
    valueParser: numberValueParser,
    cellStyle: () => {
      return {textAlign: 'right'}
    },
  },
  {
    field: 'rate',
    headerName: 'Rate',
    hide: false,
    width: 150,
    valueParser: numberValueParser,
    cellStyle: () => {
      return {textAlign: 'right'}
    },
  },
  {
    field: 'debit',
    headerName: 'Debit',
    hide: false,
    width: 150,
    valueParser: numberValueParser,
    cellStyle: () => {
      return {textAlign: 'right'}
    },
  },
  {
    field: 'credit',
    headerName: 'Credit',
    hide: false,
    width: 140,
    valueParser: numberValueParser,
    cellStyle: () => {
      return {textAlign: 'right'}
    },
  },
]

export default TRANSACTION_HISTORY_INIT_VALUE
