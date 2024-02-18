import {useMenuState} from '@szhsin/react-menu'
import {ColDef, DragStartedEvent, DragStoppedEvent, GridReadyEvent} from 'ag-grid-community'
import {AgGridColumn, AgGridReact} from 'ag-grid-react'
import {useCallback, useMemo, useRef, useState} from 'react'

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

const PurchasePowerBody = ({checkData, layout, fontSize}) => {
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
            rowData={[]}
            pagination={false}
            cacheQuickFilter={true}
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

export default PurchasePowerBody
