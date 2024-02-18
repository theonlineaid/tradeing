// * DOC - https://www.ag-grid.com/react-data-grid/change-cell-renderers/

import agGridValueChange from '#helpers/ag-grid-value-change'
import {removeError, riseNewError} from '#store/slices/error'
import {ControlledMenu, MenuItem, useMenuState} from '@szhsin/react-menu'
import {
  ColDef,
  DragStartedEvent,
  DragStoppedEvent,
  GridReadyEvent,
  RowClassParams,
} from 'ag-grid-community'
import 'ag-grid-community/dist/styles/ag-grid.css'
import {AgGridColumn, AgGridReact} from 'ag-grid-react'
import cogoToast from 'cogo-toast'
import {filter, includes, some, unionBy} from 'lodash'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {AiOutlineLineChart} from 'react-icons/ai'
import {BiFolderPlus} from 'react-icons/bi'
import {FaRegWindowClose} from 'react-icons/fa'
import {HiOutlineFolderRemove} from 'react-icons/hi'
import {useDispatch, useSelector} from 'react-redux'
import {v1 as uuidv1} from 'uuid'
import * as Yup from 'yup'
import CustomModal from '../../../../../common/components/CustomModal'
import TradingInterface from '../../../../../common/types/trading-list'
import {RootState, useAppDispatch} from '../../../../../redux'
import {
  changeBoAccountData,
  changeBuySellApi,
  changeClientCode,
  changeData,
  changeIsShow,
  changeModalData,
  changeTradeList,
} from '../../../../../redux/slices/buysell'
import {updateTradeListColumnShow} from '../../../../../redux/slices/tradeListColumnShow'
import {addInWatchList, removeFromWatchList} from '../../../../../redux/slices/watchList'
import {allUserBoInfo2, buySellBit} from '../../../../auth/core/_requests'
import BuySellModalBody from '../../buy-sell-modal/BuySellModalBody'
import BuySellModalFooter from '../../buy-sell-modal/BuySellModalFooter'
const INIT_BUY_SELL_API: TradingInterface = {
  order_type:'',
  qty: 0,
  price: 0, 
  bo_id:''
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
/**
 * Trading List
 * @returns
 */

interface Props {
  isWatchList?: boolean
  checkData: ColDef<any>[]
  searchFilter?: any
}

// * main function
const TradingList: React.FC<React.PropsWithChildren<Props>> = ({
  checkData,
  isWatchList = false,
  searchFilter,
}) => {
  const dispatch = useDispatch()
  const appDispatch = useAppDispatch()
  const buySell = useSelector((state: RootState) => state.buySell)
  const {userData, watchList, error} = useSelector((state: RootState) => state)

  // States
  // States
  const [marketData, setMarketData] = useState<any>(null)
  const [modalData, setModalData] = useState<any>(null)
  const [errors, setErrors] = useState({})
  const [tradingListTableContainer, setTradingListTableContainer] = useState({
    width: 0,
    height: 0,
  })

  const [menuProps, toggleMenu] = useMenuState()
  const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0})
  const [selectedRow, setSelectedRow] = useState({})
  const [refetchData, setRefetchData] = useState<boolean>(false)
  const [uuid, setUUID] = useState('')

  // Refs
  const gridRef: any = useRef()
  const getRowHeight = (params) => (params.node.group ? 30 : 20)

  const tradingTableEl = useCallback((node) => {
    if (node !== null) {
      setTradingListTableContainer({
        height: node.getBoundingClientRect().height,
        width: node.getBoundingClientRect().width,
      })
    }
  }, [])

  // Socket
  const tradeSocket: string = import.meta.env.REACT_APP_TRADE_LIST_SOCKET ?? ''
  const fetchSocketData = useCallback(() => {
    const sockets = new WebSocket(tradeSocket + '/')

    sockets.addEventListener('open', (event) =>
      console.log({open: event, time: new Date().toLocaleTimeString()})
    )

    // Listen for messages
    let updateCount = 0
    sockets.addEventListener('message', (event) => {
      let data = JSON.parse(event.data)
      if (data?.data) {
        if (error?.['trading']) {
          console.log('have trading error')

          dispatch(removeError('trading'))
        }
        if (updateCount < 1) {
          setMarketData(data.data)
          // dispatch(
          //   updateTradeListData({
          //     data: data?.data,
          //     isError: false,
          //     isLoading: false,
          //   })
          // )
          // dispatch(incrementTradingDataUpdate())
          updateCount = updateCount + 1
        } else {
          // TODO: increment the tradingListData.updateCount
          // dispatch(incrementTradingDataUpdate())
          updateCount += 1
          // * If ticker update by this socket data then the socket data update ticker state
          // dispatch(updateSocketChange(data.data))
          agGridValueChange(gridRef, data.data)
          // TODO: update the changes using lodash union
          setMarketData((prevState) => unionBy(prevState, data.data, 'id'))
          // dispatch(
          //   updateTradeListData({
          //     data: updatedValue,
          //     isError: false,
          //     isLoading: false,
          //   })
          // )
        }
      }
    })

    sockets.addEventListener('error', (event) => {
      sessionStorage.setItem('trading_data', JSON.stringify(marketData))
      appDispatch(
        riseNewError({
          data: {
            message: 'There are an error to connecting server!',
            type: 'Error',
          },
          identifier: 'trading',
        })
      )
      // dispatch(
      //   updateTradeListData({
      //     data: [],
      //     isError: true,
      //     errorMsg: 'There are an error to connecting server!',
      //     isLoading: false,
      //   })
      // )
    })

    sockets.addEventListener('close', (event) => {
      sessionStorage.setItem('trading_data', JSON.stringify(marketData))
      appDispatch(
        riseNewError({
          data: {
            message: 'There are an error to connecting server!',
            type: 'Error',
          },
          identifier: 'trading',
        })
      )
      // dispatch(
      //   updateTradeListData({
      //     data: [],
      //     isError: true,
      //     errorMsg: 'Connection closed!',
      //     isLoading: false,
      //   })
      // )
    })
  }, [dispatch, tradeSocket])

  useEffect(() => {
    const session = sessionStorage.getItem('trading_data')
    if (session) {
      const sessionData = JSON.parse(session)
      setMarketData(sessionData)
    }
  }, [])

  useEffect(() => {
    fetchSocketData()
  }, [fetchSocketData, tradeSocket])

  // Actions
  const handleModalClose = () => {
    dispatch(changeIsShow(false))
    dispatch(changeBuySellApi(INIT_BUY_SELL_API))
    dispatch(changeClientCode(''))
  }
  window.onclick = function (event) {
    if (buySell.tradeList) {
      dispatch(changeTradeList(!buySell.tradeList))
    }
  }

  const apiRef = useRef<any>({
    grid: undefined,
    column: undefined,
  })

  const fetchData = async (data) => {
    try {
      let getData: any = await buySellBit(data?.scrip)
      dispatch(changeData(getData.data.data))
    } catch (error) {
      console.error(error)
    }
  }

  const loadAllBoAccount = async () => {
    if (userData?.profile?.users_status === 'trader') {
      const bo = await allUserBoInfo2(userData.profile?.user_detail?.trader_id)
      const payload = {
        data: bo.data.data,
        users_status: userData.profile.users_status,
        user_detail: userData.profile?.user_detail,
      }
      dispatch(changeBoAccountData(payload))
    } else {
      dispatch(changeBoAccountData(userData.profile))
    }
  }

  useEffect(() => {
    loadAllBoAccount()
  }, [])

  const onCellClicked = (params: any) => {
    dispatch(changeModalData(params?.data))
    fetchData(params?.data)
  }
  const onCellDoubleClicked = (params: any) => {
    dispatch(changeIsShow(true))
    dispatch(changeModalData(params?.data))
    fetchData(params?.data)
  }

  const onGridReady = (params: GridReadyEvent) => {
    apiRef.current.grid = params.api
    apiRef.current.column = params.columnApi
  }

  const {onDragStarted, onDragStopped} = useDragColumnChange((e) =>
    console.log('Saving new column order!')
  )

  useEffect(() => {
    dispatch(updateTradeListColumnShow(checkData))
  }, [checkData, dispatch])

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      // flex: 1,
      sortable: true,
      enableCellChangeFlash: true,
      cellClass: 'align-right',
      valueFormatter: (params) => {
        if (typeof params.value === 'string') return params.value
        return formatNumber(params.value)
      },
    }
  }, [])

  // Search filter on table
  useEffect(() => {
    gridRef.current?.api?.setQuickFilter(searchFilter)
  }, [searchFilter, gridRef?.api])

  // useEffect(() => {
  //   if (!gridRef.current?.api || isWatchList) return
  //   const int = setInterval(onUpdateSomeValues, 500)
  //   return () => clearInterval(int)
  // }, [gridRef.current?.api, isWatchList])

  function formatNumber(number: number) {
    return Math.floor(number)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  const handleClick = (data) => {
    dispatch(addInWatchList(data))
  }
  const handleRemove = (data) => {
    dispatch(removeFromWatchList({id: data?.id}))
  }

  const handleRowHighlight = (params: RowClassParams<any>) => {
    if (includes(watchList.data, params.data)) {
      return {background: 'red'}
    }
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

  // prettier-ignore
  const schema = Yup.object().shape({
      bid_price : Yup.number().required().min(1),
      remain_qty: Yup.number().required().min(1),
      price_type: Yup.string().required(),
      dp_code   : Yup.string().required(),
      scrip     : Yup.string().required(),
      bo_no     : Yup.number().required(),
      bo_id     : Yup.number().required(),
    })

  // userBase UUID setup
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

  //socket connection established
  const buySellSocketURL: string = `${import.meta.env.REACT_APP_BUY_SELL_SOCKET}/${uuid}/`
  const buySellSockets: null | WebSocket = useMemo(() => {
    if (buySellSocketURL.endsWith('ws//')) {
      return null
    } else {
      return new WebSocket(buySellSocketURL)
    }
  }, [buySellSocketURL])

  // handleSubmit
  const handleSubmit = async (event: any) => {
    event.preventDefault()

    if (!buySellSockets) return

    buySellSockets.addEventListener('open', (event) =>
      // console.log({open: event, time: new Date().toLocaleTimeString()})
      console.log('this is from trading list')
    )

    // Listen for messages
    buySellSockets.addEventListener('message', (event) => {
      const data = JSON.parse(event?.data)
      if (data?.status == 200 || data?.status == 201) {
        fetchData(buySell.modalData)
        dispatch(changeBuySellApi(INIT_BUY_SELL_API))
        dispatch(changeClientCode(''))
        cogoToast.success('Trading successful', {position: 'top-right'})
        alert(JSON.stringify(data, null, 4))
      } else {
        cogoToast.error('Something went wrong', {position: 'top-right'})
      }
      console.log({event})
    })

    buySellSockets.addEventListener('error', (event) => {
      console.log({error: event})
      localStorage.removeItem('socketID')
    })

    buySellSockets.addEventListener('close', (event) => {
      console.log({close: event})
      localStorage.removeItem('socketID')
    })

    try {
      await schema.validate(buySell.buySellApi, {abortEarly: false})
    } catch (e) {
      if (e instanceof Yup.ValidationError) {
        e.inner.forEach((error) => {
          errors[(error as any)?.path as keyof TradingInterface] = error.message
        })
      }
    }

    if (!Object.keys(errors).length) {
      cogoToast.error('Required field missing!', {position: 'top-right'})
      return
    }

    if (buySell.isBuy) {
      const raqBody = {
        ...buySell.buySellApi,
        user: String(userData.profile?.id),
        scrip: buySell.modalData.short_name,
        bid_qty: buySell.buySellApi.qty,
        bid_price: buySell.buySellApi.price,
        group_name: uuid,
        side: 'Buy',
        symbol: 'BDT',
        view_action: 'MAKE_TRADE',
        price_type: 'price_limit',
      }
      console.log({raqBody})
      buySellSockets.send(JSON.stringify(raqBody))
    } else {
      const updatedState = {
        ...buySell.buySellApi,
        user: String(userData.profile?.id),
        scrip: buySell.modalData.short_name,
        ask_price: buySell.buySellApi.price,
        // ask_qty: buySell.buySellApi.qty,
        bid_qty: buySell.buySellApi.qty,
        group_name: uuid,
        side: 'Sell',
        symbol: 'BDT',
        view_action: 'MAKE_TRADE',
        price_type: 'price_limit',
      }
      buySellSockets.send(JSON.stringify(updatedState))
    }
  }

  const headerHeight = 24
  return (
    <>
      {/* <MarketData/> */}
      <CustomModal
        title='Trading'
        handleClose={handleModalClose}
        show={buySell.isShow}
        footer={<BuySellModalFooter onConfirm={handleSubmit} />}
      >
        <BuySellModalBody />
      </CustomModal>

      <div>
        <button
          className='tw-p-3'
          onClick={() =>
            appDispatch(
              riseNewError({
                data: {
                  message: 'There are an error to connecting server!',
                  type: 'Error',
                },
                identifier: 'trading',
              })
            )
          }
        >
          Rise Error
        </button>
      </div>

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
                rowData={
                  isWatchList
                    ? filter(marketData, (item) => some(watchList?.data, ['id', item.id]))
                    : JSON.parse(JSON.stringify(marketData))
                }
                pagination={false}
                cacheQuickFilter={true}
                // suppressAggFuncInHeader={true}
                animateRows={true}
                onCellClicked={onCellClicked}
                onCellDoubleClicked={onCellDoubleClicked}
                getRowHeight={getRowHeight}
                getRowStyle={getRowStyle}
                getRowId={getRowId}
              >
                {checkData && <AgGridColumn headerName='ID' field='id' width={50} />}

                {checkData &&
                  checkData.map((data) => {
                    if (data.hide) return null
                    return (
                      <AgGridColumn
                        key={data.field}
                        filter='agTextColumnFilter'
                        filterParams={columnFilterParams}
                        headerName={!data.hide ? data.headerName : ''}
                        field={!data.hide ? data.field : ''}
                        headerTooltip={data.headerName}
                        width={data.width}
                        valueParser={data?.valueParser}
                        cellRenderer={data?.cellRenderer}
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
export default TradingList
