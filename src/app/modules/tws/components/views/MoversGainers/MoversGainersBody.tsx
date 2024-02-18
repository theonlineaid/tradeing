import {MarketDataType} from '#common/types/market-data'
import {MarketDataContext} from '#context/marketDataContext'
import {changeInstrumentName} from '#store/slices/linkedTable'
import {useMenuState} from '@szhsin/react-menu'
import {ColDef, DragStartedEvent, DragStoppedEvent, GridReadyEvent} from 'ag-grid-community'
import {AgGridColumn, AgGridReact} from 'ag-grid-react'
import _ from 'lodash'
import {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import {Button, ButtonGroup} from 'react-bootstrap'
import {useDispatch} from 'react-redux'

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

const MoversGainersBody = ({checkData, layout, getCsvData, fontSize}) => {
  const dispatch = useDispatch()

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
  const [rowSize, setRowSize] = useState<any>(10)
  const [name, setName] = useState<any>('gainer')
  const {marketDatas} = useContext(MarketDataContext) as MarketDataType

  // const {csvData, handleCsvData} = useCSVFormatter({initData: []})
  // ======= Fetch market data
  useEffect(() => {
    let gainer: any = []
    _.sortBy(marketDatas, 'd')
      .reverse()
      .map((item) =>
        gainer.push({
          scrip: item.short_name,
          lpt: item?.last,
          high: item?.d,
          low: item?.volume,
          close: item?.last - item?.settle_1,
        })
      )
    // handleCsvData(gainer || [])
    getCsvData(gainer)
    setData(gainer || [])
    // const filteredData = [...
    //   // _.sortBy(marketDatas, "volume").reverse().map(item => ({"active": item.short_name}))
    //   marketDatas.map((item, key) => ({"active": active[key], "gainer": gainer[key], "loser": loser[key]}))
    // ]
    // setData(filteredData)
  }, [])
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
      minWidth: 100,
      maxWidth: 500,
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

  const handleData = (type: string) => {
    setName(type)
    switch (type) {
      case 'gainers':
        let gainer: any = []
        _.sortBy(marketDatas, 'd')
          .reverse()
          .map((item) =>
            gainer.push({
              scrip: item.short_name,
              lpt: item?.last,
              high: item?.d,
              low: item?.volume,
              close: item?.last - item?.settle_1,
            })
          )
        setData(gainer)
        break
      case 'losers':
        let loser: any = []
        _.sortBy(marketDatas, 'd').map((item) =>
          loser.push({
            scrip: item.short_name,
            lpt: item?.last,
            high: item?.d,
            low: item?.volume,
            close: item?.last - item?.settle_1,
          })
        )
        setData(loser)
        break
      case 'actives':
        let active: any = []
        _.sortBy(marketDatas, 'volume')
          .reverse()
          .map((item) =>
            active.push({
              scrip: item.short_name,
              lpt: item?.last,
              high: item?.d,
              low: item?.volume,
              close: item?.last - item?.settle_1,
            })
          )
        setData(active)
        break

      default:
        break
    }
  }

  const onCellClicked = (params: any) => {
    dispatch(changeInstrumentName('mg-' + params?.data?.scrip))
  }

  const handleRowSize = (e: any) => {
    setRowSize(e.target.value)
  }

  return (
    <div className='trading-table w-100 h-100' ref={tradingTableEl}>
      {/* <div style={{height: `${tradingListTableContainer.height - 50}px`}}> */}
      <ButtonGroup aria-label='' size='sm'>
        <Button
          className='dark:tw-bg-dark-200 dark:tw-text-gray-300 dark:tw-border-dark-400 !important'
          variant='secondary'
          onClick={() => handleData('gainers')}
          active={name === 'gainer'}
        >
          Gainers
        </Button>
        <Button
          className='dark:tw-bg-dark-200 dark:tw-text-gray-300 dark:tw-border-dark-400 !important'
          variant='secondary'
          onClick={() => handleData('losers')}
        >
          Losers
        </Button>
        <Button
          className='dark:tw-bg-dark-200 dark:tw-text-gray-300 dark:tw-border-dark-400 !important'
          variant='secondary'
          onClick={() => handleData('actives')}
        >
          Most Active
        </Button>
      </ButtonGroup>

      <div className='tw-float-right mt-1'>
        <input
          className='form-control dark:tw-bg-dark-200 !important tw-w-24 tw-inline-block dark:tw-border-dark-400 tw-h-8 !important  dark:tw-text-gray-300 !important'
          type='number'
          id='filter-text-box'
          placeholder='Rows'
          value={rowSize}
          onChange={(e) => handleRowSize(e)}
        />
        <span className='tw-ml-2 tw-mr-2 dark:tw-text-gray-300 !important'>
          {rowSize}/{data?.length}
        </span>
        {/* {data ? <CSVLink data={data} filename={'MoversGainers'}>Download me</CSVLink> : null} */}
      </div>
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
            onCellClicked={onCellClicked}
            rowData={data ? data : []}
            pagination={true}
            paginationPageSize={rowSize}
            cacheQuickFilter={true}
            // suppressSizeToFit={true}
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
                    valueFormatter={data?.valueFormatter}
                    valueParser={data?.valueParser}
                    cellRenderer={data?.cellRenderer}
                    // cellStyle={data?.cellStyle}
                    cellStyle={() => {
                      return {fontSize: `${fontSize}px`, fontWeight: 'bold'}
                    }}
                    // resizable={true}
                    onCellContextMenu={(e) => {
                      toggleMenu(true)
                      setSelectedRow(e.data)
                    }}
                  />
                )
              })}
          </AgGridReact>
        </div>
      </div>
    </div>
  )
}

export default MoversGainersBody
