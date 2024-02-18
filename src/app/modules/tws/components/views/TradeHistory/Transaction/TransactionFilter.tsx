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
    from: string
    to: string
  }
  currentDate: Date
}

const TransactionFilter: React.FC<React.PropsWithChildren<Props>> = ({
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
    <div className='d-flex align-items-center justify-content-between flex-wrap'>
      <div className='d-flex align-items-center ms-1 me-2 mb-1'>
        <h6 className='me-4 mb-0'>Portfolio </h6>
        <CustomSelect handleChange={handleChange} name='client_code' options={options} />
      </div>
      <div className='d-flex align-items-center me-2 mb-1'>
        <h6 className='mb-0 mx-2'>Company Code</h6>
        <input
          type='text'
          id='tradeCode'
          className='form-control w-125px'
          name='scrip'
          onChange={handleChange}
        />
      </div>
      <div className='d-flex align-items-center me-2 mb-1'>
        <h6 className='mb-0 mx-2'>Side</h6>
        <select
          className='form-select w-100px'
          onChange={handleChange}
          name='side'
          value={values.side}
        >
          <option value=''>All</option>
          <option value='Buy'>Buy</option>
          <option value='Sell'>Sell</option>
        </select>
      </div>
      <div className='d-flex align-items-center  mb-1 p-2'>
        <div className='d-flex align-items-center me-2 mb-1'>
          <h6 className='mb-0 mx-2'>From</h6>
          <input
            type='date'
            id='transaction-from'
            className='form-control w-125px'
            name='from'
            value={values?.from}
            onChange={handleChange}
          />
        </div>
        <div className='d-flex align-items-center me-2 mb-1'>
          <h6 className='mb-0 mx-2'>To</h6>
          <input
            type='date'
            id='transaction-to'
            className='form-control w-125px'
            name='to'
            onChange={handleChange}
            value={values?.to}
            max={format(currentDate)}
          />
        </div>
      </div>
    </div>
  )
}

export default TransactionFilter
