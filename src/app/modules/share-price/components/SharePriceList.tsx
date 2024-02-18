import {useLayoutEffect, useState} from 'react'
import {shareList} from '../../auth/core/_requests'

// import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
// import 'bootstrap/dist/css/bootstrap.min.css'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import paginationFactory from 'react-bootstrap-table2-paginator'
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit'
import {ShareChart} from '../ShareChart'

const {SearchBar} = Search

export function NewOrder() {
  const [data, setData] = useState<any>([])

  const moveModal = async () => {
    window.resizeTo(104, 90)
  }

  const columns = [
    {
      dataField: 'key',
      text: '#',
      sort: true,
    },
    {
      dataField: 'trading_code',
      text: 'Trading Code',
      sort: true,

      formatter: (id, row, key) => {
        if (row) {
          return (
            <>
              <a
                href='#'
                className='table-popup'
                data-bs-toggle='modal'
                data-bs-target='#sharePrice_graph'
                id='shareGraph_btn'
                onClick={() => moveModal()}
              >
                {row.trading_code}
              </a>
            </>
          )
        }
      },
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
      // hidden: 'lg',
    },
    {
      dataField: 'volume',
      text: 'Volume',
      sort: true,
    },
  ]

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
    <div className='share_list'>
      <ToolkitProvider keyField='key' data={data} columns={columns} search>
        {(props: {searchProps: any; baseProps: any}) => (
          <div>
            <div className='row'>
              <div className='col-md-4'>
                <SearchBar {...props.searchProps} className='col-md-6' />
              </div>
            </div>

            <hr />
            {/* <BootstrapTable
              noDataIndication='Table is Empty'
              bootstrap5
              striped
              hover
              pagination={paginationFactory({})}
              {...props.baseProps}
            /> */}

            <div className='modal fade' id='sharePrice_graph' aria-hidden='true'>
              <div className='modal-dialog modal-xl modal-dialog-centered'>
                <div className='modal-content' id='modalCOntent'>
                  <div className='modal-body'>
                    <ShareChart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ToolkitProvider>
    </div>
  )
}
