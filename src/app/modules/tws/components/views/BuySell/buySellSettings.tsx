import { RootState } from '#store/index'
import { changeIsMin, changeRowNumber, changeType } from '#store/slices/buysell'
import React, { useState } from 'react'
import { Button, ButtonGroup, Col, Form, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Switch from 'react-switch'




interface Props {
  handleInstrumentHideShow?: any
  checked: boolean
}

const BuySellSetting:React.FC<React.PropsWithChildren<Props>> = ({handleInstrumentHideShow, checked}) => {
  const [rowSize, setRowSize] = useState<any>(10)
  const [name, setName] = useState<any>('marketDept')
  const dispatch = useDispatch()
  const { buySell } = useSelector((state: RootState) => state)
  const handleRowSize = (e: any) => {
    if (buySell.isMin) {
      setRowSize(3);
      dispatch(changeRowNumber(3));
      return
    }
    if (e.target.value > 20 || e.target.value < 1) return
    dispatch(changeRowNumber(e.target.value))
    setRowSize(e.target.value)
  }
  const handleView = (type) => {
    setName(type)
    if (type === "marketDeptMin") {
      dispatch(changeIsMin(!buySell.isMin))
    }
    else {
      dispatch(changeType(type))
    }
  }
  const options = [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
    { label: 6, value: 6 },
    { label: 7, value: 7 },
    { label: 8, value: 8 },
    { label: 9, value: 9 },
    { label: 10, value: 10 },
    { label: 11, value: 11 },
    { label: 12, value: 12 },
    { label: 13, value: 13 },
    { label: 14, value: 14 },
    { label: 15, value: 15 },
  ]
  const getTotalRow = () => {
    if (buySell?.data.buy.length > buySell.data?.sell.length) return buySell.data.buy.length;
    if (buySell?.data.sell.length > buySell.data?.buy.length) return buySell.data.sell.length;
  }

 

  return (
    <>
      <div className="tw-w-auto">
        <ButtonGroup aria-label="" size="sm">
          <Button className='dark:tw-bg-dark-200 dark:tw-text-gray-300 dark:tw-border-dark-400 !important' variant="secondary" onClick={() => handleView('marketDept')} active={name === 'marketDept'}>MarketDept</Button>
          {/* <Button className='dark:tw-bg-dark-200 dark:tw-text-gray-300 dark:tw-border-dark-400 !important' variant="secondary" onClick={() => handleView('marketDeptMin')} active={name === 'marketDeptMin'}>MarketDept Min</Button> */}
          <Button className='dark:tw-bg-dark-200 dark:tw-text-gray-300 dark:tw-border-dark-400 !important' variant="secondary" onClick={() => handleView('mirrorMarketDept')}>Mirror Market Dept</Button>
        </ButtonGroup>

        <div className='tw-float-right mt-1'>
          <input
            max={15}
            min={1}
            className='form-control dark:tw-bg-dark-200 !important tw-w-24 tw-inline-block dark:tw-border-dark-400 tw-h-8 !important'
            type='number'
            id='filter-text-box'
            placeholder='Rows'
            value={rowSize}
            onChange={(e) => handleRowSize(e)}
          />
          {/* <Form.Select size="sm" >
        <option value={10}>Rows</option>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
        <option value={6}>6</option> */}
          {/* {options?.map(item => { 
          return <option value={item.value}>{item.label}</option>
        })} */}
          {/* </Form.Select> */}
          {/* <span className='tw-ml-2 tw-mr-2 dark:tw-text-gray-300 !important' >{rowSize}/{getTotalRow()}</span> */}
          {/* {data ? <CSVLink data={data} filename={'MoversGainers'}>Download me</CSVLink> : null} */}
        </div>

      </div>


      <span className='tw-flex tw-justify-between tw-items-center p-2  mt-3  tw-bg-slate-200  dark:tw-bg-slate-700 tw-rounded-full'>
        <h6 className='m-0 pe-4 ps-2 tw-text-slate-800 dark:tw-text-slate-200 tw-text-[14px] tw-font-bold'>{checked ? 'Hide Instrument Detail' : 'Show Instrument Detail'}</h6>
        <Switch
          onChange={handleInstrumentHideShow}
          checked={checked}
          height={25}
          width={48}
          uncheckedIcon={false}
          checkedIcon={false}
          onColor='#47be7d'
          // offColor='#992525'
          // boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)'
          className='react-switch'
        />
      </span>

    </>

  )
}

export default BuySellSetting
