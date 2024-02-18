import {BlotterDataType} from '#common/types/blotter-data'
import {MarketDataType} from '#common/types/market-data'
import {BlotterDataContext} from '#context/blotterDataContext'
import {MarketDataContext} from '#context/marketDataContext'
import {RootState} from '#store/index'
import {changeExecution} from '#store/slices/headerData'
import {useMenuState} from '@szhsin/react-menu'
import {ColDef, DragStartedEvent, DragStoppedEvent, GridReadyEvent} from 'ag-grid-community'
import {AgGridColumn, AgGridReact} from 'ag-grid-react'
import _ from 'lodash'
import {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
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

const ExecutionBody = ({checkData, layout, getCsvData, setSelectedInstrument, fontSize}) => {
  // States
  const [modalData, setModalData] = useState<any>(null)
  const [tradingListTableContainer, setTradingListTableContainer] = useState({
    width: 0,
    height: 0,
  })

  const [menuProps, toggleMenu] = useMenuState()
  const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0})
  const [selectedRow, setSelectedRow] = useState({})
  const [refetchData, setRefetchData] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)

  const {blotterDatas} = useContext(BlotterDataContext) as BlotterDataType
  const {marketDatas} = useContext(MarketDataContext) as MarketDataType

  const dispatch = useDispatch()
  const {linkedTable, headerData} = useSelector((state: RootState) => state)

  useEffect(() => {
    handleRowData()
  }, [linkedTable?.instrumentName, linkedTable?.execution, blotterDatas])

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
    apiRef.current.grid = params.api
    apiRef.current.column = params.columnApi
  }

  const {onDragStarted, onDragStopped} = useDragColumnChange((e) =>
    console.log('Saving new column order!')
  )

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

  const onCellClicked = (params: any) => {
    // dispatch(changeExecution(null))
    // dispatch(changeInstrumentName('exe-' + params?.data?.name))
  }
  const makeOption = (label: string, value: string) => {
    return {label, value}
  }

  const handleFilter = (name: string) => {
    if (name === undefined) {
      dispatch(changeExecution(null))
      setSelectedInstrument('')
      console.log(name)
      return
    }
    setSelectedInstrument('(' + name + ')')

    let newData: any = []
    blotterDatas?.filter((item) =>
      item?.orderStatus === 'Filled'
        ? newData.push({
            client_ac: item.client_ac,
            name: item?.name,
            side: item?.side,
            limit: item?.limit,
            orderStatus: item?.orderStatus,
            date: item?.date,
            execQty: item?.execQty,
          })
        : null
    )

    const finalData = _.filter(newData, (item) => {
      return item?.name === name
    })
    getCsvData(finalData)
    setData(finalData)
    dispatch(changeExecution(makeOption(name, name)))
    // return newData
  }

  const handleDefault = (name: string) => {
    if (headerData?.execution) return
    setSelectedInstrument('')
    let newData: any = []
    blotterDatas?.filter((item) =>
      item?.orderStatus === 'Filled'
        ? newData.push({
            client_ac: item.client_ac,
            name: item?.name,
            side: item?.side,
            limit: item?.limit,
            orderStatus: item?.orderStatus,
            date: item?.date,
            execQty: item?.execQty,
          })
        : null
    )
    getCsvData(newData)
    setData(newData)
    // setData(view === 'all' ? blotterDatas : modalData); getCsvData(view === 'all' ? blotterDatas : modalData)
    // setData(view === 'all' ? blotterDatas : modalData);})
    dispatch(changeExecution(null))
  }

  const handleRowData = () => {
    // setData(view === 'all' ? blotterDatas : modalData)
    const type = linkedTable?.instrumentName.split('-')[0]
    const name = linkedTable?.instrumentName.split('-')[1]
    // ======= Checking Match by color
    const marketMatched =
      linkedTable?.marketData === linkedTable?.execution && linkedTable?.execution !== ''
    const deptMatched =
      linkedTable?.marketDept === linkedTable?.execution && linkedTable?.execution !== ''
    const movGenMatched =
      linkedTable?.moversGainers === linkedTable?.execution && linkedTable?.execution !== ''
    const blotterMatched =
      linkedTable?.blotter === linkedTable?.execution && linkedTable?.execution !== ''
    const orderSumMatched =
      linkedTable?.orderSummary === linkedTable?.execution && linkedTable?.execution !== ''

    // ======= Checking Match by instrument-from
    if (marketMatched && type === 'mk') {
      handleFilter(name)
    } else if (movGenMatched && type === 'mg') handleFilter(name)
    else if (deptMatched && type === 'md') handleFilter(name)
    else if (blotterMatched && type === 'bt') handleFilter(name)
    else if (orderSumMatched && type === 'os') return handleFilter(name)
    else if (headerData?.execution && type === 'exe') return handleFilter(name)
    else handleDefault(name)
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
        <div className='ag-theme-alpine' style={{height: 500}}>
          <AgGridReact
            ref={gridRef}
            defaultColDef={defaultColDef}
            suppressRowClickSelection
            onDragStarted={onDragStarted}
            onDragStopped={onDragStopped}
            onGridReady={onGridReady}
            rowData={data ? data : []}
            pagination={false}
            cacheQuickFilter={true}
            onCellClicked={onCellClicked}
            // suppressAggFuncInHeader={true}
            animateRows={true}
            getRowHeight={getRowHeight}
            getRowStyle={getRowStyle}
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

export default ExecutionBody
