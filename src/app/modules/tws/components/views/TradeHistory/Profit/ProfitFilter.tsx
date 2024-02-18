import {timeFormat} from 'd3-time-format'
import React from 'react'
import {CustomSelect} from '../../../../../../common/components/form-items'

interface Props {
  handleChange: (e) => void
  client: any[] | null
  profit: any
  values: {
    client_code: string
    scrip: string
    side: string
    from: string
    to: string
  }
  currentDate: Date
}

const ProfitFilter: React.FC<React.PropsWithChildren<Props>> = ({
  handleChange,
  client,
  values,
  profit,
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
        <h6 className='me-4 mb-0'>Portfolio</h6>
        <CustomSelect handleChange={handleChange} name='client_code' options={options} />
      </div>
      <div className='d-flex align-items-center me-2 mb-1'>
        <h6 className='mb-0 mx-3'>Side</h6>
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
      <div className='content-right-border d-flex align-items-center mb-1'>
        <h6 className='mb-0 mx-3'>Total Profit</h6>
        <p className='text-success-dark fw-bolder mb-0'>
          {profit?.total_profit} <span>BDT</span>
        </p>
      </div>
      <div className='content-right-border d-flex align-items-center mb-1'>
        <h6 className='mb-0 mx-3'>Total Loss</h6>
        <p className='text-danger fw-bolder mb-0'>
          {profit?.total_loss} <span>BDT</span>
        </p>
      </div>
      <div className='d-flex align-items-center mb-1'>
        <h6 className='mb-0 mx-3'>Current Balance</h6>
        <p className='text-primary fw-bolder mb-0'>
          {profit?.user_balance?.current_balance} <span>BDT</span>
        </p>
      </div>
    </div>
  )
}

export default ProfitFilter
