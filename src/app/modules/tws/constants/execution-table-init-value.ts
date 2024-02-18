import {ColDef, ValueParserParams} from 'ag-grid-community'

function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue)
}

const EXECUTION_TABLE_INIT_VALUE: ColDef[] = [
  {
    field: 'client_ac',
    headerName: 'Client A/C',
    hide: false,
    width: 140,
    type: 'textColumn',
  },
  {
    field: 'name',
    headerName: 'Name',
    hide: false,
    width: 100,
    type: 'numColumn',
    valueParser: numberValueParser,
    cellRenderer: 'agAnimateSlideCellRenderer',
  },
  {
    field: 'side',
    headerName: 'Side',
    hide: false,
    width: 80,
    type: 'numColumn',
    valueParser: numberValueParser,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    field: 'limit',
    headerName: 'Average Px',
    hide: false,
    width: 100,
    type: 'numColumn',
    valueParser: numberValueParser,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    field: 'orderStatus',
    headerName: 'Order Status',
    hide: false,
    width: 120,
    type: 'numColumn',
    valueParser: numberValueParser,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    field: 'date',
    headerName: 'Trade Time',
    hide: false,
    width: 140,
    type: 'numColumn',
    valueParser: numberValueParser,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    field: 'execQty',
    headerName: 'last Qty',
    hide: false,
    width: 140,
    type: 'numColumn',
    valueParser: numberValueParser,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  
]

export default EXECUTION_TABLE_INIT_VALUE
