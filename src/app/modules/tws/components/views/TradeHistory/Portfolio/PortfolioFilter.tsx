import React from 'react'
import {CustomSelect} from '../../../.././../../common/components/form-items'

interface Props {
  handleChange: (e) => void
  client: any[] | null
  profit: any
  values: {
    client_code: string
    exchange: string
  }
  currentDate: Date
}

const PortfolioFilter: React.FC<React.PropsWithChildren<Props>> = ({
  handleChange,
  client,
  profit,
  values,
  currentDate,
}) => {
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
    <div className='d-flex align-items-center justify-content-start flex-wrap'>
      <div className='d-flex align-items-center  me-2 mb-1'>
        <h6 className='mb-0 mx-3'> Portfolio</h6>
        <CustomSelect handleChange={handleChange} name='client_code' options={options} />
      </div>

      <div className='d-flex align-items-center me-2 mb-1'>
        <h6 className='mb-0 mx-3'> Exchange</h6>
        <select className='form-select w-100px py-2' id='exchange'>
          <option selected value='dsc'>
            DSE
          </option>
          <option value='buy' disabled>
            CSE
          </option>
        </select>
      </div>
      <div className=' content-right-border d-flex align-items-center mb-1'>
        <h6 className='mb-0 mx-3'>Total Profit</h6>
        <p className='text-success-dark fw-bolder mb-0'>{profit?.total_profit}</p>
      </div>

      <div className='content-right-border d-flex align-items-center mb-1'>
        <h6 className='mb-0 mx-3'>Total Loss</h6>
        <p className='text-danger fw-bolder mb-0'>{profit?.total_loss}</p>
      </div>

      <div className=' d-flex align-items-center mb-1'>
        <h6 className='mb-0 mx-3'>Current Balance</h6>
        <p className='text-primary fw-bolder mb-0'>
          {profit?.user_balance?.current_balance} <span>BDT</span>
        </p>
      </div>
    </div>
  )
}

export default PortfolioFilter
