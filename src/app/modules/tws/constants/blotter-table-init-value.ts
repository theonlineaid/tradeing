import {ColDef, ValueParserParams} from 'ag-grid-community'
import blotterIconRendered from './icons'

function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue)
}

const BLOTTER_TABLE_INIT_VALUE: ColDef[] = [
  {
    field: 'orderStatus',
    headerName: '',
    hide: false,
    width: 40,
    type: 'textColumn',
    cellRenderer: (params) => blotterIconRendered(params),
    cellStyle: () => {
      return {fontWeight: '600', textAlign: 'center'}
    },
  },
  {
    field: 'client_ac',
    headerName: 'Client A/C',
    hide: false,
    width: 80,
    type: 'textColumn',
    cellStyle: () => {
      return {fontWeight: '600', textAlign: 'center'}
    },
  },
  {
    field: 'name',
    headerName: 'Name',
    hide: false,
    width: 120,
    type: 'textColumn',
    filter: 'agSetColumnFilter',
    cellStyle: () => {
      return {fontWeight: '600'}
    },
  },
  {
    field: 'side',
    headerName: 'Side',
    hide: false,
    width: 70,
    type: 'numColumn',
    filter: 'agSetColumnFilter',
    valueParser: numberValueParser,
    cellStyle: (params) => {
      const style = {color: '#FFF', fontWeight: '600', textAlign: 'center', margin: '1px 0px'}
      if (params.value === 'Buy') {
        return {...style, backgroundColor: '#686de0'}
      } else if (params.value === 'Sell') {
        return {...style, backgroundColor: '#eb4d4b'}
      } else {
        return
      }
    },
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    field: 'execQty',
    headerName: 'ExecQty',
    hide: false,
    width: 80,
    type: 'numColumn',
    filter: 'agSetColumnFilter',
    valueParser: numberValueParser,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    field: 'status',
    headerName: 'Status',
    hide: false,
    width: 80,
    type: 'numColumn',
    filter: 'agSetColumnFilter',
    cellStyle: (params) => {
      const style = {
        color: '#FFF',
        fontWeight: '600',
        textAlign: 'center',
        margin: '1px 0px',
        fontSize: '10px',
      }
      if (params.value === 'Failed') {
        return {...style, backgroundColor: '#eb4d4b'}
      } else if (params.value === 'Terminated') {
        return {...style, backgroundColor: '#eb4d4b'}
      } else if (params.value === 'Done') {
        return {...style, backgroundColor: '#6ab04c'}
      } else if (params.value === 'Working') {
        return {...style, backgroundColor: '#54a0ff'}
      } else {
        return
      }
    },
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    field: 'execution',
    headerName: 'Execution%',
    hide: false,
    width: 85,
    type: 'numColumn',
    valueParser: numberValueParser,
    cellStyle: (params) => {
      const style = {color: '#FFF', fontWeight: '600', textAlign: 'center', margin: '1px'}
      if (parseFloat(params.value) === 0) {
        return {...style, backgroundColor: '#eb4d4b'}
      } else if (parseFloat(params.value) > 0 && parseFloat(params.value) < 50) {
        return {...style, backgroundColor: '#fab1a0'}
      } else if (parseFloat(params.value) > 49 && parseFloat(params.value) < 80) {
        return {...style, backgroundColor: '#55efc4'}
      } else if (parseFloat(params.value) > 79 && parseFloat(params.value) < 101) {
        return {...style, backgroundColor: '#00b894'}
      } else {
        return
      }
    },
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    field: 'limit',
    headerName: 'Limit',
    hide: false,
    width: 100,
    type: 'numColumn',
    valueFormatter: (params) => params.value?.toFixed(2),
    cellStyle: () => {
      return {fontWeight: '600', textAlign: 'right'}
    },
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    field: 'sentQty',
    headerName: 'TargetSize',
    hide: false,
    width: 80,
    type: 'numColumn',
    valueParser: numberValueParser,
    cellStyle: () => {
      return {fontWeight: '600', textAlign: 'right'}
    },
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    field: 'orderStatus',
    headerName: 'OrderStatus',
    hide: false,
    width: 110,
    type: 'numColumn',
    valueParser: numberValueParser,
    cellStyle: (params) => {
      const style = {fontWeight: '600', textAlign: 'center'}
      if (params.value === 'Rejected') {
        return {...style, color: '#eb4d4b'}
      } else if (params.value === 'Replaced') {
        return {...style, color: '#eb4d4b'}
      } else if (params.value === 'Filled') {
        return {...style, color: '#6ab04c'}
      } else if (params.value === 'New') {
        return {...style, color: '#54a0ff'}
      } else if (params.value === 'Partially filled') {
        return {...style, color: '#badc58'}
      } else {
        return style
      }
    },
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  // {
  //   field: 'execPx',
  //   headerName: 'ExecPX',
  //   hide: false,
  //   width: 80,
  //   type: 'numColumn',
  //   valueFormatter: params => ((params.value)?.toFixed(2)),
  //   valueParser: numberValueParser,
  //   cellStyle: (params) => {
  //     return {fontWeight: '600', textAlign: 'right'}
  //   },
  //   cellRenderer: 'agAnimateShowChangeCellRenderer',
  // },
  {
    field: 'date',
    headerName: 'Date',
    hide: false,
    width: 80,
    type: 'numColumn',
    valueParser: numberValueParser,
    cellStyle: () => {
      return {fontWeight: '600', textAlign: 'right'}
    },
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    field: 'time',
    headerName: 'Time',
    hide: false,
    width: 80,
    type: 'numColumn',
    valueParser: numberValueParser,
    cellStyle: () => {
      return {fontWeight: '600', textAlign: 'right'}
    },
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
]

export default BLOTTER_TABLE_INIT_VALUE
