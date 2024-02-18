import {ColDef, ValueParserParams} from 'ag-grid-community'

function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue)
}

const POSITION_TABLE_INIT_VALUE: ColDef[] = [
  {
    field: 'scrip',
    headerName: 'Name',
    hide: false,
    width: 140,
    type: 'textColumn',
  },
  {
    field: 'lpt',
    headerName: 'Position/AVG price,qty',
    hide: false,
    width: 140,
    type: 'numColumn',
    valueParser: numberValueParser,
    cellRenderer: 'agAnimateSlideCellRenderer',
  },
  {
    field: 'high',
    headerName: 'Total Cost',
    hide: false,
    width: 200,
    // rowSpan: (params) => {
    //     if (params.data.scrip.split('.')[1]) {
    //       return 2;
    //     } else {
    //       return 1;
    //     }
    //   },
    //   cellStyle: (params) => {
    //     if(params.data.scrip.split('.')[1]) {
    //       return { 
    //         backgroundColor: 'rgb(148, 26, 26)', 
    //       }
    //     } 
    //   },
    type: 'numColumn',
    valueParser: numberValueParser,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    field: 'low',
    headerName: 'Closeable',
    hide: false,
    width: 140,
    type: 'numColumn',
    valueParser: numberValueParser,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  
]

export default POSITION_TABLE_INIT_VALUE
