import {ColDef, ValueParserParams} from 'ag-grid-community'

function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue)
}

export const NEWS_TABLE_INIT_VALUE: ColDef[] = [
  {
    field: 'time',
    headerName: 'Time',
    hide: false,
    filter: false,
    // width: 500,
    type: 'textColumn',
  },
  {
    // field: 'reference',
    field: 'reference',
    headerName: 'Reference',
    hide: false,
    // width: 140,
    type: 'textColumn',
  },
]

export const NEWS_INSTRUMENT_TABLE_INIT_VALUE: ColDef[] = [
  {
    field: 'time',
    headerName: 'Time',
    hide: false,
    filter: false,
    // width: 500,
    type: 'textColumn',
  },
  {
    field: 'date',
    headerName: 'Date',
    hide: false,
    filter: false,
    // width: 500,
    type: 'textColumn',
  },
  {
    // field: 'reference',
    field: 'reference',
    headerName: 'Reference',
    hide: false,
    // width: 140,
    type: 'textColumn',
  },
]

// export default NEWS_TABLE_INIT_VALUE
