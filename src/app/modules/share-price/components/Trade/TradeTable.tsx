import {useLayoutEffect, useState} from 'react'
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css'
import {shareList} from '../../../auth/core/_requests'
import {TradeChart} from './TradeChart'
const {SearchBar} = Search

const columns = [
  {
    dataField: 'key',
    text: '#',
    sort: true,
  },
  {
    dataField: 'trading_code',
    text: 'trading Code',
    sort: true,
  },
  {
    dataField: 'ltp',
    text: 'LTP',
    sort: true,
  },
  {
    dataField: 'high',
    text: 'High',
    sort: true,
  },
  {
    dataField: 'low',
    text: 'Low',
    sort: true,
  },

  {
    dataField: 'closep',
    text: 'Closep',
    sort: true,
  },
  {
    dataField: 'ycp',
    text: 'Ycp',
    sort: true,
  },
  {
    dataField: 'change',
    text: 'Change',

    classes: (cell: any, row: any, rowIndex: number, colIndex: any) => {
      if (cell > 0) return 'text-success'
      return 'text-danger'
    },

    sort: true,
  },
  {
    dataField: 'trade',
    text: 'Trade',
    sort: true,
  },
  {
    dataField: 'value',
    text: 'Value',
    sort: true,
  },
  {
    dataField: 'vollume',
    text: 'Vollume',
    sort: true,
  },
]


export function TradeTable() {
  const [data, setData] = useState<any>([])

  const fetchData = async () => {
    try {
      const list: any = await shareList()

      setData(list.data)
    } catch (error) {
      console.error(error)
    }
  }

  useLayoutEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='row'>
      <ToolkitProvider keyField='key' data={data} columns={columns} search>
        {(props: {searchProps: any; baseProps: any}) => (
          <div>
            <div className='row'>
              <div className='col-md-4'>
                <SearchBar {...props.searchProps} className='col-md-6' />
              </div>
            </div>
            <hr />
          </div>
        )}
      </ToolkitProvider>
    </div>
  )
}
