import {ColDef, ValueParserParams} from 'ag-grid-community'

function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue)
}

const POSITION_TABLE_INIT_VALUE: ColDef[] = [
  {
    field: 'time',
    headerName: 'Time',
    hide: false,
    width: 140,
    type: 'textColumn',
  },
  {
    field: 'last',
    headerName: 'Last',
    hide: false,
    width: 140,
    type: 'numColumn',
    valueParser: numberValueParser,
  },
  {
    field: 'vol',
    headerName: 'Volume',
    hide: false,
    width: 200,
    type: 'numColumn',
    valueParser: numberValueParser,
  },
  {
    field: 'condition',
    headerName: 'Condition',
    hide: false,
    width: 140,
    type: 'numColumn',
  },
  {
    field: 'bbh',
    headerName: 'BBH',
    hide: false,
    width: 140,
    type: 'numColumn',
    valueParser: numberValueParser,
  },
  {
    field: 'sbh',
    headerName: 'SBH',
    hide: false,
    width: 140,
    type: 'numColumn',
    valueParser: numberValueParser,
  },
  
]

export default POSITION_TABLE_INIT_VALUE
