import {ColDef, DragStartedEvent, DragStoppedEvent, GridReadyEvent} from 'ag-grid-community'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import {AgGridColumn, AgGridReact} from 'ag-grid-react'
import {timeFormat} from 'd3-time-format'
import {useCallback, useEffect, useRef, useState} from 'react'
import {useDispatch} from 'react-redux'
import _v from '../../../../../../common/constants'
import {updateTradeListColumnShow} from '../../../../../../redux/slices/tradeListColumnShow'
import {allUserBoInfo} from '../../../../../auth/core/_requests'
import useFetchData from './../../../../../../hooks/use-fetch-data-hook'
import ProfitFilter from './ProfitFilter'

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
 * Profit
 * @returns
 */
interface Props {
  layout: any
  handleMinimizeSection: ({height, name}: {height: number; name: string}) => void
  checkData: ColDef<any>[]
}

const ProfitList: React.FC<React.PropsWithChildren<Props>> = ({
  layout,
  handleMinimizeSection,
  checkData,
}) => {
  // Hooks
  const [showSearchData, setShowSearchData] = useState(false)
  const [searchData, setSearchData] = useState<any>([])
  const [client, setClient] = useState<any>(null)
  const [boInfo, setBoInfo] = useState<any>()
  const dispatch = useDispatch()

  // Refs
  const gridRef: any = useRef()
  const apiRef = useRef<any>({
    grid: undefined,
    column: undefined,
  })

  // filter value props
  const format = timeFormat('%Y-%m-%d')
  const [values, setValues] = useState<any>({
    client_code: '',
    scrip: '',
    side: '',
    from: '',
    to: format(new Date()),
  })

  const onGridReady = (params: GridReadyEvent) => {
    apiRef.current.grid = params.api
    apiRef.current.column = params.columnApi
  }
  const {onDragStarted, onDragStopped} = useDragColumnChange(() =>
    console.log('Saving new column order!')
  )

  const fetchData = async () => {
    try {
      let bo = await allUserBoInfo()
      setBoInfo(bo?.data?.data[0])
    } catch (error) {
      console.error(error)
    }
  }

  //Loading on table
  const {
    isLoading,
    isError,
    data: profit,
  } = useFetchData({
    url: `${_v.API_URL_2}/${_v.USER_PROFIT}/${boInfo?.client_code}/`,
  })

  const enableLoading = () => {
    gridRef?.current?.api?.showLoadingOverlay()
  }
  const disableLoading = () => {
    gridRef?.current?.api?.hideOverlay()
  }
  useEffect(() => {
    if (!gridRef?.current) return

    if (isLoading) {
      enableLoading()
    } else {
      disableLoading()
    }
  }, [gridRef?.current, isLoading])

  // Effects
  useEffect(() => {
    dispatch(updateTradeListColumnShow(checkData))
  }, [checkData, dispatch])

  // Const
  const defaultColDef = {
    sortable: true,
  }
  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv()
  }, [])
  const handleChange = (e) => {
    const {name, value} = e.target
    let x = {...values, [name]: value}
    setValues({...values, [name]: value})
    setShowSearchData(true)
    searchFilterData(x)
  }
  const clientId = async () => {
    let bo: any = await allUserBoInfo()
    setClient(bo?.data?.data)
  }

  const searchFilterData = (searchValue) => {
    const _profit = profit as any
    let result: any = []
    if (!_profit?.profit_loss) return null
    result = _profit.profit_loss?.filter((item: any, k: any) => {
      if (!searchValue.client_code && !searchValue.side) return item
      if (item.client_code == searchValue.client_code || item.side == searchValue.side) {
        return item
      }
    })
    setSearchData(result)
  }

  const filterCondition = (item, searchV) => {
    let newSearch: any = {}
    let newItem: any = {}
    for (let i in searchV) {
      if (searchV[i] !== '' && new Date(searchV.to) >= new Date(item.created_at.split('T')[0])) {
        if (i === 'from' && searchV[i]) {
          if (
            new Date(searchV[i]) <= new Date(item.created_at.split('T')[0]) &&
            new Date(searchV.to) >= new Date(item.created_at.split('T')[0])
          ) {
            newSearch[i] = new Date(searchV[i])
            newItem[i] = new Date(searchV[i])
          } else {
            newSearch[i] = String(searchV[i])
            newItem[i] = String(item[i])
          }
        } else {
          if (new Date(searchV.to) >= new Date(item.created_at.split('T')[0])) {
            if (i === 'to') {
              newSearch[i] = new Date(searchV[i])
              newItem[i] = new Date(searchV[i])
            } else {
              newSearch[i] = String(searchV[i])
              newItem[i] = String(item[i])
            }
          }
        }
      }
    }

    if (JSON.stringify(newSearch) == JSON.stringify(newItem) && Object.keys(newItem).length !== 0) {
      return item
    }
  }
  useEffect(() => {
    clientId()
    fetchData()
  }, [])

  return (
    <>
      <div className='d-flex align-items-center justify-content-between px-3 py-2'>
        <ProfitFilter
          client={client}
          currentDate={new Date()}
          handleChange={handleChange}
          values={values}
          profit={profit}
        />
      </div>
      <div style={{height: '60vh'}}>
        <div id='divToPrint' style={{height: '100%', width: '100%'}} className='ag-theme-balham'>
          <AgGridReact
            ref={gridRef}
            defaultColDef={defaultColDef}
            rowSelection='multiple'
            suppressRowClickSelection
            onDragStarted={onDragStarted}
            onDragStopped={onDragStopped}
            onGridReady={onGridReady}
            rowData={showSearchData ? searchData : (profit as any)?.profit_loss ?? []}
            overlayLoadingTemplate={
              '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>'
            }
            pagination={true}
            cacheQuickFilter={true}
          >
            {checkData &&
              checkData.map((data) => {
                if (!data.field) return null
                return (
                  <AgGridColumn
                    key={data.field}
                    filter='agTextColumnFilter'
                    filterParams={columnFilterParams}
                    headerName={data.headerName}
                    field={data.field}
                    headerTooltip={data.headerName}
                    width={data.width}
                    valueFormatter={(params) =>
                      data.field == 'perchantage' ? params.data?.perchantage?.toFixed(2) : null
                    }
                    cellStyle={data?.cellStyle}
                  />
                )
              })}
          </AgGridReact>
        </div>
      </div>
    </>
  )
}

export default ProfitList
