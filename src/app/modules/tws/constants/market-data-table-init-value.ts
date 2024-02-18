import {ColDef, ValueParserParams} from 'ag-grid-community'
function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue)
}
function tradeInitColumn(mode: string, fontSize = 11): ColDef<any>[] {
  const tableCell = {
    short_name: () => {
      return {fontSize: '11px', fontWeight: '600'}
    },
    group: () => {
      return {
        color: isDark ? '#4bb2ff' : 'rgb(21 89 141)',
        textAlign: 'right',
        fontSize: '11px',
        fontWeight: '600',
      }
    },
    bq: () => {
      return {textAlign: 'right', fontSize: '11px', fontWeight: '600'}
    },
    bid: () => {
      return {textAlign: 'right', fontSize: '11px', fontWeight: '600'}
    },
    ask: () => {
      return {textAlign: 'right', fontSize: '11px', fontWeight: '600'}
    },
    aq: () => {
      return {textAlign: 'right', fontSize: '11px', fontWeight: '600'}
    },
    last: (params) => {
      const style = {color: '#888', textAlign: 'right', fontSize: '11px', fontWeight: '600'}
      if (parseFloat(params.value) > 0) {
        return {...style, color: isDark ? '#4011db' : 'green'}
      } else if (parseFloat(params.value) < 0) {
        return {...style, color: isDark ? '#CC0909' : 'red'}
      } else {
        return style
      }
    },
    open: (params) => {
      const style = {color: '#888', textAlign: 'right', fontSize: '11px', fontWeight: '600'}
      if (parseFloat(params.value) > 0) {
        return {...style, color: isDark ? '#4011db' : 'green'}
      } else if (parseFloat(params.value) < 0) {
        return {...style, color: isDark ? '#CC0909' : 'red'}
      } else {
        return style
      }
    },
    high: () => {
      return {textAlign: 'right', fontSize: '11px', fontWeight: '600'}
    },
    low: () => {
      return {textAlign: 'right', fontSize: '11px', fontWeight: '600'}
    },
    volume: () => {
      return {textAlign: 'right', fontSize: '11px', fontWeight: '600'}
    },
    settle_1: () => {
      return {textAlign: 'right', fontSize: '11px', fontWeight: '600'}
    },
    settle: () => {
      return {textAlign: 'right', fontSize: '11px', fontWeight: '600'}
    },
    ct_tvol: () => {
      return {textAlign: 'right', fontSize: '11px', fontWeight: '600'}
    },
    orders: () => {
      return {textAlign: 'right', fontSize: '11px', fontWeight: '600'}
    },
  }
  let isDark = mode === 'dark'
  const MARKET_DATA_TABLE_INIT_VALUE: ColDef[] = [
    {
      field: 'short_name',
      headerName: 'Short Name',
      hide: false,
      width: 130,
      type: 'textColumn',
      headerClass: 'header-black',
      cellStyle: () => {
        // return {fontSize: '11px', fontWeight: '600'}
        return {fontSize: `${fontSize}px`, fontWeight: '600'}
      },
    },
    {
      field: 'group',
      headerName: 'Group',
      hide: false,
      width: 80,
      // type: 'numColumn',
      // valueParser: numberValueParser,
      cellStyle: () => {
        return {
          color: isDark ? '#4bb2ff' : 'rgb(21 89 141)',
          fontSize: `${fontSize}px`,
          fontWeight: '600',
        }
      },
      cellRenderer: 'agAnimateSlideCellRenderer',
    },
    {
      field: 'bq',
      headerName: 'BQ',
      hide: false,
      width: 65,
      type: 'numColumn',
      valueFormatter: (params) => params.value.toFixed(2),
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right', fontSize: `${fontSize}px`, fontWeight: '600'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'bid',
      headerName: 'Bid',
      hide: false,
      width: 100,
      type: 'numColumn',
      valueFormatter: (params) => Number(params.value.toFixed(2)),
      cellStyle: () => {
        return {textAlign: 'right', fontSize: `${fontSize}px`, fontWeight: '600'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'ask',
      headerName: 'Ask',
      hide: false,
      width: 65,
      type: 'numColumn',
      valueFormatter: (params) => Number(params.value.toFixed(2)),
      cellStyle: () => {
        return {textAlign: 'right', fontSize: `${fontSize}px`, fontWeight: '600'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'aq',
      headerName: 'AQ',
      hide: false,
      width: 65,
      type: 'numColumn',
      valueFormatter: (params) => params.value.toFixed(2),
      cellStyle: () => {
        return {textAlign: 'right', fontSize: `${fontSize}px`, fontWeight: '600'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'last',
      headerName: 'Last',
      hide: false,
      width: 65,
      type: 'numColumn',
      valueFormatter: (params) => params.value.toFixed(2),
      cellStyle: (params) => {
        const style = {
          color: '#888',
          textAlign: 'right',
          fontSize: `${fontSize}px`,
          fontWeight: '600',
        }
        if (parseFloat(params.value) > 0) {
          return {...style, color: isDark ? '#4011db' : 'green'}
        } else if (parseFloat(params.value) < 0) {
          return {...style, color: isDark ? '#CC0909' : 'red'}
        } else {
          return style
        }
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'open',
      headerName: 'Open',
      hide: false,
      width: 65,
      type: 'numColumn',
      valueFormatter: (params) => params.value.toFixed(2),
      cellStyle: (params) => {
        const style = {
          color: '#888',
          textAlign: 'right',
          fontSize: `${fontSize}px`,
          fontWeight: '600',
        }
        if (parseFloat(params.value) > 0) {
          return {...style, color: isDark ? '#4011db' : 'green'}
        } else if (parseFloat(params.value) < 0) {
          return {...style, color: isDark ? '#CC0909' : 'red'}
        } else {
          return style
        }
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'high',
      headerName: 'High',
      hide: false,
      width: 60,
      type: 'numColumn',
      valueFormatter: (params) => params.value.toFixed(2),
      cellStyle: () => {
        return {textAlign: 'right', fontSize: `${fontSize}px`, fontWeight: '600'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'low',
      headerName: 'Low',
      hide: false,
      width: 60,
      type: 'numColumn',
      valueFormatter: (params) => params.value.toFixed(2),
      cellStyle: () => {
        return {textAlign: 'right', fontSize: `${fontSize}px`, fontWeight: '600'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'volume',
      headerName: 'Volume',
      hide: false,
      width: 80,
      valueFormatter: (params) => params.value.toFixed(2),
      type: 'textColumn',
      cellStyle: (params) => {
        return {textAlign: 'right', fontSize: `${fontSize}px`, fontWeight: '600'}
      },
    },
    {
      field: 'd',
      headerName: 'D%',
      hide: false,
      width: 65,
      type: 'numColumn',
      valueFormatter: (params) => params.value.toFixed(2),
      cellStyle: (params) => {
        const style = {textAlign: 'right', fontSize: `${fontSize}px`, fontWeight: '600'}
        if (parseFloat(params.value) > 0) {
          return {...style, color: isDark ? '#00b894' : 'green'}
        } else if (parseFloat(params.value) < 0) {
          return {...style, color: isDark ? '#CC0909' : 'red'}
        } else {
          return style
        }
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'settle_1',
      headerName: 'Settle-1',
      hide: false,
      width: 65,
      type: 'numColumn',
      valueFormatter: (params) => params.value.toFixed(2),
      cellStyle: () => {
        return {textAlign: 'right', fontSize: `${fontSize}px`, fontWeight: '600'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'settle',
      headerName: 'Settle',
      hide: false,
      width: 65,
      type: 'numColumn',
      valueFormatter: (params) => params.value.toFixed(2),
      cellStyle: () => {
        return {textAlign: 'right', fontSize: `${fontSize}px`, fontWeight: '600'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'ct_tvol',
      headerName: 'Ct Tvol',
      hide: false,
      width: 70,
      type: 'numColumn',
      valueFormatter: (params) => params.value.toFixed(2),
      cellStyle: () => {
        return {textAlign: 'right', fontSize: `${fontSize}px`, fontWeight: '600'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
  ]
  return MARKET_DATA_TABLE_INIT_VALUE
}
export default tradeInitColumn
