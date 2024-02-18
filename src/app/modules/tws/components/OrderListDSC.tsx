import {DragStartedEvent, DragStoppedEvent, GridReadyEvent} from 'ag-grid-community'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import {AgGridColumn, AgGridReact} from 'ag-grid-react'
import {useCallback, useEffect, useRef, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {tradeAllOrdersBuy} from '../../auth/core/_requests'
import {toAbsoluteUrl} from './../../../../_metronic/helpers/AssetHelpers'

let initialValue = {
  id: true,
  order_id: true,
  dp_code: true,
  scrip: true,
  sent_qty: true,
  exect_qty: true,
  remain_qty: true,
  perchantage: true,
  average_price: true,
  side: true,
  limit: true,
  exec_value: true,
  status: true,
  sub_status: true,
  bo_account: true,
  buy_track: true,
  sell_track: true,
}
const contains = (target, lookingFor) => {
  return target && target.indexOf(lookingFor) >= 0
}
var columnFilterParams = {
  filterOptions: ['contains'],
  textMatcher: ({value, filterText}) => {
    var filterTextLowerCase = filterText ? filterText.toLowerCase() : ''
    var valueLowerCase = value.toString().toLowerCase()
    var aliases = {
      usa: 'united states',
      holland: 'netherlands',
      vodka: 'russia',
      niall: 'ireland',
      sean: 'south africa',
      alberto: 'mexico',
      john: 'australia',
      xi: 'china',
    }
    var literalMatch = contains(valueLowerCase, filterTextLowerCase)
    return !!literalMatch || !!contains(valueLowerCase, aliases[filterTextLowerCase])
  },
  trimInput: true,
  debounceMs: 1000,
}

function useDragColumnChange(cb: (e: DragStoppedEvent) => void) {
  const columnOrderRef = useRef<string[]>([])
  const onDragStarted = (e: DragStartedEvent) => {
    columnOrderRef.current = e.columnApi.getColumnState().map((c) => c.colId)
  }
  const onDragStopped = (e: DragStoppedEvent) => {
    const newColumnOrder = e.columnApi.getColumnState().map((c) => c.colId)
    const sameOrder = columnOrderRef.current.every((c, i) => c === newColumnOrder[i])

    if (!sameOrder) {
      cb(e)
    }
  }

  return {onDragStarted, onDragStopped}
}

export function OrderListDSC() {
  const [show, setShow] = useState(false)
  const [checkdata, setCheckData] = useState<any>(initialValue)
  const [visible, setVisible] = useState<any>(initialValue)
  const [modalData, setModalData] = useState<any>(null)
  const [data, setData] = useState<any>(null)
  const gridRef: any = useRef()
  const apiRef = useRef<any>({
    grid: undefined,
    column: undefined,
  })

  function currencyFormatter(params: any) {
    return params?.value
  }

  const onCellClicked = (params: any) => {
    setShow(true)
    setModalData(params?.data)
  }

  const onGridReady = (params: GridReadyEvent) => {
    apiRef.current.grid = params.api
    apiRef.current.column = params.columnApi
  }
  const {onDragStarted, onDragStopped} = useDragColumnChange((e) =>
    console.log('Saving new column order!')
  )
  const toggleDialog = (e: any, fieldName = '', checkedvalue = false) => {
    let FieldName_ = fieldName
    let checkedV = checkedvalue

    if (FieldName_) {
      setVisible({...visible, [FieldName_]: checkedV})
    } else {
      setVisible({...visible, [e.target.name]: e.target.checked})
    }
  }

  const fetchData = async () => {
    let getData = await tradeAllOrdersBuy()
    if (getData.data.status === 200) {
      setData(getData.data.data)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const defaultColDef = {
    sortable: true,
  }
  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv()
  }, [])

  return (
    <>
      <div className='d-flex align-items-center justify-content-between'>
        <div className='d-flex align-items-center justify-content-between mb-1'>
          <div className='d-flex align-items-center ms-1 me-2'>
            <h6 className='me-4 mb-0'>Portfolio</h6>
            <select className='form-select w-125px'>
              <option selected>User10</option>
              <option value='User11'>User11</option>
              <option value='User12'>User12</option>
            </select>
          </div>
          <div className='d-flex align-items-center me-2'>
            <h6 className='mb-0 mx-3'>Trade Code</h6>
            <input type='text' id='trade_code' className='form-control w-125px' name='trade_code' />
          </div>
          <div className='d-flex align-items-center me-2'>
            <h6 className='mb-0 mx-3'>Side</h6>
            <select className='form-select w-100px'>
              <option selected>All</option>
              <option value='buy'>Buy</option>
              <option value='sell'>Sell</option>
            </select>
          </div>
          <div className='d-flex align-items-center me-2'>
            <h6 className='mb-0 mx-3'>Status</h6>
            <select className='form-select w-125px'>
              <option selected>All</option>
              <option value='buy'>Queued</option>
              <option value='sell'>Partially Filled</option>
              <option value='Partially'>Filled</option>
              <option value='Replaced'>Replaced</option>
              <option value='Cancelled'>Cancelled</option>
              <option value='Rejected'>Rejected</option>
              <option value='OMS'>OMS Accepted</option>
            </select>
          </div>
          <div className='d-flex align-items-center me-2'>
            <h6 className='mb-0 mx-3'>Group By</h6>
            <select className='form-select w-125px'>
              <option selected>None</option>
              <option value='buy'>Trade Code</option>
              <option value='sell'>Exchange</option>
              <option value='sell'>Status</option>
              <option value='sell'>Side</option>
            </select>
          </div>
          <div className='d-flex align-items-center me-2'>
            <h6 className='mb-0 mx-3'>Order Id</h6>
            <input type='text' id='order_id' className='form-control w-100px' name='order_id' />
          </div>
          <div className='d-flex align-items-center me-2'>
            <h6 className='mb-0 mx-3'>From</h6>
            <input type='date' id='order_from' className='form-control w-125px' name='order_from' />
          </div>
          <div className='d-flex align-items-center me-2'>
            <h6 className='mb-0 mx-3'>To</h6>
            <input type='date' id='order_to' className='form-control w-125px' name='order_to' />
          </div>
          <div className='search-icon mt-0 py-1 px-4'>
            <img className='w-25px' src={toAbsoluteUrl('/media/icons/duotune/search.png')} alt='' />
          </div>
        </div>
        <div className='d-flex justify-content-center align-items-center gap-2 tradingListHeaderRight'>
          <button className='downloadCsv' onClick={onBtnExport} title='download'>
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
          </button>
          <Dropdown>
            <Dropdown.Toggle id='dropdown-basic' className='custom-btn' title='settings'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    name='lpt'
                    id='lpt'
                    defaultChecked={checkdata.lpt}
                    onClick={(e) => {
                      setCheckData({...checkdata, lpt: !checkdata.lpt})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='lpt'>
                    LPT
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    id='high'
                    name='high'
                    defaultChecked={checkdata.high}
                    onClick={() => {
                      setCheckData({...checkdata, high: !checkdata.high})
                    }}
                  />
                  <label className='form-check-label' htmlFor='high'>
                    High
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.low}
                    name='low'
                    id='low'
                    onClick={(e) => {
                      setCheckData({...checkdata, low: !checkdata.low})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='low'>
                    Low
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.close}
                    name='close'
                    id='close'
                    onClick={(e) => {
                      setCheckData({...checkdata, close: !checkdata.close})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='close'>
                    Close
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.ycp}
                    name='ycp'
                    id='ycp'
                    onClick={(e) => {
                      setCheckData({...checkdata, ycp: !checkdata.ycp})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='ycp'>
                    YCP
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.change}
                    name='change'
                    id='change'
                    onClick={(e) => {
                      setCheckData({...checkdata, change: !checkdata.change})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='change'>
                    Change
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.value}
                    name='value'
                    id='value'
                    onClick={(e) => {
                      setCheckData({...checkdata, value: !checkdata.value})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='value'>
                    Value
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.volume}
                    name='volume'
                    id='volume'
                    onClick={(e) => {
                      setCheckData({...checkdata, volume: !checkdata.volume})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='volume'>
                    Volume
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.business_segment}
                    name='business_segment'
                    id='business_segment'
                    onClick={(e) => {
                      setCheckData({...checkdata, business_segment: !checkdata.business_segment})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='business_segment'>
                    Business Segment
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.eps}
                    name='eps'
                    id='eps'
                    onClick={(e) => {
                      setCheckData({...checkdata, eps: !checkdata.eps})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='eps'>
                    EPS
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.floor_price}
                    name='floor_price'
                    id='floor_price'
                    onClick={(e) => {
                      setCheckData({...checkdata, floor_price: !checkdata.floor_price})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='floor_price'>
                    Floor Price
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.market_cap}
                    name='market_cap'
                    id='market_cap'
                    onClick={(e) => {
                      setCheckData({...checkdata, market_cap: !checkdata.market_cap})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='market_cap'>
                    Market Cap
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.audited_pe}
                    name='audited_pe'
                    id='audited_pe'
                    onClick={(e) => {
                      setCheckData({...checkdata, audited_pe: !checkdata.audited_pe})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='audited_pe'>
                    Audited Pe
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.authorized_cap}
                    name='authorized_cap'
                    id='authorized_cap'
                    onClick={(e) => {
                      setCheckData({...checkdata, authorized_cap: !checkdata.authorized_cap})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='authorized_cap'>
                    Authorized Cap
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.foreign}
                    name='foreign'
                    id='foreign'
                    onClick={(e) => {
                      setCheckData({...checkdata, foreign: !checkdata.foreign})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='foreign'>
                    Foreign
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.change_per}
                    name='change_per'
                    id='change_per'
                    onClick={(e) => {
                      setCheckData({...checkdata, change_per: !checkdata.change_per})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='change_per'>
                    Change Per
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.free_float}
                    name='free_float'
                    id='free_float'
                    onClick={(e) => {
                      setCheckData({...checkdata, free_float: !checkdata.free_float})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='free_float'>
                    Free Float
                  </label>
                </li>
              </Dropdown.Header>

              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.full_name}
                    name='full_name'
                    id='full_name'
                    onClick={(e) => {
                      setCheckData({...checkdata, full_name: !checkdata.full_name})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='full_name'>
                    full name
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.gov}
                    name='gov'
                    id='gov'
                    onClick={(e) => {
                      setCheckData({...checkdata, gov: !checkdata.gov})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='gov'>
                    gov
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.institute}
                    name='institute'
                    id='institute'
                    onClick={(e) => {
                      setCheckData({...checkdata, institute: !checkdata.institute})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='institute'>
                    institute
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.instrument_type}
                    name='instrument_type'
                    id='instrument_type'
                    onClick={(e) => {
                      setCheckData({...checkdata, instrument_type: !checkdata.instrument_type})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='instrument_type'>
                    instrument type
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.market_category}
                    name='market_category'
                    id='market_category'
                    onClick={(e) => {
                      setCheckData({...checkdata, market_category: !checkdata.market_category})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='market_category'>
                    market category
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.nav}
                    name='nav'
                    id='nav'
                    onClick={(e) => {
                      setCheckData({...checkdata, nav: !checkdata.nav})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='nav'>
                    nav
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.nav_price}
                    name='nav_price'
                    id='nav_price'
                    onClick={(e) => {
                      setCheckData({...checkdata, nav_price: !checkdata.nav_price})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='nav_price'>
                    nav_price
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.oci}
                    name='oci'
                    id='oci'
                    onClick={(e) => {
                      setCheckData({...checkdata, oci: !checkdata.oci})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='oci'>
                    oci
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.open_cahnge_per}
                    name='open_cahnge_per'
                    id='open_cahnge_per'
                    onClick={(e) => {
                      setCheckData({...checkdata, open_cahnge_per: !checkdata.open_cahnge_per})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='open_cahnge_per'>
                    open_cahnge_per
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.pe}
                    name='pe'
                    id='pe'
                    onClick={(e) => {
                      setCheckData({...checkdata, pe: !checkdata.pe})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='pe'>
                    pe
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.paid_up_cap}
                    name='paid_up_cap'
                    id='paid_up_cap'
                    onClick={(e) => {
                      setCheckData({...checkdata, paid_up_cap: !checkdata.paid_up_cap})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='paid_up_cap'>
                    paid up cap
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.public}
                    name='public'
                    id='public'
                    onClick={(e) => {
                      setCheckData({...checkdata, public: !checkdata.public})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='public'>
                    public
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.q1eps}
                    name='q1eps'
                    id='q1eps'
                    onClick={(e) => {
                      setCheckData({...checkdata, q1eps: !checkdata.q1eps})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='q1eps'>
                    q1eps
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.q2eps}
                    name='q2eps'
                    id='q2eps'
                    onClick={(e) => {
                      setCheckData({...checkdata, q2eps: !checkdata.q2eps})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='q2eps'>
                    q2eps
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.q3eps}
                    name='q3eps'
                    id='q3eps'
                    onClick={(e) => {
                      setCheckData({...checkdata, q3eps: !checkdata.q3eps})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='q3eps'>
                    q3eps
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.q4eps}
                    name='q4eps'
                    id='q4eps'
                    onClick={(e) => {
                      setCheckData({...checkdata, q4eps: !checkdata.q4eps})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='q4eps'>
                    q4eps
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.reserve_surplus}
                    name='reserve_surplus'
                    id='reserve_surplus'
                    onClick={(e) => {
                      setCheckData({...checkdata, reserve_surplus: !checkdata.reserve_surplus})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='reserve_surplus'>
                    reserve surplus
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.spark_line}
                    name='spark_line'
                    id='spark_line'
                    onClick={(e) => {
                      setCheckData({...checkdata, spark_line: !checkdata.spark_line})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='spark_line'>
                    spark line
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.sponsor_director}
                    name='sponsor_director'
                    id='sponsor_director'
                    onClick={(e) => {
                      setCheckData({...checkdata, sponsor_director: !checkdata.sponsor_director})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='sponsor_director'>
                    sponsor director
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.total_securites}
                    name='total_securites'
                    id='total_securites'
                    onClick={(e) => {
                      setCheckData({...checkdata, total_securites: !checkdata.total_securites})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='total_securites'>
                    total securites
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.un_audit_pe}
                    name='un_audit_pe'
                    id='un_audit_pe'
                    onClick={(e) => {
                      setCheckData({...checkdata, un_audit_pe: !checkdata.un_audit_pe})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='un_audit_pe'>
                    un audit pe
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.v_change}
                    name='v_change'
                    id='v_change'
                    onClick={(e) => {
                      setCheckData({...checkdata, v_change: !checkdata.v_change})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='v_change'>
                    v change
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.vol_change_per}
                    name='vol_change_per'
                    id='vol_change_per'
                    onClick={(e) => {
                      setCheckData({...checkdata, vol_change_per: !checkdata.vol_change_per})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='vol_change_per'>
                    vol change per
                  </label>
                </li>
              </Dropdown.Header>
              <Dropdown.Header>
                <li className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultChecked={checkdata.yvolume}
                    name='yvolume'
                    id='yvolume'
                    onClick={(e) => {
                      setCheckData({...checkdata, yvolume: !checkdata.yvolume})
                      toggleDialog(e)
                    }}
                  />
                  <label className='form-check-label' htmlFor='yvolume'>
                    yvolume
                  </label>
                </li>
              </Dropdown.Header>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div style={{height: '60vh'}}>
        <div style={{height: '100%', width: '100%'}} className='ag-theme-balham'>
          <AgGridReact
            ref={gridRef}
            defaultColDef={defaultColDef}
            rowSelection='multiple'
            suppressRowClickSelection
            onDragStarted={onDragStarted}
            onDragStopped={onDragStopped}
            onGridReady={onGridReady}
            rowData={data}
            pagination={true}
            cacheQuickFilter={true}
            onCellClicked={onCellClicked}
          >
            {/* <AgGridColumn headerName='ID' field='id' /> */}

            {checkdata.id && (
              <AgGridColumn
                filter='agTextColumnFilter'
                filterParams={columnFilterParams}
                field={checkdata.id ? 'id' : ''}
                headerName={checkdata.id ? 'ID' : ''}
                valueFormatter={currencyFormatter}
                width={100}
              />
            )}
            {checkdata.order_id && (
              <AgGridColumn
                filter='agTextColumnFilter'
                filterParams={columnFilterParams}
                headerName={checkdata.order_id ? 'Order id' : ''}
                field={checkdata.order_id ? 'order_id' : ''}
                width={160}
              />
            )}
            {checkdata.dp_code && (
              <AgGridColumn
                filter='agTextColumnFilter'
                filterParams={columnFilterParams}
                field={checkdata.dp_code ? 'dp_code' : ''}
                headerName={checkdata.dp_code ? 'DP Code' : ''}
                width={130}
              />
            )}
            {checkdata.scrip && (
              <AgGridColumn
                filter='agTextColumnFilter'
                filterParams={columnFilterParams}
                field={checkdata.scrip ? 'scrip' : ''}
                headerName={checkdata.scrip ? 'Scrip' : ''}
                width={100}
              />
            )}
            {checkdata.sent_qty && (
              <AgGridColumn
                filter='agTextColumnFilter'
                filterParams={columnFilterParams}
                field={checkdata.sent_qty ? 'sent_qty' : ''}
                headerName={checkdata.sent_qty ? 'Sent Qty' : ''}
                width={100}
              />
            )}
            {checkdata.exect_qty && (
              <AgGridColumn
                filter='agTextColumnFilter'
                filterParams={columnFilterParams}
                field='exect_qty'
                headerName='Exect Qty'
                width={100}
              />
            )}
            {checkdata.remain_qty && (
              <AgGridColumn
                filter='agTextColumnFilter'
                filterParams={columnFilterParams}
                field='remain_qty'
                headerName='Remain Qty'
                width={100}
              />
            )}
            {checkdata.perchantage && (
              <AgGridColumn
                filter='agTextColumnFilter'
                filterParams={columnFilterParams}
                field='perchantage'
                headerName='%'
                width={120}
              />
            )}
            {checkdata.average_price && (
              <AgGridColumn
                filter='agTextColumnFilter'
                filterParams={columnFilterParams}
                field='average_price'
                headerName='average_price'
                width={130}
              />
            )}
            {checkdata.side && (
              <AgGridColumn
                filter='agTextColumnFilter'
                filterParams={columnFilterParams}
                field='side'
                headerName='Side'
                width={100}
              />
            )}
            {checkdata.limit && (
              <AgGridColumn
                filter='agTextColumnFilter'
                filterParams={columnFilterParams}
                field='limit'
                headerName='Limit'
                width={130}
              />
            )}
            {checkdata.exec_value && (
              <AgGridColumn
                filter='agTextColumnFilter'
                filterParams={columnFilterParams}
                field='exec_value'
                headerName='Exect Value'
                width={130}
              />
            )}
            {checkdata.status && (
              <AgGridColumn
                filter='agTextColumnFilter'
                filterParams={columnFilterParams}
                field='status'
                headerName='Status'
                width={130}
              />
            )}
            {checkdata.sub_status && (
              <AgGridColumn
                filter='agTextColumnFilter'
                filterParams={columnFilterParams}
                field='sub_status'
                headerName='Sub Status'
              />
            )}
            {checkdata.buy_track && (
              <AgGridColumn
                filter='agTextColumnFilter'
                filterParams={columnFilterParams}
                field='buy_track'
                headerName='Buy Track'
              />
            )}
            {checkdata.sell_track && (
              <AgGridColumn
                filter='agTextColumnFilter'
                filterParams={columnFilterParams}
                field='sell_track'
                headerName='Sell Track'
              />
            )}
          </AgGridReact>
        </div>
      </div>
    </>
  )
}
