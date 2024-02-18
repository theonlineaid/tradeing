import React from 'react'
import {timeFormat} from 'd3-time-format'
import {CustomSelect} from '../../../../../../common/components/form-items'

interface Props {
  handleChange: (e) => void
  client: any[] | null
  values: {
    client_code: string
    scrip: string
    side: string
    status: string
    groupBy: string
    order_id: string
    from: string
    to: string
  }
  currentDate: Date
}

const OrderListFilter: React.FC<React.PropsWithChildren<Props>> = ({
  handleChange,
  client,
  values,
  currentDate,
}) => {
  const format = timeFormat('%Y-%m-%d')

  interface OptionInterface {
    label: string
    value: string
  }
  const options: OptionInterface[] = client
    ? client.map((item) => {
        return {
          label: item.client_code ?? '',
          value: item.client_code ?? '',
        }
      })
    : []

  return (
    <div className='flex items-center justify-between flex-wrap'>
      <div className='flex items-center tw-ml-1 tw-mr-2 tw-tw-mb-1'>
        <h6 className='me-4 tw-mb-0'>Portfolio</h6>
        <CustomSelect handleChange={handleChange} name='client_code' options={options} />
      </div>
      <div className='flex items-center tw-ml-2 tw-tw-mb-1'>
        <h6 className='tw-tw-mb-0 tw-mx-3'>Company Code</h6>
        <input
          type='text'
          id='trade_code'
          className='form-control w-125px'
          onChange={handleChange}
          name='scrip'
        />
      </div>
      <div className='flex items-center tw-ml-2 tw-mb-1'>
        <h6 className='tw-mb-0 tw-mx-3'>Side</h6>
        <CustomSelect
          handleChange={handleChange}
          name='side'
          options={[
            {label: 'All', value: ''},
            {label: 'Buy', value: 'Buy'},
            {label: 'Sell', value: 'Sell'},
          ]}
        />
      </div>
      <div className='flex items-center tw-ml-2 tw-mb-1'>
        <h6 className='tw-mb-0 tw-mx-3'>Status</h6>
        <select className='form-select w-125px' onChange={handleChange} name='status'>
          <option defaultValue='' value=''>
            All
          </option>
          <option value='Pending'>Pending</option>
          <option value='Partially Filled'>Partially Filled</option>
          <option value='Filled'>Filled</option>
          <option value='Replaced'>Replaced</option>
          <option value='Cancelled'>Cancelled</option>
          <option value='Rejected'>Rejected</option>
          <option value='OMS Accepted'>OMS Accepted</option>
        </select>
      </div>
      <div className='flex items-center tw-ml-2 tw-mb-1'>
        <h6 className='tw-mb-0 tw-mx-3'>Group By</h6>
        <select className='form-select w-125px' onChange={handleChange} name='groupBy'>
          <option defaultValue='' value=''>
            None
          </option>
          <option value='Trade Code'>Trade Code</option>
          <option value='Exchange'>Exchange</option>
          <option value='Status'>Status</option>
          <option value='Side'>Side</option>
        </select>
      </div>
      <div className='flex items-center tw-ml-2 tw-mb-1'>
        <h6 className='tw-mb-0 tw-mx-3'>Order Id</h6>
        <input
          type='text'
          id='order_id'
          className='form-control w-100px'
          name='order_id'
          onChange={handleChange}
        />
      </div>
      <div className='flex items-center  rounded tw-mb-1 p-2'>
        <div className='flex items-center tw-ml-2'>
          <h6 className='tw-mb-0 tw-mx-3'>From</h6>
          <input
            type='date'
            id='order_from'
            className='form-control cursor-pointer w-125px'
            name='from'
            onChange={handleChange}
          />
        </div>
        <div className='flex items-center tw-ml-2 '>
          <h6 className='tw-mb-0 tw-mx-3'>To</h6>
          <input
            type='date'
            id='order_to'
            className='form-control cursor-pointer w-125px'
            name='to'
            value={values?.to}
            onChange={handleChange}
            max={format(currentDate)}
          />
        </div>
      </div>
    </div>
  )
}

export default OrderListFilter
