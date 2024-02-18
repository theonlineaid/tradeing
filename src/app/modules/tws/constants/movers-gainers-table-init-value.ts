import {ColDef, ValueParserParams} from 'ag-grid-community'

function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue)
}

const MOVERS_GAINERS_TABLE_INIT_VALUE: ColDef[] = [
  {
    field: 'scrip',
    headerName: 'Ticker',
    hide: false,
    // width: 140,
    type: 'textColumn',
  },
  {
    field: 'lpt',
    headerName: 'Last',
    hide: false,
    // width: 80,
    valueFormatter: params => (params.value).toFixed(2),
    type: 'numColumn',
    valueParser: numberValueParser,
    cellRenderer: 'agAnimateSlideCellRenderer',
  },
  {
    field: 'high',
    headerName: 'D%',
    hide: false,
    // width: 80,
    type: 'numColumn',
    valueFormatter: params => (params.value).toFixed(2),
    cellStyle: (params) => {
      const style = { fontSize: '11px', fontWeight: '600'}
      if (parseFloat(params.value) > 0) {
        
        return {...style, color: 'green'}
      } else if (parseFloat(params.value) < 0) {
        return {...style, color:'red'}
      } else {
        return style
      }
    },
  },
  {
    field: 'low',
    headerName: 'Volume',
    hide: false,
    // width: 80,
    type: 'numColumn',
    valueFormatter: params => (params.value).toFixed(2),
    valueParser: numberValueParser,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    field: 'close',
    headerName: 'Net',
    hide: false,
    // width: 80,
    type: 'numColumn',
    valueFormatter: params => (params.value).toFixed(2),
    valueParser: numberValueParser,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
]

export default MOVERS_GAINERS_TABLE_INIT_VALUE
