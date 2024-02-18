import {RootState} from '#store/index'
import { changePosition } from '#store/slices/headerData'
import {useMenuState} from '@szhsin/react-menu'
import {ColDef, DragStartedEvent, DragStoppedEvent, GridReadyEvent} from 'ag-grid-community'
import {AgGridColumn, AgGridReact} from 'ag-grid-react'
import _ from 'lodash'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
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
function ProgressCellRenderer(data) {
  const progress = 10
  return (
    <div>
      <div
        style={{
          position: "absolute",
          width: progress+ "%",
          height: "100%",
          backgroundColor: `rgba(130,210,73,${progress})`
        }}
      />
      <div style={{ position: "absolute" }}>{(progress * 100).toFixed(2)}%</div>
    </div>
  );
}
const PositionBody = ({checkData, layout, getCsvData, setSelectedInstrument}) => {
  // States
  const [modalData, setModalData] = useState<any>([
    {scrip: 'ACMELAB', lpt:  '12', 'high': 15, low: 123, close: 132},
    {scrip: 'ALIF', lpt:  '12121', 'high': 145, low: 123, close: 132},
    {scrip: 'FEKDIL', lpt:  '12121', 'high': 145, low: 123, close: 132},
  ])
  const [tradingListTableContainer, setTradingListTableContainer] = useState({
    width: 0,
    height: 0,
  })

  const [menuProps, toggleMenu] = useMenuState()
  const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0})
  const [selectedRow, setSelectedRow] = useState({})
  const [refetchData, setRefetchData] = useState<boolean>(false)
  const [data, setData] = useState<any>([
    {scrip: 'RUNNERAUTO.XDSE', lpt: '1085', high: '35054', low: 48.4},
    {scrip: 'RUNNERAUTO', lpt: '50110BDT', high: '', low: 48.4},
    {scrip: 'TEST.XDSE', lpt: '1085', high: '135054', low: 48.4},
    {scrip: 'TEST', lpt: '50110BDT', high: '', low: '48.4'},
  ])

  // Refs
  const gridRef: any = useRef()
  const getRowHeight = (params) => (params.node.group ? 30 : 20)
  const dispatch = useDispatch()

  const { linkedTable, headerData } = useSelector((state: RootState) => state)
  const tradingTableEl = useCallback((node) => {
    if (node !== null) {
      setTradingListTableContainer({
        height: node.getBoundingClientRect().height,
        width: node.getBoundingClientRect().width,
      })
    }
  }, [])

  useEffect(() => {
    handleRowData()
  }, [linkedTable?.orderSummary, linkedTable?.instrumentName])
  

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
      autoHeight: true,
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
  const makeOption = (label: string, value:string) => {return {label, value}}

  const handleFilter = (name: string) => {
    if(name === undefined){
      dispatch(changePosition(null))
      setSelectedInstrument('')
      return
    }
    setSelectedInstrument('(' + name + ')')
    const newData =  _.filter(modalData, (item => {
      return (item?.scrip === name)
    }) )
    getCsvData(newData)
    setData(newData)
    dispatch(changePosition(makeOption(name, name)))
    // return newData
  }
  
  const handleRowData = () => {
    // setData(view === 'all' ? blotterDatas : modalData)
    const type = linkedTable?.instrumentName.split('-')[0]
    const name = linkedTable?.instrumentName.split('-')[1]
    // ======= Checking Match by color
    const marketMatched = (linkedTable?.marketData === linkedTable?.position && linkedTable?.position !== '')
    const blotterMatched = (linkedTable?.blotter === linkedTable?.position && linkedTable?.position !== '')
    const deptMatched = (linkedTable?.marketDept === linkedTable?.position && linkedTable?.position !== '')
    const movGenMatched = (linkedTable?.moversGainers === linkedTable?.position && linkedTable?.position !== '')
    const orderSumMatched = (linkedTable?.orderSummary === linkedTable?.position && linkedTable?.position !== '')
    // const executionMatched = (linkedTable?.execution === linkedTable?.blotter)
    // ======= Checking Match by instrument-from
    if(marketMatched && type === 'mk') {handleFilter(name)}
    else if(blotterMatched && type === 'bt') handleFilter(name)
    else if(movGenMatched && type === 'mg') handleFilter(name)
    else if(deptMatched && type === 'md') handleFilter(name)
    else if (orderSumMatched && type === 'os') return handleFilter(name)
    // else if(executionMatched && type === 'exe') return
    else if (headerData?.position && type === 'ps') return handleFilter(name)
    // else if (!headerData?.position && name === undefined) setData(modalData ? modalData : []); getCsvData(modalData ? modalData : [])
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
        
        <div className="ag-theme-alpine" style={{height: 500}}>
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
            // suppressAggFuncInHeader={true}
            animateRows={true}
            getRowHeight={getRowHeight}
            getRowStyle={getRowStyle}
          >
                  {checkData && <AgGridColumn headerName='Closeable' field='low' cellRenderer={(params) => ProgressCellRenderer(params.value)}/>}

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
                    // rowSpan={data?.rowSpan} 
                    cellStyle={data?.cellStyle}
                    valueParser={data?.valueParser}
                    cellRenderer={data?.cellRenderer}
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
      {/* </div> */}
    </div>
  )
}

export default PositionBody
