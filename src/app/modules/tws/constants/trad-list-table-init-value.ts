import {ColDef, ValueParserParams} from 'ag-grid-community'
function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue)
}
function tradeInitColumn(mode: string): ColDef[] {
  const tableCell = {
    scrip: () => {
      return {fontWeight: 'bold'}
    },
    lpt : () => {
      return {
        color: isDark ? '#4bb2ff' : 'rgb(21 89 141)',
        textAlign: 'right',
      }
    },
    high : () => {
      return {textAlign: 'right'}
    },
    low : () => {
      return {textAlign: 'right'}
    },
    close : () => {
      return {textAlign: 'right'}
    },
    ycp : () => {
      return {textAlign: 'right'}
    },
    change : (params) => {
      const style = {color: '#888', textAlign: 'right', fontWeight: 'bold'}
      if (parseFloat(params.value) > 0) {
        return {...style, color: isDark ? '#5ff2d0' : 'green'}
      } else if (parseFloat(params.value) < 0) {
        return {...style, color: isDark ? '#CC0909' : 'red'}
      } else {
        return style
      }
    },
    change_per : (params) => {
      const style = {color: '#888', textAlign: 'right', fontWeight: 'bold'}
      if (parseFloat(params.value) > 0) {
        return {...style, color: isDark ? '#5ff2d0' : 'green'}
      } else if (parseFloat(params.value) < 0) {
        return {...style, color: isDark ? '#CC0909' : 'red'}
      } else {
        return style
      }
    },
     value : () => {
      return {textAlign: 'right'}
    },
    volume : () => {
      return {textAlign: 'right'}
    },
    eps : () => {
      return {textAlign: 'right'}
    },
    floor_price : () => {
      return {textAlign: 'right'}
    },
    market_cap: () => {
      return {textAlign: 'right'}
    },
    audited_pe: () => {
      return {textAlign: 'right'}
    },
    authorized_cap: () => {
      return {textAlign: 'right'}
    },
    foreign: () => {
      return {textAlign: 'right'}
    },
    gov: () => {
      return {textAlign: 'right'}
    },
    institute: () => {
      return {textAlign: 'right'}
    },
    nav: () => {
      return {textAlign: 'right'}
    },
    nav_price: () => {
      return {textAlign: 'right'}
    },
    oci: () => {
      return {textAlign: 'right'}
    },
    open : () => {
      return {textAlign: 'right'}
    },
    open_cahnge_per: () => {
      return {textAlign: 'right'}
    },
    pe: () => {
      return {textAlign: 'right'}
    },
    paid_up_cap: () => {
      return {textAlign: 'right'}
    },
    public : () => {
      return {textAlign: 'right'}
    },
    q1eps: () => {
      return {textAlign: 'right'}
    },
    q2eps: () => {
      return {textAlign: 'right'}
    },
    q3eps: () => {
      return {textAlign: 'right'}
    },
    q4eps: () => {
      return {textAlign: 'right'}
    },
    reserve_surplus: () => {
      return {textAlign: 'right'}
    },
    spark_line: () => {
      return {textAlign: 'right'}
    },
    sponsor_director: () => {
      return {textAlign: 'right'}
    },
    total_securites: () => {
      return {textAlign: 'right'}
    },
    trade: () => {
      return {textAlign: 'right'}
    },
    un_audit_pe: () => {
      return {textAlign: 'right'}
    },
    v_change: () => {
      return {textAlign: 'right'}
    },
    vol_change_per: () => {
      return {textAlign: 'right'}
    },
    yvolume: () => {
      return {textAlign: 'right'}
    },
  }

  let isDark = mode === 'dark'
  const TABLE_INIT_VALUE: ColDef[] = [
    {
      field: 'scrip',
      headerName: 'Company Name',
      hide: false,
      width: 140,
      type: 'textColumn',
      cellStyle: () => {
        return {fontWeight: 'bold'}
      },
    },
    {
      field: 'lpt',
      headerName: 'LPT',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {
          color: isDark ? '#4bb2ff' : 'rgb(21 89 141)',
          textAlign: 'right',
        }
      },
      cellRenderer: 'agAnimateSlideCellRenderer',
    },
    {
      field: 'high',
      headerName: 'High',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'low',
      headerName: 'Low',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'close',
      headerName: 'Close',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'ycp',
      headerName: 'YCP',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'change',
      headerName: 'Change',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: (params) => {
        const style = {color: '#888', textAlign: 'right', fontWeight: 'bold'}
        if (parseFloat(params.value) > 0) {
          return {...style, color: isDark ? '#5ff2d0' : 'green'}
        } else if (parseFloat(params.value) < 0) {
          return {...style, color: isDark ? '#CC0909' : 'red'}
        } else {
          return style
        }
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'change_per',
      headerName: 'Change Per',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: (params) => {
        const style = {color: '#888', textAlign: 'right', fontWeight: 'bold'}
        if (parseFloat(params.value) > 0) {
          return {...style, color: isDark ? '#5ff2d0' : 'green'}
        } else if (parseFloat(params.value) < 0) {
          return {...style, color: isDark ? '#CC0909' : 'red'}
        } else {
          return style
        }
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'value',
      headerName: 'Value',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'volume',
      headerName: 'Volume',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'business_segment',
      headerName: 'Business Segment',
      hide: false,
      width: 80,
      type: 'textColumn',
    },
    {
      field: 'eps',
      headerName: 'EPS',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'floor_price',
      headerName: 'Floor Price',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'market_cap',
      headerName: 'Market Cap',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'audited_pe',
      headerName: 'Audited Pe',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'authorized_cap',
      headerName: 'Authorized Cap',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'foreign',
      headerName: 'Foreign',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'full_name',
      headerName: 'Full Name',
      hide: false,
      width: 80,
      type: 'textColumn',
    },
    {
      field: 'gov',
      headerName: 'Gov',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'institute',
      headerName: 'Institute',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'instrument_type',
      headerName: 'Instrument Type',
      hide: false,
      width: 80,
      type: 'textColumn',
    },
    {
      field: 'market_category',
      headerName: 'Market Category',
      hide: false,
      width: 80,
      type: 'textColumn',
    },
    {
      field: 'nav',
      headerName: 'NAV',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'nav_price',
      headerName: 'Nav Price',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'oci',
      headerName: 'OCI',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'open',
      headerName: 'Open',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'open_cahnge_per',
      headerName: 'Open Cahnge Per',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'pe',
      headerName: 'PE',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'paid_up_cap',
      headerName: 'Paid Up Cap',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'public',
      headerName: 'Public',
      hide: true,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'q1eps',
      headerName: 'Q1 eps',
      hide: true,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'q2eps',
      headerName: 'Q2 eps',
      hide: true,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'q3eps',
      headerName: 'Q3 eps',
      hide: true,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'q4eps',
      headerName: 'Q4 eps',
      hide: true,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'reserve_surplus',
      headerName: 'Reserve Surplus',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'spark_line',
      headerName: 'Spark Line',
      hide: true,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'sponsor_director',
      headerName: 'Sponsor Director',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'total_securites',
      headerName: 'Total Securities',
      hide: false,
      width: 140,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'trade',
      headerName: 'Trade',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'un_audit_pe',
      headerName: 'Un Audit Pe',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'v_change',
      headerName: 'V Change',
      hide: false,
      width: 140,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'vol_change_per',
      headerName: 'Vol Change Per',
      hide: false,
      width: 80,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'yvolume',
      headerName: 'yvolume',
      hide: false,
      width: 140,
      type: 'numColumn',
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
  ]
  return TABLE_INIT_VALUE
}
export default tradeInitColumn
