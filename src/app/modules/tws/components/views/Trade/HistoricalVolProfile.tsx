import React, { useContext, useEffect, useRef } from 'react'
import _ from 'lodash'
import ListGroup from 'react-bootstrap/ListGroup';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '#store/index';
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import InstrumentSelect from '#tws/components/section-headers/instrumentSelect';

type AgGridApi = {
  grid?: GridApi;
  column?: ColumnApi;
};
const HistoricalVolProfile = (props) => {
  const [rowData, setRowData] = React.useState<any>([
    {time: 'Week 45', date: '06/11/2023', vol: 33, close: 15.2},
    {time: 'Week 44', date: '06/11/2023', vol: 50, close: 15.2},
    {time: '', date: '06/11/2023', vol: 100,close:  15.2},
    {time: '', date: '06/11/2023', vol: 93, close: 15.2},
    {time: 'Week 42', date: '06/11/2023', vol: 13, close: 15.2},
  ]);


  const columnDefs: ColDef[] = [
    {
      field: 'week',
      headerName: '',
      hide: false,
      width: 140,
      type: 'textColumn',
    },
    {
      field: 'date',
      headerName: 'Date',
      hide: false,
      width: 140,
      type: 'numColumn',
    },
    {
      field: 'vol',
      headerName: 'Volume',
      hide: false,
    },
    {
      field: 'close',
      headerName: 'Close',
      hide: false,
      width: 140,
      type: 'numColumn',
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
      className='tw-flex tw-items-center tw-justify-between p-0 tw-bg-gradient-to-r tw-from-purple-200 tw-to-white dark:tw-from-transparent dark:tw-to-transparent dark:tw-bg-dark-400 dark:tw-border-dark-400 tw-h-9'>
      <h3 className='tw-font-bold tw-text-lg dark:tw-text-gray-300 tw-px-3'>
      
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
              return (
                <AgGridColumn
                  key={item.field}
                  headerName={item.headerName}
                  field={item.field}
                  // cellRenderer={(params) => ProgressCellRenderer(params.value)}
                />
              )
            })
          }
          
          </AgGridReact>
        </div>
      </div>
    </>
  )
}

export default React.memo(HistoricalVolProfile)
