import React, { useContext, useEffect, useRef } from 'react'
import _ from 'lodash'
import ListGroup from 'react-bootstrap/ListGroup';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '#store/index';
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import InstrumentSelect from '#tws/components/section-headers/instrumentSelect';


const ProgressCellRenderer = (progress) => {
  // console.log(props)
  // const progress = props.data
  return ( 
    <div>
      <div
        style={{
          position: "absolute",
          width: progress+ "%",
          height: "100%",
          backgroundColor: `rgba(130,210,73,${progress})`,
        }}
      />
      <div style={{ position: "absolute" }}>{(progress).toFixed(2)}%</div>
    </div>
  );

}
type AgGridApi = {
  grid?: GridApi;
  column?: ColumnApi;
};
const SalesBusiness = (props) => {
  const [rowData, setRowData] = React.useState<any>([
    {last: 20, value: 20, trade: 20, vol: 33 },
    {last: 20, value: 20, trade: 20, vol: 50 },
    {last: 20, value: 20, trade: 20, vol: 100},
    {last: 20, value: 20, trade: 20, vol: 93 },
    {last: 20, value: 20, trade: 20, vol: 13 },
  ]);


  const columnDefs: ColDef[] = [
    {
      field: 'last',
      headerName: 'Last',
      hide: false,
      width: 140,
      type: 'numColumn',
    },
    {
      field: 'value',
      headerName: 'Value',
      hide: false,
      width: 140,
      type: 'numColumn',
    },
    {
      field: 'trade',
      headerName: 'Trades',
      hide: false,
      width: 140,
      type: 'numColumn',
    },
    {
      field: 'vol',
      headerName: 'Volume',
      hide: false,
      cellRenderer:{ProgressCellRenderer},
      cellStyle: () => {return { margin: '2px', textAlign: 'center'}}
    },
  ]
  
  const {buySell} = useSelector((state: RootState) => state)
 
  const apiRef = React.useRef<AgGridApi>({
    grid: undefined,
    column: undefined
  });

  const onGridReady = (params: GridReadyEvent) => {
    apiRef.current.grid = params.api;
    apiRef.current.column = params.columnApi;
  };
  
  return (
    <>
    <div
      className='tw-flex tw-items-center tw-justify-between p-0 tw-bg-gradient-to-r tw-from-purple-200 tw-to-white dark:tw-from-transparent dark:tw-to-transparent dark:tw-bg-dark-400 dark:tw-border-dark-400 tw-h-9'
    >
      <h3 className='tw-font-bold tw-text-lg dark:tw-text-gray-300 tw-px-3'>
        Date: 
      </h3>
      <InstrumentSelect />
    </div>
      <div style={{ height: "80vh" }}>
        <div
          style={{ height: "100%", width: "100%" }}
          className="ag-theme-alpine"
        >
          <AgGridReact
            suppressRowClickSelection
            // columnDefs={columnDefs}
            // enableColResizes
            onGridReady={onGridReady}
            rowData={rowData}
          >
          
          {columnDefs?.map((item:any) => {
      
            if(item.field !== 'vol') {
              return (
                <AgGridColumn
                  key={item.field}
                  headerName={item.headerName}
                  field={item.field}
                  // cellRenderer={(params) => ProgressCellRenderer(params.value)}
                />
              )
            }
            else {

              return (
                <AgGridColumn headerName='Volume' field='vol' cellRenderer={(params) => ProgressCellRenderer(params.value)}/>
                )
            }
          }
          )
          }
          </AgGridReact>
        </div>
      </div>
    </>
  )
}

export default React.memo(SalesBusiness)
