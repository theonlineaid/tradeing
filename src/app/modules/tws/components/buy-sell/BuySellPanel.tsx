import React, {useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider, {
  Search,
} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit'
import Switch from 'react-switch'
import TradingInterface from '../../../../common/types/trading-list'
import {singleUserInfo} from '../../../auth/core/_requests'
interface Props {
  handleSwitchChange: () => void
  modalData: any
  data: any
  boAccountData: any
  isBuy: boolean
  setIsBuy: React.Dispatch<React.SetStateAction<boolean>>
  clientCode: string
  handleClientCodeChange: (e: any) => void
  buySellApi: TradingInterface
  setBuySellApi: React.Dispatch<React.SetStateAction<TradingInterface>>
  userProfit: any
  handleSubmit: (event) => void
  handleClose: () => void
  bid_price: number
}

const BuySell: React.FC<React.PropsWithChildren<Props>> = ({
  handleSwitchChange,
  modalData,
  data,
  boAccountData,
  isBuy,
  setIsBuy,
  clientCode,
  handleClientCodeChange,
  buySellApi,
  setBuySellApi,
  userProfit,
  handleSubmit,
  handleClose,
  bid_price,
}) => {
  const tradeBuyColumns = [
    {
      dataField: 'remain_qty',
      text: 'Quantity',
      sort: true,
      headerClasses: 'table-header-style',
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          setBuySellApi((prevState) => ({
            ...prevState,
            ...row,
            price: row.bid_price,
            qty: row.remain_qty,
          }))
          setIsBuy(false)
        },
      },
    },
    {
      dataField: 'bid_price',
      text: 'Bid',
      sort: true,
      headerClasses: 'table-header-style',
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          setBuySellApi((prevState) => ({
            ...prevState,
            ...row,
            price: row.bid_price,
            qty: row.remain_qty,
          }))
          setIsBuy(false)
        },
      },
      formatter: (id, row, key) => {
        if (row) {
          return <>{row.bid_price}</>
        }
      },
    },
  ]
  const tradeSellColumns = [
    {
      dataField: 'remain_qty',
      text: 'Quantity',
      sort: true,
      headerClasses: 'table-header-style',
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          setBuySellApi((prevState) => ({
            ...prevState,
            ...row,
            qty: row.remain_qty,
            price: row.ask_price,
          }))
          setIsBuy(true)
        },
      },
    },
    {
      dataField: 'ask_price',
      text: 'Bid',
      sort: true,
      headerClasses: 'table-header-style',
      formatter: (id, row, key) => {
        if (row) {
          return <>{row.ask_price}</>
        }
      },
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          setBuySellApi((prevState) => ({
            ...prevState,
            ...row,
            price: row.ask_price,
            qty: row.remain_qty,
          }))
          setIsBuy(true)
        },
      },
    },
  ]

  const [availableBalance, setAvailableBalance] = useState<number | null>(null)

  const fetchData = async () => {
    const bo_number = clientCode.split('-')[1]

    if (!bo_number || !modalData?.scrip) return
    // console.log(bo_number)
    // console.log(modalData?.scrip)
    try {
      let single_user_portfolio_info = await singleUserInfo(Number(bo_number), modalData?.scrip)
      setAvailableBalance(single_user_portfolio_info?.data?.data?.bo_balance ?? 0)
    } catch (error) {
      console.error(error)
    }
  }

  // Effects
  useEffect(() => {
    fetchData()
  }, [modalData, boAccountData, clientCode])

  return (
    <div className='trade-window'>
      <div className='row trade-window-gap trade-buy-bg border-bottom'>
        <div className='col-lg-2 col-4 mb-2 mb-lg-0'>
          <span className='d-flex align-items-center pt-2 ps-2'>
            <h6 className='m-0 pe-4'>{isBuy ? 'Buy' : 'Sell'}</h6>
            <Switch
              onChange={handleSwitchChange}
              checked={isBuy}
              height={25}
              width={48}
              uncheckedIcon={false}
              checkedIcon={false}
              offColor='#ff0000'
              onColor='#47be7d'
              boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)'
              className='react-switch'
            />
          </span>
        </div>
        <div className='col-lg-4 col-8 mb-2 mb-lg-0'>
          <div className='d-flex align-items-center'>
            <p className='mb-0 me-3'>Current Balance</p>
            <p className='bg-success-medium mb-0'>
              {userProfit?.user_balance?.current_balance} <span>BDT</span>
            </p>
          </div>
        </div>
        <div className='col-lg-3 col-6'>
          <div className='d-flex align-items-center'>
            <p className='mb-0 me-3'>Available Qty</p>
            <p className='bg-success-medium mb-0'>
              {availableBalance ? Math.floor(availableBalance) : 'N/A'}
            </p>
          </div>
        </div>
        <div className='col-lg-3 col-6'>
          <div className='d-flex align-items-center justify-content-end'>
            <p className='mb-0 me-3'>Gain / Loss</p>
            <p className='bg-success-medium mb-0'>
              {!isNaN(userProfit?.total_profit) && !isNaN(userProfit?.total_loss) ? (
                <span>
                  <span className='text-success-dark'>{userProfit.total_profit}</span>
                  <span> / </span>
                  <span className='text-danger'>{userProfit.total_loss}</span>
                </span>
              ) : (
                'N/A'
              )}
            </p>
          </div>
        </div>
      </div>
      <div className='row m-0 pt-2 border-bottom'>
        <div className='col-lg-2 col-6 mt-1'>
          <input
            name='tw-name'
            className='form-control form-control-solid'
            placeholder='Trade Name'
            readOnly
            value={modalData?.scrip}
          />
        </div>
        <div className='col-lg-3 col-6 mt-1'>
          <select
            className='form-select form-select-solid'
            name='client_code'
            value={clientCode}
            onChange={(e: any) => handleClientCodeChange(e)}
          >
            <option value=''>Select Client Code</option>
            {boAccountData &&
              boAccountData.map((d, k) => (
                <option
                  value={
                    d.bo_account.bo_id +
                    '-' +
                    d.bo_account.bo_no +
                    '-' +
                    d.bo_account.dp +
                    '-' +
                    d.client_code
                  }
                  key={k}
                >
                  {d.client_code}
                </option>
              ))}
          </select>
        </div>
        <div className='col-lg-2 col-3 mt-3 mt-lg-0'>
          <div className='trade-modal-field ms-3'>
            <p className='text-primary fw-bolder mb-0'>90.80</p>
            <h6 className='text-danger m-0'>
              <span className='fw-bolder'>-2.47</span>
              <span className='fw-normal ms-5'>-2.30</span>
            </h6>
          </div>
        </div>
        <div className='col-lg-3 col-5 mt-3 mt-lg-0'>
          <div className='trade-modal-field trade-buy-sell'>
            <p className='mb-1'>Buy / Sell Pending</p>
            <h6>
              <span className='text-success'>0</span>
              <span className='fw-lighter'> / </span>
              <span className='text-danger'>0</span>
            </h6>
          </div>
        </div>
        <div className='col-lg-2 col-4 mt-3 mt-lg-0'>
          <div className='trade-modal-field'>
            <p className='mb-1'>Min / Max</p>
            <h6>83.80 / 102.50</h6>
          </div>
        </div>
      </div>
      <div className='row m-0'>
        <div className='col-lg-6'>
          <div className='trade-list-gen py-1'>
            <button className='btn btn-outline-primary mb-1'>General</button>

            <div className={isBuy ? 'trade-buy-bg p-3' : 'trade-sell-bg p-3'}>
              <div className='row m-0'>
                <div className='col-lg-4'>
                  <label className='form-label mb-1'>Order Type</label>
                  <select
                    className='form-select form-control'
                    aria-label='Select example'
                    name='statement_cycle'
                    required
                  >
                    <option value=''>Limit</option>
                    <option value=''>Market</option>
                    <option value=''>Market Ad Based</option>
                  </select>
                </div>
                <div className='col-lg-4'>
                  <label className='form-label mb-1'>Quantity</label>
                  <input
                    type='number'
                    name='qty'
                    className='form-control'
                    value={buySellApi?.qty}
                    onChange={(e) => {
                      setBuySellApi((prevState) => ({
                        ...prevState,
                        qty: parseInt(e.target.value),
                      }))
                    }}
                  />
                  <p id='remain_qty' style={{color: 'red'}}></p>
                </div>
                <div className='col-lg-4'>
                  <label className='form-label mb-1'>Price</label>
                  <input
                    type='number'
                    name='price'
                    className='form-control'
                    value={buySellApi?.price}
                    onChange={(e) =>
                      setBuySellApi((prevState) => ({
                        ...prevState,
                        price: parseFloat(e.target.value),
                      }))
                    }
                  />
                  <p id='bid_price' style={{color: 'red'}}></p>
                </div>
              </div>
              <div className='row mt-2'>
                <div className='col-lg-4'>
                  <label className='form-label mb-1'>Good Till</label>
                  <select
                    className='form-select form-control'
                    aria-label='Select example'
                    name='statement_cycle'
                    required
                  >
                    <option value=''>Day</option>
                    <option value=''>Month</option>
                    <option value=''>Year</option>
                  </select>
                </div>
                <div className='col-lg-4'>
                  <label className='form-label mb-1'>Disclosed QTY</label>
                  <input type='number' name='disclosedQty' className='form-control' />
                </div>
                <div className='col-lg-4'>
                  <label className='form-label mb-1'>Min Fill</label>
                  <input type='text' name='min-fill' className='form-control' />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-lg-6'>
          <div className='row'>
            <div className='col-6'>
              <ToolkitProvider
                keyField='trade_company_id'
                data={data?.buy ? data?.buy : []}
                columns={tradeBuyColumns}
              >
                {(props: {baseProps: any}) => (
                  <div className='tradelist-buy tw-bg-green-100'>
                    <BootstrapTable
                      keyField='id'
                      data={data?.buy ? data?.buy : []}
                      columns={tradeBuyColumns}
                      bootstrap4
                      striped
                      hover
                    />
                  </div>
                )}
              </ToolkitProvider>
            </div>

            <div className='col-6'>
              <ToolkitProvider
                keyField='trade_company_id'
                data={data?.sell ? data?.sell : []}
                columns={tradeSellColumns}
              >
                {(props: {baseProps: any}) => (
                  <div className='tradelist-sell sell-expand-bg'>
                    {/* <BootstrapTable
                      keyField='id'
                      data={data?.sell ? data?.sell : []}
                      columns={tradeSellColumns}
                      bootstrap4
                      striped
                      hover
                    /> */}
                  </div>
                )}
              </ToolkitProvider>
            </div>
          </div>
        </div>
      </div>
      <Button variant={isBuy ? 'success' : 'danger'} onClick={handleSubmit}>
        {isBuy ? 'Buy' : 'Sell'} {bid_price ? '@' : ' '}
      </Button>
      <button
        type='button'
        className='btn btn-active-light btn-color-muted ms-2'
        onClick={handleClose}
      >
        Reset
      </button>
      <div className='d-flex ps-5'>
        <div className='tw-footer-option'>
          <p className='mb-1'>Order Value</p>
          <h6>0.00</h6>
        </div>
        <div className='tw-footer-option'>
          <p className='mb-1'>Commission</p>
          <h6>0.00</h6>
        </div>
        <div className='tw-footer-option'>
          <p className='mb-1'>Net Value</p>
          <h6>0.00</h6>
        </div>
      </div>
    </div>
  )
}

export default BuySell
