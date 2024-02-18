
import { MarketDataType } from '#common/types/market-data'
import { MarketDataContext } from '#context/marketDataContext'
import {ColDef, DragStartedEvent, DragStoppedEvent, GridReadyEvent} from 'ag-grid-community'
import { useContext, useMemo } from 'react'

import {AgGridColumn, AgGridReact} from 'ag-grid-react'
/**
 * Trading List
 * @returns
 */
interface Props {
  isWatchList?: boolean
  checkData: ColDef<any>[]
  searchFilter?: any
  gridRef?: any
}

// * main function
const MarketData: React.FC<Props> = ({checkData, isWatchList, searchFilter, gridRef}) => {
  const {marketDatas, saveData} = useContext(MarketDataContext) as MarketDataType;

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      // flex: 1,
      sortable: true,
      resizable: true,
      enableCellChangeFlash: true,
      cellClass: 'align-right',
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    }
  }, [])


  return (
    <>
    <table className="tw-text-left tw-w-full">
		<thead className="tw-bg-black tw-flex tw-text-white tw-w-full">
			<tr className="tw-flex tw-w-full tw-mb-4">
				<th className="tw-p-4 tw-w-1/4">One</th>
			</tr>
		</thead>

		<tbody className="tw-bg-grey-light tw-flex tw-flex-col tw-items-center tw-justify-between tw-overflow-y-scroll tw-w-full" style={{height: "50vh"}}>
			{marketDatas?.map(item => (
        <tr className="tw-flex tw-w-full tw-mb-4">
				<td className="tw-p-4 tw-w-1/4">{item?.short_name}</td>
			</tr>
      ))}
  </tbody>
  </table>
    {/* <AgGridReact
      ref={gridRef}
      defaultColDef={defaultColDef}
      // suppressRowClickSelection
      rowSelection={'single'}
      // rowData={api.queries['getITCHData("redux")']?.data as MarketDataStruct[] ?? []}
      // rowData={rowData.length > 1 ? rowData : demoData}
      rowData={marketDatas}
      pagination={false}
      cacheQuickFilter={true}
      animateRows={true}
      className='header-black'
    >

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
                        />
                      )
                    })}
    </AgGridReact> */}
    </>
  )
}
export default MarketData
