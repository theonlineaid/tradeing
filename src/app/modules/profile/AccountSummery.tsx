import {useEffect, useState} from 'react'
import {allUserBoInfo, userAccProfit} from './../auth/core/_requests'
import PieChart from './PieChart'

const AccountSummery = () => {
  const [allBoAccount, setAllBoAccount] = useState<any>([])
  const [portfolioValue, setPortfolioValue] = useState<any>([])
  const [Balance, setBalance] = useState<any>(false)

  const fetchData = async () => {
    try {
      let bo = await allUserBoInfo()
      setAllBoAccount(bo.data.data)
      setPortfolioValue(bo.data.data[1].bo_account.bo_id)
      User_portfolio(bo.data.data[1].bo_account.bo_id)
    } catch (error) {
      console.error(error)
    }
  }

  const User_portfolio = async (params: any) => {
    setPortfolioValue(params)
    let userProBalance = await userAccProfit(params)
    setBalance(userProBalance.data)
  }

  // Effects
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <div className='card'>
        <div className='card-body border-top p-4'>
          <div className='d-flex align-items-center border-bottom px-5'>
            <div className='d-flex align-items-center me-3 mb-3'>
              <h6 className='me-4 mb-0'>Portfolio</h6>
              <select
                className='form-select form-select-solid w-150px'
                name='bo_no'
                onChange={(e) => User_portfolio(e.target.value)}
                value={portfolioValue}
              >
                <option value=''>Select Bo No</option>
                {allBoAccount.map((d: any, k: any) => (
                  <option value={d.bo_account.bo_id} key={k}>
                    {d.bo_account.bo_no}
                  </option>
                ))}
              </select>
            </div>
            <div className='content-right-border d-flex align-items-center mb-3'>
              <h6 className='mb-0 mx-3'>Buying Power</h6>
              <p className='text-success-dark fw-bolder mb-0'>
                10,015,315.00 <span>BDT</span>
              </p>
            </div>
            <div className='content-right-border d-flex align-items-center mb-3'>
              <h6 className='mb-0 mx-3'>Available Quantity</h6>
              <p className='text-success-dark fw-bolder mb-0'>0</p>
            </div>
            <div className='d-flex align-items-center mb-3'>
              <h6 className='mb-0 mx-3'>Gain / Loss</h6>
              <p className='text-success-dark fw-bolder mb-0'>0.00</p>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-7'>
              <div className='account-summery-data'>
                <ul className='account-summery-list'>
                  <li>
                    <h6 className='mb-0'>Current Balance</h6>
                    <p className='fw-bolder mb-0'>
                      <span className='text-primary'>{Balance?.user_balance?.current_balance}</span>
                    </p>
                  </li>
                  <li>
                    <h6 className='mb-0'>Total Profit</h6>
                    <p className='fw-bolder mb-0'>
                      <span className='text-success'>{Balance?.total_profit}</span>
                    </p>
                  </li>
                  <li>
                    <h6 className='mb-0'>Total Loss</h6>
                    <p className='fw-bolder mb-0'>
                      <span className='text-danger'>{Balance?.total_loss}</span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className='col-sm-5'>
              <PieChart />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AccountSummery
