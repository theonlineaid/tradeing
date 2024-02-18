import {RootState} from '#store/index'
import {useMenuState} from '@szhsin/react-menu'
import {ColDef, DragStartedEvent, DragStoppedEvent, GridReadyEvent} from 'ag-grid-community'
import {AgGridColumn, AgGridReact} from 'ag-grid-react'
import {useCallback, useMemo, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import SingleNews from './SingleNews'

interface Props {
  checkData: any
  layout: any
  getCsvData: any
  setSelectedInstrument: any
  selectedInstrument?: any
  show?: boolean
  modalHandler?: any
  newsData?: []
  fontSize?: any
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

const NewsBody: React.FC<Props> = ({
  checkData,
  layout,
  getCsvData,
  setSelectedInstrument,
  selectedInstrument,
  show,
  newsData,
  modalHandler,
  fontSize,
}) => {
  // States
  const [tradingListTableContainer, setTradingListTableContainer] = useState({
    width: 0,
    height: 0,
  })

  const [menuProps, toggleMenu] = useMenuState()
  const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0})
  const [selectedRow, setSelectedRow] = useState({})
  const [refetchData, setRefetchData] = useState<boolean>(false)
  // const [data, setData] = useState<any>([
  //   {date: '13.53.57', title: 'lorem fdfg'},
  //   {date: '14.23.51', title: 'lorem zz'},
  //   {date: '12.53.57', title: 'lorem xcxc'},
  // ])

  // Refs
  const gridRef: any = useRef()
  const getRowHeight = (params) => (params.node.group ? 30 : 20)
  const dispatch = useDispatch()

  const {linkedTable, headerData} = useSelector((state: RootState) => state)
  const tradingTableEl = useCallback((node) => {
    if (node !== null) {
      setTradingListTableContainer({
        height: node.getBoundingClientRect().height,
        width: node.getBoundingClientRect().width,
      })
    }
  }, [])

  // useEffect(() => {
  //   handleRowData()
  // }, [linkedTable?.orderSummary, linkedTable?.instrumentName])

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
  // const makeOption = (label: string, value:string) => {return {label, value}}

  // const handleFilter = (name: string) => {
  //   if(name === undefined){
  //     dispatch(changePosition(null))
  //     setSelectedInstrument('')
  //     return
  //   }
  //   setSelectedInstrument('(' + name + ')')
  //   const newData =  _.filter(modalData, (item => {
  //     return (item?.scrip === name)
  //   }) )
  //   getCsvData(newData)
  //   setData(newData)
  //   dispatch(changePosition(makeOption(name, name)))

  // }

  // const handleRowData = () => {

  //   const type = linkedTable?.instrumentName.split('-')[0]
  //   const name = linkedTable?.instrumentName.split('-')[1]

  //   const marketMatched = (linkedTable?.marketData === linkedTable?.position && linkedTable?.position !== '')
  //   const blotterMatched = (linkedTable?.blotter === linkedTable?.position && linkedTable?.position !== '')
  //   const deptMatched = (linkedTable?.marketDept === linkedTable?.position && linkedTable?.position !== '')
  //   const movGenMatched = (linkedTable?.moversGainers === linkedTable?.position && linkedTable?.position !== '')
  //   const orderSumMatched = (linkedTable?.orderSummary === linkedTable?.position && linkedTable?.position !== '')

  //   if(marketMatched && type === 'mk') {handleFilter(name)}
  //   else if(blotterMatched && type === 'bt') handleFilter(name)
  //   else if(movGenMatched && type === 'mg') handleFilter(name)
  //   else if(deptMatched && type === 'md') handleFilter(name)
  //   else if (orderSumMatched && type === 'os') return handleFilter(name)
  //   else if (headerData?.position && type === 'ps') return handleFilter(name)
  //   else if (!headerData?.position && name === undefined) setData(modalData ? modalData : []); getCsvData(modalData ? modalData : [])
  // }

  // let rowData: any = []
  let rowData: any = newsData

  // filter from market data right click
  // if(fromRedux) {
  //   rowData = data.filter(item => {return item === fromRedux})
  // } else rowData = data

  /**
   *TODO: Click Handler for Single News Item.
   *
   * This function is triggered when a user clicks on a single news item. It performs two actions:
   * 1. Calls the modalHandler function to open the News details Modal.
   * 2. Sets the data of the clicked news item in the state using the setSelectedInstrument function.
   *
   * @param {object} params - The parameters containing data of the clicked news item.
   */
  const clickSingleNewsHandler = (params) => {
    // Open the News details Modal
    modalHandler()

    // Set the data of the clicked news item in the state
    setSelectedInstrument(params.data)
  }

  return (
    <div className='tw-relative'>
      {show ? (
        <SingleNews
          selectedInstrument={selectedInstrument}
          modalHandler={modalHandler}
          show={show}
        />
      ) : null}

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
              rowData={rowData ? rowData : []}
              pagination={false}
              cacheQuickFilter={true}
              // suppressAggFuncInHeader={true}
              animateRows={true}
              getRowHeight={getRowHeight}
              getRowStyle={getRowStyle}
              onRowClicked={(props) => clickSingleNewsHandler(props)}
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
    </div>
  )
}

export default NewsBody
