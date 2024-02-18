import {ColDef, ValueParserParams} from 'ag-grid-community'

function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue)
}

const PURCHASE_POWER_TABLE_INIT_VALUE: ColDef[] = [
  {
    field: 'scrip',
    headerName: 'Main',
    hide: false,
    width:160,
    type: 'textColumn',
  },
  {
    field: 'lpt',
    headerName: 'Limit',
    hide: false,
    width: 160,
    type: 'numColumn',
    valueParser: numberValueParser,
    cellRenderer: 'agAnimateSlideCellRenderer',
  },
  {
    field: 'high',
    headerName: 'Day Order',
    hide: false,
    width: 160,
    type: 'numColumn',
    valueParser: numberValueParser,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    field: 'low',
    headerName: 'Remaining',
    hide: false,
    width: 160,
    type: 'numColumn',
    valueParser: numberValueParser,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  }
]

export default PURCHASE_POWER_TABLE_INIT_VALUE
