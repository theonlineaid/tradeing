import {
  changeActionName,
  changeBuySellApi,
  changeClientCode,
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
import {addInWatchList, removeFromWatchList} from '#store/slices/watchList'
import ModalComponents from '#tws/components/buy-sell-modal/ModalComponents'
import cogoToast from 'cogo-toast'
import {useCookies} from 'react-cookie'
import {AiOutlineLineChart} from 'react-icons/ai'
import {BiFolderPlus} from 'react-icons/bi'
import {FaRegWindowClose} from 'react-icons/fa'
import {HiOutlineFolderRemove} from 'react-icons/hi'
import {v1 as uuidv1} from 'uuid'
import * as Yup from 'yup'
import {BlotterDataStruct, BlotterDataType} from '../../../../../common/types/blotter-data'
import {MarketDataType} from '../../../../../common/types/market-data'
import TradingInterface from '../../../../../common/types/trading-list'
import {BlotterDataContext} from '../../../../../context/blotterDataContext'
import {FixSocketContext} from '../../../../../context/fixSocketContext'
import {MarketDataContext} from '../../../../../context/marketDataContext'
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
  const {buySell, marketData} = useSelector((state: RootState) => state)
  const {userData, loginState, watchList, error} = useSelector((state: RootState) => state)

  // state
  const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0})
  const [menuProps, toggleMenu] = useMenuState()
  const [selectedRow, setSelectedRow] = useState({})
  const [demoData, setDemoData] = useState([])
  const [uuid, setUUID] = useState(null)
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false)
  const [bData, setbData] = useState<BlotterDataStruct[]>([])
  const [errors, setErrors] = useState([])
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
      fixSocket.send(JSON.stringify(updatedState))
    }
  }

  const onCellDoubleClicked = (params: any) => {
    dispatch(changeBuySellApi(INIT_BUY_SELL_API))
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
    bo_id: ''
    
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
    apiRef.current.grid = params.api
    apiRef.current.column = params.columnApi
  }

  const getRowStyle = (params) => {
    if (params.node.rowIndex % 2 === 0) {
      // Even rows
      return {background: 'dark:tw-bg-dark-400'}
    } else {
      // Odd rows
      return {background: 'dark:tw-bg-dark-300'}
    }
  }

  const getRowId = (params) => {
    return String(params?.data?.id)
  }

  // const loadAllBoAccount = async () => {
  //   let bo = await allUserBoInfo()
  //   dispatch(changeBoAccountData(bo.data.data))
  // }

  // useEffect(() => {
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

  const handleClick = (data) => {
    dispatch(addInWatchList(data))
  }

  const handleRemove = (data) => {
    dispatch(removeFromWatchList({id: data?.id}))
  }

  let rowData: any = []
  const WL = marketDatas.filter((mD) => watchList?.data?.some((wD) => mD.id === wD.id))
  rowData = !isWatchList ? marketDatas : WL

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
              <AgGridReact
                ref={gridRef}
                defaultColDef={defaultColDef}
                headerHeight={headerHeight}
                suppressRowClickSelection
                onDragStarted={onDragStarted}
                onDragStopped={onDragStopped}
                onGridReady={onGridReady}
                // rowData={api.queries['getITCHData("redux")']?.data as MarketDataStruct[] ?? []}
                // rowData={rowData.length > 1 ? rowData : demoData}
                rowData={rowData}
                pagination={false}
                cacheQuickFilter={true}
                animateRows={true}
                onCellClicked={onCellClicked}
                onCellDoubleClicked={onCellDoubleClicked}
                getRowHeight={getRowHeight}
                getRowStyle={getRowStyle}
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
                <MenuItem onClick={() => handleRemove(selectedRow)}>
                  <HiOutlineFolderRemove className='fs-16 fw-bold me-3' />
                  Remove From List
                </MenuItem>
              ) : (
                <MenuItem onClick={() => handleClick(selectedRow)}>
                  <BiFolderPlus className='fs-16 fw-bold me-3' />
                  Add To Watch List
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  dispatch(changeModalData(selectedRow))
                  dispatch(changeIsShow(true))
                }}
              >
                <AiOutlineLineChart className='fs-16 fw-bold me-3' />
                Trade
              </MenuItem>
              <MenuItem className='text-danger' onClick={() => toggleMenu(false)}>
                <FaRegWindowClose className='fs-16 fw-bold me-3' />
                Close
              </MenuItem>
            </ControlledMenu>
          </div>
        </div>
      </div>
    </>
  )
}
export default MarketData
