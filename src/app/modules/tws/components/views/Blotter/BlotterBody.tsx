import {BlotterDataType} from '#common/types/blotter-data'
import {RootState} from '#store/index'
import {ControlledMenu, MenuItem, useMenuState} from '@szhsin/react-menu'
import {ColDef, DragStartedEvent, DragStoppedEvent, GridReadyEvent} from 'ag-grid-community'
import {AgGridColumn, AgGridReact} from 'ag-grid-react'
// import "ag-grid-enterprise";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-balham.css";
import CustomModal from '#common/components/CustomModal'
import {MarketDataType} from '#common/types/market-data'
import {
  changeActionName,
  changeBuySellApi,
  changeClientCode,
  changeIsBuy,
  changeIsConfirmShow,
  changeIsUpdateShow,
  changeModalData,
  resetBuySell,
} from '#store/slices/buysell'
import {changeBlotter} from '#store/slices/headerData'
import {changeInstrumentName} from '#store/slices/linkedTable'
import ModalComponents from '#tws/components/buy-sell-modal/ModalComponents'
import cogoToast from 'cogo-toast'
import _ from 'lodash'
import {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import {Button} from 'react-bootstrap'
import {FiAlertTriangle, FiArrowDown, FiArrowUp, FiEdit, FiX} from 'react-icons/fi'
import {useDispatch, useSelector} from 'react-redux'
import {v1 as uuidv1} from 'uuid'
import * as Yup from 'yup'
import TradingInterface from '../../../../../common/types/trading-list'
import {BlotterDataContext} from '../../../../../context/blotterDataContext'
import {FixSocketContext} from '../../../../../context/fixSocketContext'
import {MarketDataContext} from '../../../../../context/marketDataContext'

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

const BlotterBody = ({
  checkData,
  layout,
  getCsvData,
  gridRef,
  modalData = [],
  view = 'all',
  setSelectedInstrument,
  fontSize = 0,
}) => {
  // States
  const [tradingListTableContainer, setTradingListTableContainer] = useState({
    width: 0,
    height: 0,
  })

  const [uuid, setUUID] = useState(null)
  const [menuProps, toggleMenu] = useMenuState()
  const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0})
  const [data, setData] = useState<any>(null)
  const [selectedRow, setSelectedRow] = useState<any>({})
  const [refetchData, setRefetchData] = useState<boolean>(false)
  const [errors, setErrors] = useState([])
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false)

  const INIT_BUY_SELL_API: TradingInterface = {
    order_type:'',
    qty: 0,
    price: 0, 
    bo_id:''
  }

  // Refs
  // const gridRef: any = useRef()
  const getRowHeight = (params) => (params.node.group ? 30 : 20)

  const dispatch = useDispatch()

  const {buySell, userData, linkedTable, headerData, blotter} = useSelector(
    (state: RootState) => state
  )

  const {blotterDatas} = useContext(BlotterDataContext) as BlotterDataType
  const {marketDatas} = useContext(MarketDataContext) as MarketDataType
  const {fixSocket} = useContext(FixSocketContext)


  const tradingTableEl = useCallback((node) => {
    if (node !== null) {
      setTradingListTableContainer({
        height: node.getBoundingClientRect().height,
        width: node.getBoundingClientRect().width,
      })
    }
  }, [])

  // Actions

  // const isExternalFilterPresent = useCallback(() => {
  //   return blotter?.type !== "All";
  // },[])
  // const a = blotter?.type
  // const doesExternalFilterPass = useCallback((node: any) =>  {
  //   console.log(blotter?.type)
  //     if (node.data) {
  //       switch (a) {
  //         case 'Buy':
  //           return node.data.side === 'Buy';
  //         case 'Sell':
  //           return node.data.side === 'Sell';
  //         default:
  //           return true;
  //       }
  //   }
  //   return true;
  // }, [a]);

  const apiRef = useRef<any>({
    grid: undefined,
    column: undefined,
  })

  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit()
    apiRef.current.grid = params.api
    apiRef.current.column = params.columnApi
  }

  const {onDragStarted, onDragStopped} = useDragColumnChange((e) =>
    console.log('Saving new column order!')
  )

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      // flex: 1,
      filter: true,
      sortable: true,
      resizable: true,
      enableCellChangeFlash: true,
      cellClass: 'align-right',
      valueFormatter: (params) => {
        if (typeof params.value === 'string') return params.value
        return formatNumber(params.value)
      },
    }
  }, [])

  function formatNumber(number: number) {
    // this puts commas into the number eg 1000 goes to 1,000,
    // i pulled this from stack overflow, i have no idea how it works
    return Math.floor(number)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
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

  const setupUUID = () => {
    setUUID(uuidv1())
    localStorage.setItem('socketID', JSON.stringify({useId: userData?.profile?.id, uuid}))
  }

  useEffect(() => {
    handleRowData()
  }, [linkedTable?.instrumentName, linkedTable?.blotter, blotterDatas, blotter])
  // console.log(data)
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

  const onCellClicked = (params: any) => {
    dispatch(changeBlotter(null))
    dispatch(changeInstrumentName('bt-' + params?.data?.name))
    // dispatch(changeBlotter(makeOption(params?.data?.name, params?.data?.name)))
    if (params?.data?.orderStatus === 'Rejected' || params?.data?.orderStatus === 'Filled') return
    dispatch(changeActionName('confirmation'))
    if (buySell?.isLock) return
    let newData: any = []
    setSelectedRow(params.data)
    newData = marketDatas.filter((item) => item?.short_name === params?.data?.name)
    dispatch(changeClientCode(params?.data?.client_code))
    dispatch(changeIsBuy(params?.data?.side === 'Buy' ? true : false))
    dispatch(changeModalData(newData[0]))
    dispatch(
      changeBuySellApi({
        price: Number(params?.data?.limit),
        qty: Number(params?.data?.sentQty),
      })
    )
  }

  const onCellUpdateClicked = (params: any) => {
    dispatch(changeActionName('confirmation'))
    dispatch(changeClientCode(params?.client_ac))
    dispatch(changeIsBuy(params?.side === 'Buy' ? true : false))
    const newData = marketDatas.filter((item) => item?.short_name === params?.name)
    dispatch(changeModalData(newData[0]))
    dispatch(
      changeBuySellApi({
        price: Number(params?.limit),
        qty: Number(params?.sentQty),
      })
    )
    dispatch(changeIsUpdateShow(true))
  }

  const hadleOrderCancel = () => {
    console.log(buySell?.modalData)
  }

  const handleBuySell = (side: any, data: any) => {
    if (side === 'BUY') {
      const reqBody = {
        ...buySell.buySellApi,
        user: String(userData.profile?.id),
        scrip: buySell.modalData.short_name,
        qty: buySell.modalData.bq,
        price: buySell.modalData.bid,
        group_name: uuid,
        side: side,
        symbol: buySell.modalData.short_name,
        view_action: 'MAKE_TRADE',
        price_type: 'price_limit',
        client_code: data.client_ac,
      }
      fixSocket.send(JSON.stringify(reqBody))
    } else {
      const reqBody = {
        ...buySell.buySellApi,
        user: String(userData.profile?.id),
        scrip: buySell.modalData.short_name,
        qty: buySell.modalData.aq,
        price: buySell.modalData.ask,
        group_name: uuid,
        side: side,
        symbol: buySell.modalData.short_name,
        view_action: 'MAKE_TRADE',
        price_type: 'price_limit',
        client_code: data.client_ac,
      }
      fixSocket.send(JSON.stringify(reqBody))
    }
  }

  const handleModalClose = () => {
    dispatch(resetBuySell())
    dispatch(changeIsUpdateShow(false))
    dispatch(changeBuySellApi(INIT_BUY_SELL_API))
    dispatch(changeClientCode(''))
  }

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
    event.preventDefault()
    console.log(selectedRow)
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
        view_action: 'REPLACE_ORDER',
        price_type: 'price_limit',
        client_code: buySell.clientCode,
        orig_client_order_id: selectedRow?.clientOrderId,
        order_id: selectedRow?.orderId,
      }
      fixSocket.send(JSON.stringify(raqBody))
    } else {
      const updatedState = {
        ...buySell.buySellApi,
        user: String(userData.profile?.id),
        scrip: buySell.modalData.short_name,
        price: buySell.buySellApi.price,
        qty: buySell.buySellApi.qty,
        group_name: '12345',
        side: 'SELL',
        symbol: buySell.modalData.short_name,
        view_action: 'REPLACE_ORDER',
        price_type: 'price_limit',
        client_code: buySell.clientCode,
        orig_client_order_id: selectedRow?.clientOrderId,
        order_id: selectedRow?.orderId,
      }
      fixSocket.send(JSON.stringify(updatedState))
    }
  }

  const handleClose = () => {
    setIsConfirmationVisible(!isConfirmationVisible)
  }

  const makeOption = (label: string, value: string) => {
    return {label, value}
  }

  const handleFilter = (name: string) => {
    if (name === undefined) {
      dispatch(changeBlotter(null))
      setSelectedInstrument('')
      return
    }
    setSelectedInstrument('(' + name + ')')
    const newData = _.filter(blotterDatas, (item) => {
      return item?.name === name
    })

    getCsvData(newData)
    setData(newData)
    dispatch(changeBlotter(makeOption(name, name)))
    // return newData
  }

  const handleDefault = (type: string) => {
    // if(linkedTable?.execution && (!headerData?.execution || type === 'exe')) return
    // if(!linkedTable?.execution && (!headerData?.execution || type === 'exe')) return
    setSelectedInstrument('')
    setData(view === 'all' ? blotterDatas : modalData)
    getCsvData(view === 'all' ? blotterDatas : modalData)
    dispatch(changeBlotter(null))
  }

  const handleRowData = () => {
    // setData(view === 'all' ? blotterDatas : modalData)
    const type = linkedTable?.instrumentName.split('-')[0]
    const name = linkedTable?.instrumentName.split('-')[1]
    // ======= Checking Match by color
    const marketMatched =
      linkedTable?.marketData === linkedTable?.blotter && linkedTable?.blotter !== ''
    const deptMatched =
      linkedTable?.marketDept === linkedTable?.blotter && linkedTable?.blotter !== ''
    const movGenMatched =
      linkedTable?.moversGainers === linkedTable?.blotter && linkedTable?.blotter !== ''
    const positionMatched =
      linkedTable?.position === linkedTable?.blotter && linkedTable?.blotter !== ''
    const orderSumMatched =
      linkedTable?.orderSummary === linkedTable?.blotter && linkedTable?.blotter !== ''
    // const executionMatched = (linkedTable?.execution === linkedTable?.blotter)
    // ======= Checking Match by instrument-from
    if (marketMatched && type === 'mk') {
      handleFilter(name)
    } else if (movGenMatched && type === 'mg') handleFilter(name)
    else if (deptMatched && type === 'md') handleFilter(name)
    else if (orderSumMatched && type === 'os') return handleFilter(name)
    else if (positionMatched && type === 'ps') return handleFilter(name)
    else if (headerData?.blotter && type === 'bt') return handleFilter(name)
    else if (!headerData?.blotter) setData(view === 'all' ? blotterDatas : modalData)
    getCsvData(view === 'all' ? blotterDatas : modalData)

    // if(blotter?.type !== 'All'){
    //   const newData =  _.filter(blotterDatas, (item => {
    //     return (item?.side === blotter?.type)
    //   }) )
    //   setData(newData)
    // }
    // if(blotter?.status !== 'All'){
    //   const newData =  _.filter(blotterDatas, (item => {
    //     return (item?.status === blotter?.status)
    //   }) )
    //   setData(newData)
    // }
  }

  const onCellEditingStopped = (_params) => {
    const columns = _params?.columnApi?.columnModel
    let visibleColumn: any = []
    if (columns?.columnDefs?.length() !== columns?.displayedColumns) {
      console.log(columns?.displayedColumns)
      columns?.displayedColumns?.map((item) => {
        visibleColumn.push(item?.colId)
      })
    }
    if (_params.newValue != _params.oldValue) {
      console.log(_params)
      //  Do something...
    }
  }

  return (
    <div className='trading-table w-100 h-100' ref={tradingTableEl}>
      {/* <div style={{height: `${tradingListTableContainer.height - 50}px`}}> */}
      <div
        style={{height: '100%', width: '100%'}}
        className='ag-theme-balham'
        onContextMenu={(e) => {
          e.preventDefault()
          setAnchorPoint({x: e.clientX, y: e.clientY})
        }}
      >
        <div className='ag-theme-balham' style={{height: 500}}>
          <AgGridReact
            ref={gridRef}
            defaultColDef={defaultColDef}
            suppressRowClickSelection
            onDragStarted={onDragStarted}
            onDragStopped={onDragStopped}
            onGridReady={onGridReady}
            rowData={view === 'working' ? modalData : data ? data : blotterDatas}
            pagination={false}
            cacheQuickFilter={true}
            alwaysShowHorizontalScroll={true}
            onCellClicked={onCellClicked}
            // suppressAggFuncInHeader={true}
            animateRows={true}
            getRowHeight={getRowHeight}
            getRowStyle={getRowStyle}
            // isExternalFilterPresent={isExternalFilterPresent}
            // doesExternalFilterPass= {doesExternalFilterPass}
            // onColumnEverythingChanged={onCellEditingStopped}
          >
            {checkData &&
              checkData.map((data) => {
                if (data.hide) return null
                return (
                  <AgGridColumn
                  key={data.field}
                  filter='agSetColumnFilter'
                  headerName={!data.hide ? data.headerName : ''}
                  field={!data.hide ? data.field : ''}
                  headerTooltip={data.headerName}
                  width={data.width}
                  valueParser={data?.valueParser}
                  cellRenderer={data?.cellRenderer}
                  valueFormatter={data?.valueFormatter}
                  cellStyle={(params) => {
                    const defaultStyle = {
                      fontSize: `${fontSize}px`,
                      fontWeight: 'bold',
                    };
                    const additionalStyle = data?.cellStyle ? data.cellStyle(params) : {};
                    return { ...defaultStyle, ...additionalStyle };
                  }}
                  onCellContextMenu={(e) => {
                    onCellClicked(e);
                    const newData = marketDatas.filter((item) => item?.short_name === e?.data?.name);
                    dispatch(changeModalData(newData[0]));
                    toggleMenu(true);
                    setSelectedRow(e.data);
                  }}
                />
                )
              })}
          </AgGridReact>
        </div>

        <ControlledMenu
          {...menuProps}
          anchorPoint={anchorPoint}
          direction='right'
          onClose={() => toggleMenu(false)}
          menuStyle={{minWidth: '200px', fontSize: '1.1rem'}}
          className='tw-bg-white dark:tw-bg-dark-500 dark:tw-text-slate-300 controlled-menu'
        >
          <div className='text-center px-3'>
            <h3 className='fs-18 dark:tw-text-slate-50'>{(selectedRow as any)?.name}</h3>
            <small className='dark:tw-text-slate-300'>{(selectedRow as any)?.clientOrderId}</small>
          </div>
          <hr className='dark:tw-border-slate-500' />
          <MenuItem
            onClick={() => onCellUpdateClicked(selectedRow)}
            disabled={
              selectedRow?.orderStatus === 'Filled' || selectedRow?.orderStatus === 'Rejected'
            }
          >
            <FiEdit className='fs-16 fw-bold me-3' />
            Modify
          </MenuItem>
          <MenuItem
            onClick={() => dispatch(changeIsConfirmShow(true))}
            disabled={
              selectedRow?.orderStatus === 'Filled' || selectedRow?.orderStatus === 'Rejected'
            }
          >
            <FiAlertTriangle className='fs-16 fw-bold me-3' />
            Cancel Order
          </MenuItem>
          <MenuItem
            onClick={() => handleBuySell('BUY', selectedRow)}
            disabled={buySell?.modalData?.bid === 0 || !buySell?.modalData?.bid}
          >
            <FiArrowUp className='fs-16 fw-bold me-3' />
            Buy ({buySell?.modalData?.bid})
          </MenuItem>
          <MenuItem
            onClick={() => handleBuySell('SELL', selectedRow)}
            disabled={!buySell?.modalData?.ask || buySell?.modalData?.ask === 0}
          >
            <FiArrowDown className='fs-16 fw-bold me-3' />
            Sell ({buySell?.modalData?.ask})
          </MenuItem>

          <MenuItem className='text-danger' onClick={() => toggleMenu(false)}>
            <FiX className='fs-16 fw-bold me-3' />
            Close
          </MenuItem>
        </ControlledMenu>

        <CustomModal
          title='Trading'
          handleClose={handleModalClose}
          show={buySell.isUpdateShow}
          footer={<></>}
        >
          <ModalComponents
            handleSubmit={handleSubmit}
            handleClose={handleClose}
            isConfirmationVisible={isConfirmationVisible}
            buySell={buySell}
          />
        </CustomModal>

        {buySell?.isConfirmShow ? (
          <CustomModal
            handleClose={() => dispatch(resetBuySell())}
            show={buySell?.isConfirmShow}
            title='Confirmation'
            size='sm'
            footer={<></>}
          >
            <p className='tw-text-lg tw-mb-2'>Are you sure?</p>

            <Button size='sm' onClick={hadleOrderCancel}>
              Yes
            </Button>
            <Button size='sm' onClick={() => dispatch(resetBuySell())}>
              Cancel
            </Button>
          </CustomModal>
        ) : null}
      </div>
      {/* </div> */}
    </div>
  )
}

export default BlotterBody
