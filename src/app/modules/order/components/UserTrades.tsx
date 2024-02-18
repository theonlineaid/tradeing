// import 'bootstrap/dist/css/bootstrap.min.css'
import {useLayoutEffect, useState} from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import {userTradeList} from '../../auth/core/_requests'
import ToolkitProvider, {
  Search,
} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit'

// Search
const SearchBar = (props) => {
  let input
  const handleChange = () => {
    props.onSearch(input.value)
  }
  return (
    <input
      className='form-control form-control-solid search-bar'
      ref={(n) => (input = n)}
      type='text'
      placeholder='Search Report..'
      onChange={handleChange}
    />
  )
}

export function UserTrades() {
  const [data, setData] = useState<any>([])

  const fetchData = async () => {
    try {
      const BoLists: any = await userTradeList(1)
      if (BoLists.data.statusCode === 200) {
        setData(BoLists.data.trades)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const columns = [
    {
      dataField: 'order_id',
      text: 'Order ID',
      sort: true,
    },
    {
      dataField: 'order_date',
      text: 'Order Date',
      formatter: (value: any, row: any, id: any) => {
        if (value) {
          return value.replaceAll('T18:00:00.000Z', '')
        }
      },
      sort: true,
    },
    {
      dataField: 'bo_account',
      text: 'Bo Code',
      sort: true,
    },
    {
      dataField: 'type',
      text: 'Type',
      sort: true,
    },
    {
      dataField: 'market_name',
      text: 'SE',
      sort: true,
    },

    {
      dataField: 'tradecode',
      text: 'Trading Code',
      sort: true,
    },
    {
      dataField: 'order_qty',
      text: 'Order Qty',
      sort: true,
    },
    {
      dataField: 'price',
      text: 'Pricing',
      sort: true,
    },
    {
      dataField: 'fixed_rate',
      text: 'Fixed Rate',
      sort: true,
    },
    {
      dataField: 'start_rate',
      text: 'Start Rate',
      sort: true,
    },
    {
      dataField: 'end_rate',
      text: 'End Rate',
      sort: true,
    },
    {
      dataField: 'final_rate',
      text: 'Final Rate',
      sort: true,
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: true,
    },
    {
      dataField: 'commission',
      text: 'Commission',
      sort: true,
    },
    {
      dataField: 'amount',
      text: 'Amount',
      sort: true,
    },
    {
      dataField: 'customer_note',
      text: 'Customer Note',
      sort: true,
    },
  ]

  // expand row
  const expandRow = {
    renderer: (row) => (
      <tr>
        <td className='child'>
          <ul className='order-trade-list'>
            <li>
              <span>End Rate</span> {row.end_rate}
            </li>
            <li>
              <span>Final Rate</span> {row.final_rate}
            </li>
            <li>
              <span>Status</span>{' '}
              <span className='badge bg-light-success px-2 py-1'>{row.status}</span>
            </li>
            <li>
              <span>Commission</span> {row.commission}
            </li>
            <li>
              <span>Amount</span> {row.amount}
            </li>
            <li>
              <span>Customer Note</span> {row.customer_note}
            </li>
          </ul>
        </td>
      </tr>
    ),
    showExpandColumn: true,
    // expandByColumnOnly: true,
    expandHeaderColumnRenderer: ({isAnyExpands}) => {
      if (isAnyExpands) {
        return <span className='expandMinus'>-</span>
      }
      return <span className='expandPlus'>+</span>
    },
    expandColumnRenderer: ({expanded}) => {
      if (expanded) {
        return <span className='expandMinus'>-</span>
      }
      return <span className='expandPlus'>+</span>
    },
  }

  useLayoutEffect(() => {
    fetchData()
  }, [])

  const MyExportCSV = (props) => {
    const handleClick = () => {
      props.onExport()
    }
    return (
      <a href='#' className='menu-link px-3' data-kt-export='csv' onClick={handleClick}>
        Export to CSV
      </a>
    )
  }

  return (
    <div className='order-trade'>
      <ToolkitProvider keyField='transaction_id' data={data} columns={columns} search exportCSV>
        {(props: {searchProps: any; baseProps: any; csvProps: any}) => (
          <div className='card rounded-2'>
            <div className='card-body'>
              <div className='card card-p-0 card-flush'>
                <div className='card-header align-items-center p-2 gap-2 gap-md-5'>
                  <div className='card-title'>
                    <SearchBar {...props.searchProps} />
                  </div>
                  <div className='card-toolbar flex-row-fluid justify-content-end gap-5'>
                    <button
                      type='button'
                      className='btn btn-light-primary'
                      data-kt-menu-trigger='click'
                      data-kt-menu-placement='bottom-end'
                    >
                      <span className='svg-icon svg-icon-2'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <rect
                            opacity='0.3'
                            x='12.75'
                            y='4.25'
                            width='12'
                            height='2'
                            rx='1'
                            transform='rotate(90 12.75 4.25)'
                            fill='currentColor'
                          />
                          <path
                            d='M12.0573 6.11875L13.5203 7.87435C13.9121 8.34457 14.6232 8.37683 15.056 7.94401C15.4457 7.5543 15.4641 6.92836 15.0979 6.51643L12.4974 3.59084C12.0996 3.14332 11.4004 3.14332 11.0026 3.59084L8.40206 6.51643C8.0359 6.92836 8.0543 7.5543 8.44401 7.94401C8.87683 8.37683 9.58785 8.34458 9.9797 7.87435L11.4427 6.11875C11.6026 5.92684 11.8974 5.92684 12.0573 6.11875Z'
                            fill='currentColor'
                          />
                          <path
                            d='M18.75 8.25H17.75C17.1977 8.25 16.75 8.69772 16.75 9.25C16.75 9.80228 17.1977 10.25 17.75 10.25C18.3023 10.25 18.75 10.6977 18.75 11.25V18.25C18.75 18.8023 18.3023 19.25 17.75 19.25H5.75C5.19772 19.25 4.75 18.8023 4.75 18.25V11.25C4.75 10.6977 5.19771 10.25 5.75 10.25C6.30229 10.25 6.75 9.80228 6.75 9.25C6.75 8.69772 6.30229 8.25 5.75 8.25H4.75C3.64543 8.25 2.75 9.14543 2.75 10.25V19.25C2.75 20.3546 3.64543 21.25 4.75 21.25H18.75C19.8546 21.25 20.75 20.3546 20.75 19.25V10.25C20.75 9.14543 19.8546 8.25 18.75 8.25Z'
                            fill='#C4C4C4'
                          />
                        </svg>
                      </span>
                      Export Report
                    </button>
                    <div
                      id='kt_datatable_example_1_export_menu'
                      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-200px py-4'
                      data-kt-menu='true'
                    >
                      <div className='menu-item px-3'>
                        <a href='#' className='menu-link px-3' data-kt-export='copy'>
                          Copy to clipboard
                        </a>
                      </div>
                      <div className='menu-item px-3'>
                        <MyExportCSV {...props.csvProps}>Export CSV!!</MyExportCSV>
                      </div>
                      <div className='menu-item px-3'>
                        <a href='#' className='menu-link px-3' data-kt-export='pdf'>
                          Export as PDF
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card-body'>
                  {/* <BootstrapTable
                    noDataIndication='Table is Empty'
                    bootstrap5
                    striped
                    expandRow={expandRow}
                    exportCSV
                    pagination={paginationFactory({})}
                    {...props.baseProps}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </ToolkitProvider>
    </div>
  )
}
