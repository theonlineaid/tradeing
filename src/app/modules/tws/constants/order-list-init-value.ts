import {ColDef, ValueParserParams} from 'ag-grid-community'
function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue)
}

function orderInitColumn(mode: string): ColDef[] {
  let isDark = mode === 'dark'

  const ORDER_LIST_INIT_VALUE: ColDef[] = [
    {                              
      field: 'order_id',
      headerName: 'Order Id',
      hide: false,
      width: 160,
    },
    {
      field: 'dsc_order_id',
      headerName: 'DSC Order Id',
      hide: false,
      width: 160,
    },
    {
      field: 'scrip',
      headerName: 'Company Code',
      hide: false,
      width: 150,
    },
    {
      field: 'side',
      headerName: 'Side',
      hide: false,
      width: 80,
      cellStyle: (params) => {
        if (params.value === 'Buy') {
          return {
            background: isDark ? '#0e3a27' : '#c1f0d4',
            color: isDark ? '#5ff2d0' : 'green',
            fontWeight: 'bold',
          }
        }
        return {
          background: isDark ? '#3d0707' : '#fee2e2', 
          color: isDark ? '#CC0909' : 'red', 
          fontWeight: 'bold'}
      },
    },
    {
      field: 'sent_qty',
      headerName: 'Sent Quantity',
      hide: false,
      width: 150,
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
    },
    {
      field: 'exect_qty',
      headerName: 'Exact Quantity',
      hide: false,
      width: 150,
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
    },
    {
      field: 'remain_qty',
      headerName: 'Remain Quantity',
      hide: false,
      width: 150,
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
    },
    {
      field: 'perchantage',
      headerName: 'Percentage',
      hide: false,
      width: 150,
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
    },
    {
      field: 'average_price',
      headerName: 'Average Price',
      hide: false,
      width: 140,
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
    },
    {
      field: 'limit',
      headerName: 'Limit',
      hide: false,
      width: 80,
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
    },
    {
      field: 'exec_value',
      headerName: 'Exact Value',
      hide: false,
      width: 120,
      valueParser: numberValueParser,
      cellStyle: () => {
        return {textAlign: 'right'}
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      hide: false,
      width: 100,
    },
    {
      field: 'sub_status',
      headerName: 'Sub Status',
      hide: false,
      width: 130,
    },
    {
      field: 'bo_account',
      headerName: 'BO Account',
      hide: false,
      width: 130,
    },
  ]
  return ORDER_LIST_INIT_VALUE
}

export default orderInitColumn
