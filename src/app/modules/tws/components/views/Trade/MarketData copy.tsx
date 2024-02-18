import {
  changeActionName,
  changeBuySellApi,
  changeClientCode,
  changeIsBuy,
  changeIsShow,
  changeModalData,
  resetBuySell,
} from '#store/slices/buysell'
import {ControlledMenu, MenuItem, useMenuState} from '@szhsin/react-menu'
import {ColDef, DragStartedEvent, DragStoppedEvent, GridReadyEvent} from 'ag-grid-community'
import 'ag-grid-community/dist/styles/ag-grid.css'
import {AgGridColumn, AgGridReact} from 'ag-grid-react'
import {some} from 'lodash'
import {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import CustomModal from '../../../../../common/components/CustomModal'
import './style.css'
// import {buySellBit} from 'src/app/modules/auth/core/_requests'
import {RootState} from '#store/index'
import {changeInstrumentName} from '#store/slices/linkedTable'
import {addInWatchList, removeFromWatchList} from '#store/slices/watchList'
import ModalComponents from '#tws/components/buy-sell-modal/ModalComponents'
import cogoToast from 'cogo-toast'
import {useCookies} from 'react-cookie'
import {AiOutlineLineChart} from 'react-icons/ai'
import {BiFolderPlus} from 'react-icons/bi'
import {FaRegWindowClose} from 'react-icons/fa'
import {FiList} from 'react-icons/fi'
import {HiOutlineFolderRemove} from 'react-icons/hi'
import {v1 as uuidv1} from 'uuid'
import * as Yup from 'yup'
import {BlotterDataType} from '../../../../../common/types/blotter-data'
import {MarketDataType} from '../../../../../common/types/market-data'
import TradingInterface from '../../../../../common/types/trading-list'
import {BlotterDataContext} from '../../../../../context/blotterDataContext'
import {FixSocketContext} from '../../../../../context/fixSocketContext'
import {MarketDataContext} from '../../../../../context/marketDataContext'
import BuySellBody from '../BuySell/BuySellBody'
import BlotterModal from './blotterModal'
import MarketDeptModal from './marketDeptModal'
/**
 * Trading List
 * @returns
 */
interface Props {
  isWatchList?: boolean
  checkData: ColDef<any>[]
  searchFilter?: any
  gridRef?: any
}

// * main function
const MarketData: React.FC<Props> = ({checkData, isWatchList, searchFilter, gridRef}) => {
  const [cookies] = useCookies(['Authorization'])
  // const gridRef: any = useRef()
  const getRowHeight = (params) => (params.node.group ? 30 : 20)
  const dispatch = useDispatch()

  // * Context Call
  const {blotterDatas, saveBlotterData} = useContext(BlotterDataContext) as BlotterDataType
  const {marketDatas, saveData} = useContext(MarketDataContext) as MarketDataType
  const {fixSocket} = useContext(FixSocketContext)
  const {buySell, marketData, linkedTable} = useSelector((state: RootState) => state)
  const {userData, loginState, watchList, error} = useSelector((state: RootState) => state)

  // state
  const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0})
  const [menuProps, toggleMenu] = useMenuState()
  const [selectedRow, setSelectedRow] = useState({})
  const [demoData, setDemoData] = useState<any>([])
  const [uuid, setUUID] = useState(null)
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false)
  const [instName, setInstName] = useState<any>('')
  const [errors, setErrors] = useState([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isMarketDeptModalOpen, setIsMarketDeptModalOpen] = useState<boolean>(false)
  const [isBlotterModalOpen, setIsBlotterModalOpen] = useState<boolean>(false)
  const [blotterType, setBlotterType] = useState('')
  const [instrumentName, setInstrumentName] = useState('')
  const [tradingListTableContainer, setTradingListTableContainer] = useState({
    width: 0,
    height: 0,
  })

  const tradingTableEl = useCallback((node) => {
    if (node !== null) {
      setTradingListTableContainer({
        height: node.getBoundingClientRect().height,
        width: node.getBoundingClientRect().width,
      })
    }
  }, [])

  const {onDragStarted, onDragStopped} = useDragColumnChange((e) =>
    console.log('Saving new column order!')
  )

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

  const onCellClicked = (params: any) => {
    dispatch(changeActionName('buySell'))
    dispatch(changeInstrumentName('mk-' + params?.data?.short_name))
    if (buySell?.isLock) return
    dispatch(changeModalData(params?.data))
  }

  //socket connection established

  const handleClose = () => {
    setIsConfirmationVisible(!isConfirmationVisible)
  }
  const setupUUID = () => {
    setUUID(uuidv1())
    localStorage.setItem('socketID', JSON.stringify({useId: userData?.profile?.id, uuid}))
  }

  useEffect(() => {
    const _data = localStorage.getItem('socketID')
    if (_data) {
      const data = JSON.parse(_data)
      if (data.userId !== userData?.profile?.id) {
        setupUUID()
      } else {
        setUUID(data.uuid)
      }
    } else {
      setupUUID()
    }
  }, [])

  // prettier-ignore
  const schema = Yup.object().shape({
    price : Yup.number().required().min(1).typeError('Price must be a number'),
    qty: Yup.number().required().min(1).typeError('Price must be a number'),
    // client_code: Yup.string().required(),
    dp_code : Yup.string().required(),
    // scrip     : Yup.string().required(),
    bo_no : Yup.number().required(),
    bo_id : Yup.number().required(),
  })

  // handleSubmit
  const handleSubmit = async (event: any) => {
    // console.log('from handleSubmit, isBuy: ', buySell.isBuy)
    event.preventDefault()

    setIsConfirmationVisible(!isConfirmationVisible)
    if (!fixSocket) return
    // console.log('have buySellSockets')

    // Listen for messages
    let a: any = null
    try {
      a = await schema.validate(buySell.buySellApi, {abortEarly: false})
      if (a) setErrors([])
    } catch (e) {
      if (e instanceof Yup.ValidationError) {
        e.inner.forEach((error) => {
          setErrors((prevState) => {
            console.log(error.message)
            prevState[(error as any)?.path as keyof TradingInterface] = error.message
            return prevState
          })
        })
      }
    }
    if (!a && Object.keys(errors).length > 0) {
      Object.keys(errors).forEach(function (key, index) {
        cogoToast.error(errors[key], {position: 'top-right'})
      })
      // cogoToast.error('Required field missing!', {position: 'top-right'})
      return
    }

    if (!buySell.clientCode) {
      alert('Client code is required!')
      return
    }

    if (buySell.isBuy) {
      const raqBody = {
        ...buySell.buySellApi,
        user: String(userData.profile?.id),
        scrip: buySell.modalData.short_name,
        qty: buySell.buySellApi.qty,
        price: buySell.buySellApi.price,
        // group_name: uuid,
        group_name: '12345',
        side: 'BUY',
        symbol: buySell.modalData.short_name,
        view_action: 'MAKE_TRADE',
        price_type: 'price_limit',
        client_code: buySell.clientCode,
      }
      //   const b:any =  {
      //     "orderId": "140",
      //     "client_ac": "14",
      //     "name": "ABBANK",
      //     "side": "Sell",
      //     "execQty": 20,
      //     "sentQty": 20,
      //     "limit": 20,
      //     "orderStatus": "Filled",
      //     "status": "Done",
      //     "execution": "100.0%",
      //     "execPx": 333,
      //     "date": "20230918-08:14:45.283"
      // }

      // saveBlotterData(b)
      // console.log({raqBody})
      fixSocket.send(JSON.stringify(raqBody))
      // fixSocket.send(JSON.stringify(raqBody))
    } else {
      const updatedState = {
        ...buySell.buySellApi,
        user: String(userData.profile?.id),
        scrip: buySell.modalData.short_name,
        price: buySell.buySellApi.price,
        qty: buySell.buySellApi.qty,
        // group_name: uuid,
        group_name: '12345',
        side: 'SELL',
        symbol: buySell.modalData.short_name,
        view_action: 'MAKE_TRADE',
        price_type: 'price_limit',
        client_code: buySell.clientCode,
      }
      // console.log({updatedState})
      fixSocket.send(JSON.stringify(updatedState))
    }
  }

  const onCellDoubleClicked = (params: any) => {
    dispatch(changeBuySellApi(INIT_BUY_SELL_API))
    dispatch(changeActionName('buySell'))
    dispatch(changeIsShow(true))
    dispatch(changeModalData(params?.data))
    dispatch(
      changeBuySellApi({
        price: Number(buySell?.isBuy ? params?.data?.ask : params?.data?.bid),
        qty: Number(buySell?.isBuy ? params?.data?.aq : params?.data?.bq),
      })
    )
  }

  const INIT_BUY_SELL_API: TradingInterface = {
    order_type:'',
    qty: 0,
    price: 0, 
    bo_id:''
  }

  const handleModalClose = () => {
    dispatch(resetBuySell())
    dispatch(changeIsShow(false))
    dispatch(changeBuySellApi(INIT_BUY_SELL_API))
    dispatch(changeClientCode(''))
  }

  const apiRef = useRef<any>({
    grid: undefined,
    column: undefined,
  })

  const onGridReady = (params: GridReadyEvent) => {
    params.api.forEachNode(function (rowNode) {
      rowNode.setSelected(rowNode.data.short_name === linkedTable?.instrumentName)
    })
    // const session = sessionStorage.getItem('trading_data1')
    // if (session) {
    //   const sessionData = JSON.parse(session)
    //   console.log(sessionData)
    // params.api.applyTransactionAsync({add: demoData})
    // }
    // params.api.applyTransactionAsync({add: marketDatas})
    apiRef.current.grid = params.api
    apiRef.current.column = params.columnApi
  }
  const handleFilter = (params, name) => {
    params.api.forEachNode(function (rowNode) {
      if (rowNode.data.short_name === name) {
        const index: any = rowNode?.rowIndex
        rowNode.setSelected(true)
        params.api.ensureIndexVisible(index, 'middle')
      }
    })
  }
  const onSelectChange = (params: GridReadyEvent) => {
    const type = linkedTable?.instrumentName.split('-')[0]
    const name = linkedTable?.instrumentName.split('-')[1]

    const marketDeptMatched =
      linkedTable?.marketDept === linkedTable?.marketData && linkedTable.marketData !== ''
    const blotterMatched =
      linkedTable?.blotter === linkedTable?.marketData && linkedTable.marketData !== ''
    const moverGainerMatched =
      linkedTable?.moversGainers === linkedTable?.marketData && linkedTable.marketData !== ''
    const orderSumMatched = linkedTable?.orderSummary === linkedTable?.marketData
    const positionSumMatched = linkedTable?.position === linkedTable?.marketData

    if (moverGainerMatched && type === 'mg') return handleFilter(params, name)
    else if (marketDeptMatched && type === 'md') return handleFilter(params, name)
    else if (blotterMatched && type === 'bt') return handleFilter(params, name)
    else if (orderSumMatched && type === 'os') return handleFilter(params, name)
    else if (positionSumMatched && type === 'ps') return handleFilter(params, name)
  }

  const getRowClass = (params) => {
    const type = linkedTable?.instrumentName.split('-')[0]
    const name = linkedTable?.instrumentName.split('-')[1]
    // const marketMatched = (linkedTable?.marketData === linkedTable?.blotter)
    const blotterMatched = linkedTable?.blotter === linkedTable?.marketData
    if (blotterMatched && type === 'bt') {
      if (params?.data?.short_name === name) {
        return 'ag-row-selected'
      }
    }

    // if (params.node.rowIndex % 2 === 0) {
    //   // Even rows
    //   return {background: 'dark:tw-bg-dark-400'}
    // } else {
    //   // Odd rows
    //   return {background: 'dark:tw-bg-dark-300'}
    // }
  }

  const getRowId = (params) => {
    return String(params?.data?.id)
  }

  // const loadAllBoAccount = async () => {
  //   let bo = await allUserBoInfo()
  //   dispatch(changeBoAccountData(bo.data.data))
  // }

  // useEffect(() => {
  //   // onSelection()
  //   loadAllBoAccount()
  // }, [])

  // Established Socket ITCH Data
  // function socketCallFinal() {
  //   const socket = new WebSocket('ws://10.238.41.67:8080/ws/v1/itch')
  //   console.log('****socket**', socket)

  //   let sl = 0
  //   // When the connection is established
  //   socket.onopen = (event) => {
  //     console.log('WebSocket connection established.')
  //   }

  //   // When a message is received
  //   socket.onmessage = (event) => {
  //     let data = new Date(Date.now())
  //     const itchData = JSON.parse(event.data)
  //     console.log({data: itchData, time: data.toISOString(), serial: sl})

  //     setMarketData((prevState) => {
  //       const idx = _.findIndex(prevState, (o) => o.id === itchData.id)
  //       if (idx === -1) {
  //         return [...prevState, itchData]
  //       } else {
  //         const updateData = prevState
  //         updateData[idx] = itchData
  //         return updateData
  //       }
  //     })
  //   }

  //   // When an error occurs
  //   socket.onerror = (event) => {
  //     console.error('WebSocket error:', event)
  //   }

  //   // When the connection is closed
  //   socket.onclose = (event) => {
  //     console.log('WebSocket connection closed:', event)
  //   }
  // }

  // useEffect(() => {
  //   socketCallFinal()
  // }, [socketCallFinal])

  // End established Socket Itch

  function formatNumber(number: number) {
    return Math.floor(number)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      // flex: 1,
      sortable: true,
      resizable: true,
      enableCellChangeFlash: true,
      cellClass: 'align-right',
      suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton: true},
      valueFormatter: (params) => {
        if (typeof params.value === 'string') return params.value
        return formatNumber(params.value)
      },
    }
  }, [])

  const headerHeight = 24
  if (!marketData) {
    return null
  }

  // === Data for the table ===
  let rowData: any = []
  if (marketDatas.length > 0) {
    const WL = marketDatas?.filter((mD) => watchList?.data?.some((wD) => mD.id === wD.id))
    rowData = !isWatchList ? marketDatas : WL
  }

  const session = sessionStorage.getItem('trading_data1')
  useEffect(() => {
    // setDemoData(marketDatas)
  }, [])

  const handleViewModal = () => {
    setIsModalOpen(!isModalOpen)
  }
  const handleMarketDeptModal = () => {
    setIsMarketDeptModalOpen(!isMarketDeptModalOpen)
  }
  const handleBlotterViewModal = () => {
    setIsBlotterModalOpen(!isBlotterModalOpen)
  }

  const handleRightClick = (param: any, type: string) => {
    setInstrumentName(param?.short_name)
    switch (type) {
      case 'watchList':
        dispatch(addInWatchList(param))
        break
      case 'removeWatchList':
        dispatch(removeFromWatchList({id: param?.id}))
        break
      case 'buy':
        dispatch(changeModalData(param))
        dispatch(changeIsShow(true))
        dispatch(changeIsBuy(true))
        dispatch(
          changeBuySellApi({
            price: Number(param?.bid),
          })
        )
        break
      case 'sell':
        dispatch(changeModalData(param))
        dispatch(changeIsShow(true))
        dispatch(changeIsBuy(false))
        dispatch(
          changeBuySellApi({
            price: Number(param?.ask),
          })
        )
        break
      case 'workingOrders':
        setBlotterType('workingOrders')
        handleBlotterViewModal()
        break
      case 'terminatedOrders':
        setBlotterType('terminatedOrders')
        handleBlotterViewModal()
        break
      case 'marketDept':
        setIsMarketDeptModalOpen(!isMarketDeptModalOpen)
        // dispatch(changeModalData(param))
        setInstName(param?.short_name)
        break

      default:
        break
    }
  }

  return (
    <>
      <CustomModal
        title='Trading'
        handleClose={handleModalClose}
        show={buySell.isShow}
        footer={<></>}
      >
        <ModalComponents
          handleSubmit={handleSubmit}
          handleClose={handleClose}
          isConfirmationVisible={isConfirmationVisible}
          buySell={buySell}
        />
      </CustomModal>

      <div className='trading-table w-100 h-100' ref={tradingTableEl}>
        <div style={{height: `${tradingListTableContainer.height - 50}px`}}>
          <div
            style={{height: '100%', width: '100%'}}
            className='ag-theme-balham'
            onContextMenu={(e) => {
              e.preventDefault()
              setAnchorPoint({x: e.clientX, y: e.clientY})
            }}
          >
            {checkData?.length ? (
              <div className='ag-theme-balham' style={{height: 500}}>
                <AgGridReact
                  ref={gridRef}
                  defaultColDef={defaultColDef}
                  headerHeight={headerHeight}
                  // suppressRowClickSelection
                  onDragStarted={onDragStarted}
                  onDragStopped={onDragStopped}
                  onGridReady={onGridReady}
                  onComponentStateChanged={onSelectChange}
                  rowSelection={'single'}
                  // rowData={api.queries['getITCHData("redux")']?.data as MarketDataStruct[] ?? []}
                  // rowData={rowData.length > 1 ? rowData : demoData}
                  rowData={rowData}
                  pagination={false}
                  cacheQuickFilter={true}
                  animateRows={true}
                  onCellClicked={onCellClicked}
                  onCellDoubleClicked={onCellDoubleClicked}
                  getRowHeight={getRowHeight}
                  getRowClass={getRowClass}
                  getRowId={getRowId}
                  className='header-black'
                >
                  {checkData && (
                    <AgGridColumn
                      headerName='ID'
                      field='id'
                      width={80}
                      cellStyle={() => {
                        return {fontWeight: 'bold'}
                      }}
                    />
                  )}

                  {checkData &&
                    checkData.map((data) => {
                      if (data.hide) return null
                      return (
                        <AgGridColumn
                          key={data.field}
                          filter='agTextColumnFilter'
                          // filterParams={columnFilterParams}
                          headerName={!data.hide ? data.headerName : ''}
                          field={!data.hide ? data.field : ''}
                          headerTooltip={data.headerName}
                          width={data.width}
                          valueFormatter={data?.valueFormatter}
                          valueParser={data?.valueParser}
                          cellRenderer={data?.cellRenderer}
                          // cellStyle={() => { return { fontSize: '10px', fontWeight: '600'}; } }
                          cellStyle={data?.cellStyle}
                          onCellContextMenu={(e) => {
                            toggleMenu(true)
                            setSelectedRow(e.data)
                          }}
                        />
                      )
                    })}
                </AgGridReact>
              </div>
            ) : (
              <div className='tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center'>
                <h3 className='tw-font-bold tw-text-gray-700 tw-text-xl'>Data loading error!</h3>
              </div>
            )}
            <ControlledMenu
              {...menuProps}
              anchorPoint={anchorPoint}
              direction='right'
              onClose={() => toggleMenu(false)}
              menuStyle={{minWidth: '200px', fontSize: '1.1rem'}}
              className='tw-bg-white dark:tw-bg-dark-500 dark:tw-text-slate-300 controlled-menu'
            >
              <div className='text-center px-3'>
                <h3 className='fs-18 dark:tw-text-slate-50'>{(selectedRow as any)?.scrip}</h3>
                <small className='dark:tw-text-slate-300'>{(selectedRow as any)?.full_name}</small>
              </div>
              <hr className='dark:tw-border-slate-500' />
              {some(watchList?.data, ['id', (selectedRow as any)?.id]) ? (
                <MenuItem onClick={() => handleRightClick(selectedRow, 'removeWatchList')}>
                  <HiOutlineFolderRemove className='fs-16 fw-bold me-3' />
                  Remove From List
                </MenuItem>
              ) : (
                <MenuItem onClick={() => handleRightClick(selectedRow, 'watchList')}>
                  <BiFolderPlus className='fs-16 fw-bold me-3' />
                  Add To Watch List
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  handleRightClick(selectedRow, 'buy')
                }}
              >
                <AiOutlineLineChart className='fs-16 fw-bold me-3 tw-text-emerald-600' />
                Buy
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleRightClick(selectedRow, 'sell')
                }}
              >
                <AiOutlineLineChart className='fs-16 fw-bold me-3 tw-text-red-600' />
                Sell
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleRightClick(selectedRow, 'workingOrders')
                }}
              >
                <FiList className='fs-16 fw-bold me-3' />
                Working Orders
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleRightClick(selectedRow, 'terminatedOrders')
                }}
              >
                <FiList className='fs-16 fw-bold me-3 tw-text-red-500' />
                Terminated Orders
              </MenuItem>
              <MenuItem onClick={() => handleRightClick(selectedRow, 'marketDept')}>
                <AiOutlineLineChart className='fs-16 fw-bold me-3' />
                Market Dept
              </MenuItem>
              <MenuItem className='text-danger' onClick={() => toggleMenu(false)}>
                <FaRegWindowClose className='fs-16 fw-bold me-3' />
                Close
              </MenuItem>
            </ControlledMenu>
          </div>
        </div>
      </div>
      {isModalOpen ? (
        <CustomModal
          style='modal-90w'
          handleClose={handleViewModal}
          show={isModalOpen}
          title='Market Depth'
          bgColor='bg-light'
          size='xl'
          children={
            <>
              <BuySellBody />
            </>
          }
        />
      ) : null}
      {isMarketDeptModalOpen ? (
        <CustomModal
          style='modal-90w'
          handleClose={handleMarketDeptModal}
          show={isMarketDeptModalOpen}
          title='Market Depth'
          bgColor='bg-light'
          size='xl'
          children={
            <>
              <MarketDeptModal isHidden={true} name={instrumentName} />
            </>
          }
        />
      ) : null}
      {/* MarketDeptModal */}
      {isBlotterModalOpen ? (
        <BlotterModal
          show={isBlotterModalOpen}
          handleClose={handleBlotterViewModal}
          type={blotterType}
          instrumentName={instrumentName}
        />
      ) : null}
    </>
  )
}
export default MarketData
