import {
  changeActionName,
  changeBoAccountData,
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
import {BlotterDataContext} from '#context/blotterDataContext'
import {FilterMarketDataContext} from '#context/filterMarketDataContext'
import {FixSocketContext} from '#context/fixSocketContext'
import useMarketDataFilter from '#hooks/useMarketDataFilter'
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
import {MarketDataContext} from '../../../../../context/marketDataContext'
import {allUserBoInfo2} from '../../../../auth/core/_requests'
import BuySellBody from '../BuySell/BuySellBody'
import HistoricalVolProfile from './HistoricalVolProfile'
import SalesBusiness from './SalesBusiness'
import SalesMain from './SalesMain'
import BlotterModal from './blotterModal'
import CompanyParticular from './companyParticular'
import data from './marketData.json'
import MarketDeptModal from './marketDeptModal'
import NewsModal from './newsModal'
/**
 * Trading List
 * @returns
 */
interface Props {
  isWatchList?: boolean
  checkData: ColDef<any>[]
  searchFilter?: any
  gridRef?: any
  flashSettings?: any
  fontSize: any
  tableName?: any
}

// * main function
const MarketData: React.FC<Props> = ({
  checkData,
  isWatchList,
  searchFilter,
  gridRef,
  flashSettings,
  fontSize,
  tableName,
}) => {
  const [cookies] = useCookies(['Authorization'])
  // const gridRef: any = useRef()
  const getRowHeight = (params) => (params.node.group ? 30 : 20)
  const dispatch = useDispatch()

  // * Context Call
  const {blotterDatas, saveBlotterData} = useContext(BlotterDataContext) as BlotterDataType
  const {marketDatas, saveData} = useContext(MarketDataContext) as MarketDataType
  const {fixSocket} = useContext(FixSocketContext)
  const {filterMarketData} = useContext(FilterMarketDataContext)
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
  const [isBuySellModalOpen, setIsBuySellModalOpen] = useState<boolean>(false)
  const [isMarketDeptModalOpen, setIsMarketDeptModalOpen] = useState<boolean>(false)
  const [isParticularModalOpen, setIsParticularModalOpen] = useState<boolean>(false)
  const [isSalesMainModalOpen, setIsSalesMainModalOpen] = useState<boolean>(false)
  const [isNewsModalOpen, setIsNewsModalOpen] = useState<boolean>(false)
  const [isSalesBusinessModalOpen, setIsSalesBusinessModalOpen] = useState<boolean>(false)
  const [isHistoricalVolProfileModalOpen, setIsHistoricalVolProfileModalOpen] =
    useState<boolean>(false)
  const [isBlotterModalOpen, setIsBlotterModalOpen] = useState<boolean>(false)
  const [blotterType, setBlotterType] = useState('')
  const [instrumentName, setInstrumentName] = useState('')
  const [farmId, setFarmId] = useState('')
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
    price: Yup.number().required().min(1).typeError('Price must be a number'),
    qty: Yup.number().required().min(1).typeError('Price must be a number'),
    // client_code: Yup.string().required(),
    // dp_code: Yup.string().required(),
    // scrip     : Yup.string().required(),
    // bo_no: Yup.number().required(),
    // bo_id: Yup.number().required(),
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

    let boId =
      userData?.profile?.users_status === 'investor'
        ? userData?.profile?.user_detail?.bo_id
        : buySell.buySellApi.bo_id

    if (buySell.isBuy) {
      const reqBody = {
        ...buySell.buySellApi,
        action: 'ORDER',
        trader_id: userData?.profile?.user_detail?.trader_code,
        bo_id: boId,
        client_code: buySell.clientCode,
        client_order_id: '',
        symbol: buySell.modalData.short_name,
        qty: buySell.buySellApi.qty,
        price: buySell.buySellApi.price,
        side: 'BUY',
        order_type: 'LIMIT',
        isin: buySell.modalData.isin_code,
        asset_class: buySell.modalData.instrument_type,
        security_code: buySell.modalData.ticker,
        board: buySell.modalData.market_type.toUpperCase(),
        session: buySell.modalData.session.toUpperCase(),
        category: buySell.modalData.share_type.toUpperCase(),
      }

      // saveBlotterData(b)
      console.log('==================', reqBody)
      fixSocket.send(JSON.stringify(reqBody))
      // fixSocket.send(JSON.stringify(raqBody))
    } else {
      const reqBody = {
        ...buySell.buySellApi,
        action: 'ORDER',
        trader_id: userData?.profile?.user_detail?.trader_code,
        bo_id: boId,
        client_code: buySell.clientCode,
        client_order_id: '',
        symbol: buySell.modalData.short_name,
        qty: buySell.buySellApi.qty,
        price: buySell.buySellApi.price,
        side: 'SELL',
        order_type: 'LIMIT',
        isin: buySell.modalData.isin_code,
        asset_class: buySell.modalData.instrument_type,
        security_code: buySell.modalData.ticker,
        board: buySell.modalData.market_type.toUpperCase(),
        session: buySell.modalData.session.toUpperCase(),
        category: buySell.modalData.share_type.toUpperCase(),
      }
      // console.log({updatedState})
      fixSocket.send(JSON.stringify(reqBody))
    }
  }

  const onCellDoubleClicked = (params: any) => {
    dispatch(changeBuySellApi(INIT_BUY_SELL_API))
    dispatch(changeActionName('buySell'))
    setIsBuySellModalOpen(true)
    // dispatch(changeIsShow(true))
    dispatch(changeIsShow({tableId: tableName, isShow: true}))
    dispatch(changeModalData(params?.data))
    dispatch(
      changeBuySellApi({
        price: Number(buySell?.isBuy ? params?.data?.ask : params?.data?.bid),
        qty: Number(buySell?.isBuy ? params?.data?.aq : params?.data?.bq),
      })
    )
  }

  const INIT_BUY_SELL_API: TradingInterface = {
    order_type: '',
    qty: 0,
    price: 0,
    bo_id: '',
  }

  const handleModalClose = () => {
    setIsBuySellModalOpen(false)
    dispatch(resetBuySell())
    // dispatch(changeIsShow(false))
    dispatch(changeIsShow({tableId: '', isShow: false}))
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
    // onSelection()
    loadAllBoAccount()
  }, [])

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

  // get current filter options from context
  const {filterMarketData: filterData, setFilterMarketData} = useContext(FilterMarketDataContext)

  const filteredData = useMarketDataFilter(marketDatas, filterData)

  useEffect(() => {
    setFilterMarketData({...filterData, sectorOptions: filteredData})
  }, [])

  // console.log(filteredData);

  // console.log(filterData);
  // console.log(filteredData.map(dt=> dt.short_name));
  // console.log(marketDatas.map(data => data.sector));

  // === Data for the table ===
  let rowData: any = []
  // if (marketDatas.length > 0) {
  //   const WL = marketDatas?.filter(mD => watchList?.data?.some((wD) => mD.id === wD.id));
  //   rowData = !isWatchList ? marketDatas : WL;
  // }

  if (marketDatas.length > 0) {
    // const WL = filteredData?.filter((mD) => watchList?.data?.some((wD) => mD.id === wD.id))
    const WL = watchList?.data?.filter((w) => w.category === watchList.selectedTab)
    rowData = !isWatchList ? filteredData : WL
  } else {
    rowData = filteredData.length ? filteredData : data
  }
  // useEffect(() => {
  //   // setDemoData(marketDatas)
  // }, [])

  const handleViewModal = () => {
    setIsModalOpen(!isModalOpen)
  }
  const handleMarketDeptModal = () => {
    setIsMarketDeptModalOpen(!isMarketDeptModalOpen)
  }
  const handleParticularModal = () => {
    setIsParticularModalOpen(!isParticularModalOpen)
  }
  const handleSalesMainModal = () => {
    setIsSalesMainModalOpen(!isSalesMainModalOpen)
  }
  const handleNewsModal = () => {
    setIsNewsModalOpen(!isNewsModalOpen)
  }
  const handleSalesBusinessModal = () => {
    setIsSalesBusinessModalOpen(!isSalesBusinessModalOpen)
  }
  const handleHistoricalVolProfileModal = () => {
    setIsHistoricalVolProfileModalOpen(!isHistoricalVolProfileModalOpen)
  }

  const handleBlotterViewModal = () => {
    setIsBlotterModalOpen(!isBlotterModalOpen)
  }

  const handleRightClick = (param: any, type: string, category?: string) => {
    setInstrumentName(param?.short_name)

    // setFarmId(param?.firm_id ?? 'NYSE')
    setFarmId('NYSE')

    switch (type) {
      case 'watchList':
        // dispatch(addInWatchList(param))
        dispatch(addInWatchList({data: param, category}))
        break
      case 'removeWatchList':
        dispatch(removeFromWatchList({id: param?.id}))
        break
      case 'buy':
        setIsBuySellModalOpen(true)
        dispatch(changeModalData(param))
        // dispatch(changeIsShow(true))
        dispatch(changeIsShow({tableId: tableName, isShow: true}))
        dispatch(changeIsBuy(true))
        dispatch(
          changeBuySellApi({
            price: Number(param?.bid),
          })
        )
        break
      case 'sell':
        setIsBuySellModalOpen(true)
        dispatch(changeModalData(param))
        // dispatch(changeIsShow(true))
        dispatch(changeIsShow({tableId: tableName, isShow: true}))
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
      case 'companyParticular':
        dispatch(changeModalData(param))
        setIsParticularModalOpen(!isParticularModalOpen)
        break
      case 'timeSalesMain':
        // dispatch(changeModalData(param))
        setIsSalesMainModalOpen(!isSalesMainModalOpen)
        break
      case 'news':
        setIsNewsModalOpen(!isNewsModalOpen)
        break
      case 'historyVolProfile':
        setIsHistoricalVolProfileModalOpen(!isNewsModalOpen)
        break
      case 'timeBusinessMain':
        // dispatch(changeModalData(param))
        setIsSalesBusinessModalOpen(!isSalesMainModalOpen)
        break

      default:
        break
    }
  }

  return (
    <>
      {/* {isBuySellModalOpen ? ( */}
      <CustomModal
        title='Trading'
        handleClose={handleModalClose}
        show={tableName === buySell.isShow.tableId ? buySell.isShow.isShow : false}
        footer={<></>}
        bgColor='bg-light'
        children={
          <>
            <ModalComponents
              handleSubmit={handleSubmit}
              handleClose={handleClose}
              isConfirmationVisible={isConfirmationVisible}
              buySell={buySell}
            />
          </>
        }
      />
      {/* ) : null} */}

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
                  getRowId={flashSettings ? getRowId : undefined}
                  className='header-black'
                >
                  {checkData && (
                    <AgGridColumn
                      headerName='ID'
                      field='id'
                      width={80}
                      cellStyle={() => {
                        return {fontSize: `${fontSize}px`, fontWeight: 'bold'}
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
                  <HiOutlineFolderRemove className='zzfs-16 fw-bold me-3' />
                  Remove From List
                </MenuItem>
              ) : (
                <>
                  <MenuItem
                    onClick={() => handleRightClick(selectedRow, 'watchList', 'Watch List')}
                  >
                    <BiFolderPlus className='fs-16 fw-bold me-3' />
                    Add to watchList
                  </MenuItem>
                  {watchList.categories.map(({id, name}) => (
                    <MenuItem
                      key={id}
                      onClick={() => handleRightClick(selectedRow, 'watchList', name)}
                    >
                      <BiFolderPlus className='fs-16 fw-bold me-3' />
                      {name}
                    </MenuItem>
                  ))}
                </>
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
              <MenuItem onClick={() => handleRightClick(selectedRow, 'historyVolProfile')}>
                Historical Volume Profile
              </MenuItem>
              <MenuItem onClick={() => handleRightClick(selectedRow, 'news')}>News</MenuItem>
              <MenuItem onClick={() => handleRightClick(selectedRow, 'timeSalesMain')}>
                Time & Sales Main
              </MenuItem>
              <MenuItem onClick={() => handleRightClick(selectedRow, 'timeBusinessMain')}>
                Time & Sales Business
              </MenuItem>
              <MenuItem onClick={() => handleRightClick(selectedRow, 'companyParticular')}>
                Company Particulars
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

      {isParticularModalOpen ? (
        <CustomModal
          style='modal-90w'
          handleClose={handleParticularModal}
          show={isParticularModalOpen}
          title='Company Particular'
          bgColor='bg-light'
          size='xl'
          children={
            <>
              <CompanyParticular isHidden={true} />
            </>
          }
        />
      ) : null}

      {isHistoricalVolProfileModalOpen ? (
        <CustomModal
          style='modal-90w'
          handleClose={handleHistoricalVolProfileModal}
          show={isHistoricalVolProfileModalOpen}
          title='Historical Volume Profile'
          bgColor='bg-light'
          size='xl'
          children={
            <>
              <HistoricalVolProfile isHidden={true} />
            </>
          }
        />
      ) : null}

      {isSalesMainModalOpen ? (
        <CustomModal
          style='modal-90w'
          handleClose={handleSalesMainModal}
          show={isSalesMainModalOpen}
          title='Time & Sales Main'
          bgColor='bg-light'
          size='xl'
          children={
            <>
              <SalesMain isHidden={true} />
            </>
          }
        />
      ) : null}

      {isSalesBusinessModalOpen ? (
        <CustomModal
          style='modal-90w'
          handleClose={handleSalesBusinessModal}
          show={isSalesBusinessModalOpen}
          title='Time & Sales Business'
          bgColor='bg-light'
          size='xl'
          children={
            <>
              <SalesBusiness isHidden={true} />
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

      {isNewsModalOpen ? (
        <NewsModal
          show={isNewsModalOpen}
          handleClose={handleNewsModal}
          instrumentName={instrumentName}
          farmId={farmId}
        />
      ) : null}
    </>
  )
}
export default MarketData
