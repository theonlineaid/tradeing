import {RootState} from '#store/index'
import {changeOrderSummary} from '#store/slices/headerData'
import {changeInstrumentName} from '#store/slices/linkedTable'
import {useMenuState} from '@szhsin/react-menu'
import {ColDef, DragStartedEvent, DragStoppedEvent, GridReadyEvent} from 'ag-grid-community'
import {AgGridColumn, AgGridReact} from 'ag-grid-react'
import _ from 'lodash'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Col, Row} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'

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

const OrderSummeryBody = ({checkData, layout, setSelectedInstrument, getCsvData, fontSize}) => {
  // States
  const [modalData, setModalData] = useState<any>([
    {
      order: 1,
      tot: 1,
      tot_val: 1,
      trq: 1,
      beq: 1,
      bev: 1,
      bap: 1,
      seq: 1,
      sev: 1,
      svp: 1,
      teq: 1,
      tev: 1,
      neq: 1,
      nev: 1,
    },
    {
      order: 3,
      tot: 1,
      tot_val: 1,
      trq: 1,
      beq: 1,
      bev: 1,
      bap: 1,
      seq: 1,
      sev: 1,
      svp: 1,
      teq: 1,
      tev: 1,
      neq: 1,
      nev: 1,
    },
  ])
  const [tradingListTableContainer, setTradingListTableContainer] = useState({
    width: 0,
    height: 0,
  })

  const [menuProps, toggleMenu] = useMenuState()
  const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0})
  const [selectedRow, setSelectedRow] = useState({})
  const [refetchData, setRefetchData] = useState<boolean>(false)
  const [data, setData] = useState<any>()

  const dispatch = useDispatch()
  const {linkedTable, headerData} = useSelector((state: RootState) => state)

  useEffect(() => {
    handleRowData()
  }, [linkedTable?.orderSummary, linkedTable?.instrumentName])

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

  // Actions

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
      flex: 1,
      sortable: true,
      minWidth: 100,
      maxWidth: 500,
      enableCellChangeFlash: true,
      resizable: true,
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

  const handleColumnsChange = (event: any) => {
    console.log({event})
  }

  const onCellClicked = (params: any) => {
    // dispatch(changeOrderSummary(null))
    dispatch(changeInstrumentName('os-' + params?.data?.scrip))
  }

  const makeOption = (label: string, value: string) => {
    return {label, value}
  }

  const handleFilter = (name: string) => {
    if (name === undefined) {
      dispatch(changeOrderSummary(null))
      setSelectedInstrument('')
      return
    }
    setSelectedInstrument('(' + name + ')')
    const newData = _.filter(modalData, (item) => {
      return item?.name === name
    })
    getCsvData(newData)
    setData(newData)
    dispatch(changeOrderSummary(makeOption(name, name)))
    // return newData
  }

  const handleRowData = () => {
    const type = linkedTable?.instrumentName.split('-')[0]
    const name = linkedTable?.instrumentName.split('-')[1]
    // ======= Checking Match by color
    // const marketMatched = (linkedTable?.marketData === linkedTable?.blotter)
    // const deptMatched = (linkedTable?.marketDept === linkedTable?.blotter)
    // const movGenMatched = (linkedTable?.moversGainers === linkedTable?.blotter)

    // if(marketMatched && type === 'mk') {handleFilter(name)}
    // else if(movGenMatched && type === 'mg') handleFilter(name)
    // else if(deptMatched && type === 'md') handleFilter(name)
    // else if (headerData?.blotter && type === 'bt') return handleFilter(name)
    if (headerData?.orderSummary && type === 'os') handleFilter(name)
    else {
      setData(modalData ? modalData : [])
      getCsvData(modalData ? modalData : [])
    }
  }

  return (
    <div className='trading-table w-100 h-100' ref={tradingTableEl}>
      {/* <div style={{height: `${tradingListTableContainer.height - 50}px`}}> */}

      <Row className='tw-ml-2 tw-mt-2 tw-from-purple-200 dark:tw-bg-dark-400'>
        <Col xs={2} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            Side
          </span>
        </Col>
        <Col xs={3} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            Order
          </span>
        </Col>
        <Col xs={2} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            Quantity
          </span>
        </Col>
        <Col xs={3} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            Exc Value
          </span>
        </Col>
        <Col xs={2} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            Filled
          </span>
        </Col>
      </Row>

      <Row className='tw-ml-2 tw-bg-gray-300 dark:tw-bg-gray-900'>
        <Col xs={2} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            Total
          </span>
        </Col>
        <Col xs={3} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            1
          </span>
        </Col>
        <Col xs={2} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            1
          </span>
        </Col>
        <Col xs={3} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            0.00
          </span>
        </Col>
        <Col xs={2} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            0.00%
          </span>
        </Col>
      </Row>

      <Row className='tw-ml-2 tw-bg-red-300 dark:tw-bg-red-900'>
        <Col xs={2} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            Buy
          </span>
        </Col>
        <Col xs={3} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            1
          </span>
        </Col>
        <Col xs={2} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            1
          </span>
        </Col>
        <Col xs={3} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            0.00
          </span>
        </Col>
        <Col xs={2} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            0.00%
          </span>
        </Col>
      </Row>

      <Row className='tw-ml-2 tw-bg-green-300 dark:tw-bg-green-900'>
        <Col xs={2} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            Sell
          </span>
        </Col>
        <Col xs={3} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            1
          </span>
        </Col>
        <Col xs={2} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            1
          </span>
        </Col>
        <Col xs={3} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            0.00
          </span>
        </Col>
        <Col xs={2} className='tw-pr-12'>
          <span
            style={{fontSize: fontSize}}
            className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'
          >
            0.00%
          </span>
        </Col>
      </Row>
      <br />
      <div
        style={{height: '100%', width: '100%'}}
        className='ag-theme-balham'
        onContextMenu={(e) => {
          e.preventDefault()
          setAnchorPoint({x: e.clientX, y: e.clientY})
        }}
      >
        <div className='ag-theme-alpine' style={{height: 500}}>
          <AgGridReact
            ref={gridRef}
            defaultColDef={defaultColDef}
            suppressRowClickSelection
            // onDragStarted={onDragStarted}
            // onDragStopped={onDragStopped}
            onGridReady={onGridReady}
            rowData={data ? data : []}
            pagination={false}
            cacheQuickFilter={true}
            onCellClicked={onCellClicked}
            // suppressAggFuncInHeader={true}
            animateRows={true}
            getRowHeight={getRowHeight}
            getRowStyle={getRowStyle}
            // onDisplayedColumnsChanged={handleColumnsChange}
          >
            {checkData &&
              checkData.map((data) => {
                if (data.hide) return null
                return (
                  <AgGridColumn
                    key={data.field}
                    filter='agTextColumnFilter'
                    headerName={!data.hide ? data.headerName : ''}
                    field={!data.hide ? data.field : ''}
                    headerTooltip={data.headerName}
                    width={data.width}
                    valueParser={data?.valueParser}
                    cellRenderer={data?.cellRenderer}
                    onCellContextMenu={(e) => {
                      toggleMenu(true)
                      setSelectedRow(e.data)
                    }}
                    cellStyle={() => {
                      return {fontSize: `${fontSize}px`, fontWeight: 'bold'}
                    }}
                  />
                )
              })}
          </AgGridReact>
        </div>
      </div>
      {/* </div> */}
    </div>
  )
}

export default OrderSummeryBody
