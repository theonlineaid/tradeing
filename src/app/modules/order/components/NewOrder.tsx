import {useLayoutEffect, useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Select from 'react-select'
import {config, useSpring} from 'react-spring'
import Swal from 'sweetalert2'
import dataFormateForSelect from '../../../helpers/data-formate-for-select'

import {boList, tradeBuy, tradeDetailsInfo, tradeList, tradeSell} from '../../auth/core/_requests'
import './styles.css'

const initialValue = {
  order_type: 'Regular',
  bo_account_id: '',
  trade_company_id: '',
  order_qty: '',
  drip_qty: '',
  amount: '',
  start_rate: '',
  end_rate: '',
  transaction_type: 'fixed',
  order_valid_from: '',
  order_valid_to: '',
  trading_market_id: '',
  customer_note: '',
  type: 'Sell',
}

export function NewOrder() {
  const [data, setData] = useState<any>(initialValue)
  const [BoData, setBoData] = useState([])
  const [trade_list, settradeList] = useState<any>([])
  const [trade_Details, settrade_Details] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [responseErrFields, setresponseErrFields] = useState<any>([])
  const [responseErr, setresponseErr] = useState<any>([])
  const [SuccessData, setSuccessData] = useState<any>([])
  const [value, onChange] = useState<any>(new Date())
  const [customErrForMarket, SetcustomErrForMarket] = useState<any>('')

  const [progress, setProgress] = useState('0%')
  const props = useSpring({width: progress, config: config.slow})

  const fetchData = async () => {
    try {
      const BoLists: any = await boList()
      if (BoLists.data.statusCode === 200) {
        let datas = await dataFormateForSelect(
          BoLists.data.bo_accounts,
          'bo_account_id',
          'account_holder_name'
        )
        setBoData(datas)
      }

      const trades: any = await tradeList()
      if (trades.data.statusCode === 200) {
        let datas = await dataFormateForSelect(
          trades.data.trade_companies,
          'trade_company_id',
          'tradecode'
        )

        settradeList(datas)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (event: any) => {
    setLoading(false)
    event.preventDefault()

    let validition: any = true
    const fields: any = Object.keys(data)
    fields.map((collection: any, key: any) => {
      let el: any = document.getElementsByName(collection)

      if (el[0]?.style) {
        el[0].style.border = ''
      }
      if (el[0]?.required && !el[0]?.value) {
        el[0].style.border = '1px solid red'
        validition = false
      } else {
        if (el[0]?.parentElement?.style) {
          el[0].parentElement.style.border = ''
        }

        if (el[0]?.parentElement?.parentElement) {
          el[0].parentElement.parentElement.style.border = ''
        }
        if (el[0]?.name === 'order_type' && !data?.order_type) {
          validition = false
          el[0].parentElement.parentElement.style.border = '1px solid red'
        }
        if (el[0]?.name === 'bo_account_id' && !data.bo_account_id) {
          validition = false
          el[0].parentElement.style.border = '1px solid red'
        }
        if (el[0]?.name === 'trading_market_id' && !data.trading_market_id) {
          validition = false
          el[0].parentElement.style.border = '1px solid red'
        }
        if (el[0]?.name === 'trade_company_id' && !data.trade_company_id) {
          validition = false
          el[0].parentElement.style.border = '1px solid red'
        }

        if (el[0]?.name === 'transaction_type' && !data.transaction_type) {
          validition = false
          el[0].parentElement.parentElement.style.border = '1px solid red'
        }
      }
    })

    if (validition) {
      event.stopPropagation()

      try {
        if (data.type == 'Buy') {
          const datasCountry: any = await tradeBuy(data)
          if (datasCountry.data.statusCode === 201) {
            setSuccessData(datasCountry.data.transaction)
            setSuccessMsg('Order Buy Successful')
            Swal.fire({
              icon: 'success',
              title: 'Order Buy Successful',
              showClass: {
                backdrop: 'swal2-noanimation', // disable backdrop animation
                popup: '', // disable popup animation
                icon: '', // disable icon animation
              },
              hideClass: {
                popup: '', // disable popup fade-out animation
              },
            })
          }
        } else {
          const datasCountry: any = await tradeSell(data)
          if (datasCountry.data.statusCode === 201) {
            setSuccessData(datasCountry.data.transaction)
            setSuccessMsg('Order Sell Successful')
            Swal.fire({
              icon: 'success',
              title: 'Order Sell Successful',
              showClass: {
                backdrop: 'swal2-noanimation', // disable backdrop animation
                popup: '', // disable popup animation
                icon: '', // disable icon animation
              },
              hideClass: {
                popup: '', // disable popup fade-out animation
              },
            })
          }
        }
      } catch (error: any) {
        if (error.response.data.statusCode == 400) {
          setresponseErr(error.response.data.message)
          let fields: any = Object.keys(error.response.data.message)
          setresponseErrFields(fields)
        }
      }

      setErr('Please Select All required Fields')
    }
  }

  const nidInput = async (e: any) => {
    setData({...data, [e.target.name]: e.target.value})
    SetcustomErrForMarket('')

    if (e.target.name === 'transaction_type') {
      if (e.target.value == 'market_rate') {
        let quantity: any = document.getElementById('order_qty')
        if (quantity.value) {
          let rate = parseInt(quantity.value) * parseInt(trade_Details.last_trade_price)
          if (rate || rate == 0) {
            setData({
              ...data,
              amount: rate,
              start_rate: rate,
              end_rate: rate,
              transaction_type: e.target.value,
            })
          } else {
            SetcustomErrForMarket('Select tradding company and Quantity first')
          }
        }
      } else {
        setData({
          ...data,
          start_rate: '',
          end_rate: '',
          amount: '',
          transaction_type: e.target.value,
        })
      }
    }
  }

  const nidInputCustom = async (field_name: string, e: any) => {
    setData({...data, [field_name]: e})

    if (field_name === 'trade_company_id') {
      const trades: any = await tradeDetailsInfo(e)

      if (trades.data.statusCode === 200) {
        settrade_Details(trades.data.trade_company)
      }
    }
  }

  const customType = async (e: any) => {
    SetcustomErrForMarket('')
    if (e.target.name === 'fixed_rate') {
      let quantity: any = document.getElementById('order_qty')
      if (quantity.value) {
        let rate = e.target.value
        let amount = parseInt(quantity.value) * parseInt(rate)
        setData({...data, start_rate: amount, end_rate: amount, amount: amount})
      }
    }

    if (e.target.name === 'order_qty') {
      let quantity: any = document.getElementById('fixed_rate')

      if (quantity) {
        let rate = e.target.value
        let amount = parseInt(quantity.value) * parseInt(rate)
        setData({...data, start_rate: amount, end_rate: amount, amount: amount})
      } else {
        if (data.transaction_type === 'market_rate') {
          let rate = parseInt(e.target.value) * parseInt(trade_Details.last_trade_price)

          if (rate || rate == 0) {
            setData({...data, amount: rate, start_rate: rate, end_rate: rate})
          } else {
            SetcustomErrForMarket('Select tradding company first')
          }
        } else {
          let el: any = document.getElementById('start_rate')
          let el_end: any = document.getElementById('end_rate')
          if (el || el_end) {
            let rate = e.target.value
            let el: any = document.getElementById('start_rate')
            let start_rate =
              parseInt(el.value) * parseInt(rate) ? parseInt(el.value) * parseInt(rate) : ''

            let end_rate =
              parseInt(el_end.value) * parseInt(rate) ? parseInt(el_end.value) * parseInt(rate) : ''

            setData({
              ...data,
              amount: start_rate,
              start_rate: start_rate,
              end_rate: end_rate,
            })
          }
        }
      }
    }

    if (e.target.name === 'start_rate' || e.target.name === 'end_rate') {
      let quantity: any = document.getElementById('order_qty')

      if (quantity.value) {
        let el: any = document.getElementById('start_rate')
        let el_end: any = document.getElementById('end_rate')
        if (el || el_end) {
          let rate = quantity.value
          let start_rate =
            parseInt(el.value) * parseInt(rate) ? parseInt(el.value) * parseInt(rate) : ''
          let end_rate =
            parseInt(el_end.value) * parseInt(rate) ? parseInt(el_end.value) * parseInt(rate) : ''
          setData({
            ...data,
            amount: start_rate,
            start_rate: start_rate,
            end_rate: end_rate,
          })
        }
      }
    }
  }

  useLayoutEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='container'>
      <div className='card rounded-2'>
        <form onSubmit={handleSubmit} noValidate>
          {/*begin::Card body*/}
          <div className='card-body p-xxl-14'>
            <div className='row'>
              <div className='col-xl-8'>
                <div className='row g-3'>
                  <div className='col-12'>
                    {/*begin::Input group*/}
                    <div className='fv-row'>
                      {/*begin::Label*/}
                      <label className='form-label mb-1 fs-6 required'>Order Type:</label>
                      {/*End::Label*/}
                      {/*begin::Row*/}
                      <div
                        className='row g-3'
                        data-kt-buttons='true'
                        data-kt-buttons-target="[data-kt-button='true']"
                      >
                        {/*begin::Col*/}
                        <div className='col'>
                          {/*begin::Option*/}
                          <label
                            className='btn btn-outline btn-outline-dashed btn-outline-default d-flex text-start px-4 py-2 active'
                            data-kt-button='true'
                          >
                            {/*begin::Radio*/}
                            <span className='form-check form-check-custom form-check-solid form-check-sm align-items-start'>
                              <input
                                className='form-check-input'
                                type='radio'
                                id='Regular'
                                name='order_type'
                                defaultChecked
                                required
                                value='Regular'
                                onClick={(e): any => {
                                  nidInput(e)
                                }}
                              />
                            </span>
                            {/*end::Radio*/}
                            {/*begin::Info*/}
                            <span className='ms-2'>
                              <span className='fs-6 fw-bolder text-gray-800 d-block'>Regular</span>
                            </span>
                            {/*end::Info*/}
                          </label>
                          {/*end::Option*/}
                        </div>
                        {/*end::Col*/}
                        {/*begin::Col*/}
                        <div className='col'>
                          {/*begin::Option*/}
                          <label
                            className='btn btn-outline btn-outline-dashed btn-outline-default d-flex text-start px-4 py-2'
                            data-kt-button='true'
                          >
                            {/*begin::Radio*/}
                            <span className='form-check form-check-custom form-check-solid form-check-sm align-items-start'>
                              <input
                                className='form-check-input'
                                type='radio'
                                id='Advanced'
                                name='order_type'
                                required
                                value='Advanced'
                                onClick={(e): any => {
                                  nidInput(e)
                                }}
                              />
                            </span>
                            {/*end::Radio*/}
                            {/*begin::Info*/}
                            <span className='ms-3'>
                              <span className='fs-6 fw-bolder text-gray-800 d-block'>Advanced</span>
                            </span>
                            {/*end::Info*/}
                          </label>
                          {/*end::Option*/}
                        </div>
                        {/*end::Col*/}
                        {/*begin::Col*/}
                        <div className='col'>
                          {/*begin::Option*/}
                          <label
                            className='btn btn-outline btn-outline-dashed btn-outline-default d-flex text-start px-4 py-2'
                            data-kt-button='true'
                          >
                            {/*begin::Radio*/}
                            <span className='form-check form-check-custom form-check-solid form-check-sm align-items-start'>
                              <input
                                className='form-check-input'
                                type='radio'
                                id='Algorithmic'
                                name='order_type'
                                required
                                value='Algorithmic'
                                onClick={(e): any => {
                                  nidInput(e)
                                }}
                              />
                            </span>
                            {/*end::Radio*/}
                            {/*begin::Info*/}
                            <span className='ms-3'>
                              <span className='fs-6 fw-bolder text-gray-800 d-block'>
                                Algorithmic
                              </span>
                            </span>
                            {/*end::Info*/}
                          </label>
                          {/*end::Option*/}
                        </div>
                        {/*end::Col*/}
                      </div>
                      {/*end::Row*/}
                    </div>
                    {/*end::Input group*/}
                  </div>
                  <div className='col-sm-6 col-md-6 col-lg-4'>
                    {/*begin::Input group*/}
                    <div className='fv-row'>
                      {/*begin::Label*/}
                      <label className='form-label mb-1 fs-6 required'>BO Account</label>
                      {/*end::Label*/}
                      {/*begin::Input*/}

                      <Select
                        onChange={(e: any) => {
                          nidInputCustom('bo_account_id', e.value)
                        }}
                        name='bo_account_id'
                        className='custom_required'
                        options={BoData}
                      />

                      {/*end::Input*/}
                    </div>
                    {/*end::Input group*/}
                  </div>
                  <div className='col-sm-6 col-md-6 col-lg-4'>
                    {/*begin::Input group*/}
                    <div className='fv-row'>
                      {/*begin::Label*/}
                      <label className='form-label mb-1 fs-6 required'>Type</label>
                      {/*end::Label*/}
                      {/*begin::Input*/}
                      <div
                        className='row g-3'
                        data-kt-buttons='true'
                        data-kt-buttons-target="[data-kt-button='true']"
                      >
                        {/*begin::Col*/}
                        <div className='col'>
                          {/*begin::Option*/}
                          <label
                            className='btn btn-outline btn-outline-dashed btn-outline-default d-flex text-start px-4 py-2'
                            data-kt-button='true'
                          >
                            {/*begin::Radio*/}
                            <span className='form-check form-check-custom form-check-solid form-check-sm align-items-start'>
                              <input
                                className='form-check-input'
                                type='radio'
                                id='Buy'
                                name='type'
                                required
                                value='Buy'
                                onClick={(e): any => {
                                  nidInput(e)
                                }}
                              />
                            </span>
                            {/*end::Radio*/}
                            {/*begin::Info*/}
                            <span className='ms-2'>
                              <span className='fs-6 fw-bolder text-gray-800 d-block'>Buy</span>
                            </span>
                            {/*end::Info*/}
                          </label>
                          {/*end::Option*/}
                        </div>
                        {/*end::Col*/}
                        {/*begin::Col*/}
                        <div className='col'>
                          {/*begin::Option*/}
                          <label
                            className='btn btn-outline btn-outline-dashed btn-outline-default d-flex text-start px-4 py-2'
                            data-kt-button='true'
                          >
                            {/*begin::Radio*/}
                            <span className='form-check form-check-custom form-check-solid form-check-sm align-items-start'>
                              <input
                                className='form-check-input'
                                type='radio'
                                id='Sell'
                                name='type'
                                required
                                value='Sell'
                                onClick={(e): any => {
                                  nidInput(e)
                                }}
                              />
                            </span>
                            {/*end::Radio*/}
                            {/*begin::Info*/}
                            <span className='ms-3'>
                              <span className='fs-6 fw-bolder text-gray-800 d-block'>Sell</span>
                            </span>
                            {/*end::Info*/}
                          </label>
                          {/*end::Option*/}
                        </div>
                        {/*end::Col*/}
                      </div>

                      {/*end::Input*/}
                    </div>
                    {/*end::Input group*/}
                  </div>
                  <div className='col-sm-6 col-md-6 col-lg-4'>
                    {/*begin::Input group*/}
                    <div className='fv-row'>
                      {/*begin::Label*/}
                      <label className='form-label mb-1 fs-6 required'>Stock Exchange</label>
                      {/*end::Label*/}
                      {/*begin::Input*/}
                      <div
                        className='row g-3'
                        data-kt-buttons='true'
                        data-kt-buttons-target="[data-kt-button='true']"
                      >
                        {/*begin::Col*/}
                        <div className='col'>
                          {/*begin::Option*/}
                          <label
                            className='btn btn-outline btn-outline-dashed btn-outline-default d-flex text-start px-4 py-2'
                            data-kt-button='true'
                          >
                            {/*begin::Radio*/}
                            <span className='form-check form-check-custom form-check-solid form-check-sm align-items-start'>
                              <input
                                className='form-check-input'
                                type='radio'
                                id='DSE'
                                name='stock'
                                required
                                value='DSE'
                                onClick={(e): any => {
                                  nidInput(e)
                                }}
                              />
                            </span>
                            {/*end::Radio*/}
                            {/*begin::Info*/}
                            <span className='ms-2'>
                              <span className='fs-6 fw-bolder text-gray-800 d-block'>DSE</span>
                            </span>
                            {/*end::Info*/}
                          </label>
                          {/*end::Option*/}
                        </div>
                        {/*end::Col*/}
                        {/*begin::Col*/}
                        <div className='col'>
                          {/*begin::Option*/}
                          <label
                            className='btn btn-outline btn-outline-dashed btn-outline-default d-flex text-start px-4 py-2'
                            data-kt-button='true'
                          >
                            {/*begin::Radio*/}
                            <span className='form-check form-check-custom form-check-solid form-check-sm align-items-start'>
                              <input
                                className='form-check-input'
                                type='radio'
                                id='CSE'
                                name='stock'
                                required
                                value='CSE'
                                onClick={(e): any => {
                                  nidInput(e)
                                }}
                              />
                            </span>
                            {/*end::Radio*/}
                            {/*begin::Info*/}
                            <span className='ms-3'>
                              <span className='fs-6 fw-bolder text-gray-800 d-block'>CSE</span>
                            </span>
                            {/*end::Info*/}
                          </label>
                          {/*end::Option*/}
                        </div>
                        {/*end::Col*/}
                      </div>
                      {/*end::Input*/}
                    </div>
                    {/*end::Input group*/}
                  </div>
                  <div className='col-sm-6 col-md-6 col-lg-6'>
                    {/*begin::Input group*/}
                    <div className='fv-row'>
                      {/*begin::Label*/}
                      <label className='form-label mb-1 fs-6 required'>Trading Company</label>
                      {/*end::Label*/}
                      {/*begin::Input*/}
                      <Select
                        onChange={(e: any) => {
                          nidInputCustom('trade_company_id', e.value)
                        }}
                        name='trade_company_id'
                        className='custom_required'
                        options={trade_list}
                      />
                      {/*end::Input*/}
                    </div>
                    {/*end::Input group*/}
                  </div>
                  <div className='col-sm-6 col-md-4 col-lg-3'>
                    {/*begin::Input group*/}
                    <div className='fv-row'>
                      {/*begin::Label*/}
                      <label className='form-label mb-1 fs-6 required'>Quantity</label>
                      {/*end::Label*/}
                      {/*begin::Input*/}
                      <input
                        type='number'
                        className='form-control form-control-solid'
                        name='order_qty'
                        required
                        id='order_qty'
                        defaultValue={data.order_qty}
                        onChange={(e): any => {
                          nidInput(e)
                          customType(e)
                        }}
                      />

                      {/*end::Input*/}
                    </div>
                    {/*end::Input group*/}
                  </div>
                  <div className='col-sm-6 col-md-4 col-lg-3'>
                    {/*begin::Input group*/}
                    <div className='fv-row'>
                      {/*begin::Label*/}
                      <label className='form-label mb-1 fs-6 required'>Drip Quantity</label>
                      {/*end::Label*/}
                      {/*begin::Input*/}
                      <input
                        type='number'
                        className='form-control form-control-solid'
                        name='drip_qty'
                        onChange={(e): any => {
                          nidInput(e)
                        }}
                      />

                      {/*end::Input*/}
                    </div>
                    {/*end::Input group*/}
                  </div>
                  <div className='col-sm-6 col-md-4 col-lg-6 col-xl-6 col-xxl-3'>
                    {/*begin::Input group*/}
                    <div className='fv-row'>
                      {/*begin::Label*/}
                      <label className='form-label mb-1 fs-6 required'>Amount</label>
                      {/*end::Label*/}
                      {/*begin::Input*/}
                      <input
                        type='number'
                        className='form-control form-control-solid'
                        name='amount'
                        id='amount'
                        required
                        defaultValue={data.amount}
                        onChange={(e): any => {
                          nidInput(e)
                        }}
                        readOnly
                      />

                      {/*end::Input*/}
                    </div>
                    {/*end::Input group*/}
                  </div>
                  <div className='col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4'>
                    {/*begin::Input group*/}
                    <div className='fv-row'>
                      {/*begin::Label*/}
                      <label className='form-label mb-1 fs-6 required'>Parchase Power</label>
                      {/*end::Label*/}
                      {/*begin::Input*/}
                      <input name='parchase_powe' className='form-control form-control-solid' />
                      {/*end::Input*/}
                    </div>
                    {/*end::Input group*/}
                  </div>
                  <div className='col-sm-12 col-md-6 col-lg-12 col-xl-12 col-xxl-5'>
                    {/*begin::Input group*/}
                    <div className='fv-row'>
                      {/*begin::Label*/}

                      <label className='required form-label mb-1 fs-6 d-block align-items-center fs-6'>
                        Pricing Type:
                      </label>
                      {/*end::Label*/}
                      {/*begin::Radio group*/}
                      <div
                        className='btn-group w-100'
                        data-kt-buttons='true'
                        data-kt-buttons-target='[data-kt-button]'
                      >
                        {/*begin::Radio*/}
                        <label
                          className={
                            data.transaction_type === 'fixed'
                              ? 'btn btn-outline-secondary text-muted text-hover-white text-active-white btn-outline btn-active-success order-price order-price1  active'
                              : 'btn btn-outline-secondary text-muted text-hover-white text-active-white btn-outline btn-active-success order-price order-price1 '
                          }
                          data-kt-button='true'
                        >
                          {/*begin::Input*/}
                          {/* <input class="btn-check" type="radio" id="tab1" name="pricing_type" value="fixed" /> */}
                          <input
                            type='radio'
                            className='btn-check radioCls'
                            id='Fixed'
                            name='transaction_type'
                            required
                            value='fixed'
                            onClick={(e): any => {
                              nidInput(e)
                            }}
                          />
                          {/*end::Input*/}
                          Fixed
                        </label>
                        {/*end::Radio*/}
                        {/*begin::Radio*/}
                        <label
                          className={
                            data.transaction_type === 'range'
                              ? 'btn btn-outline-secondary text-muted text-hover-white text-active-white btn-outline btn-active-success order-price order-price2  active'
                              : 'btn btn-outline-secondary text-muted text-hover-white text-active-white btn-outline btn-active-success order-price order-price2 '
                          }
                          data-kt-button='true'
                        >
                          <input
                            type='radio'
                            className='btn-check radioCls'
                            id='Range'
                            name='transaction_type'
                            required
                            value='range'
                            onClick={(e): any => {
                              nidInput(e)
                            }}
                          />
                          {/*end::Input*/}
                          Range
                        </label>
                        {/*end::Radio*/}
                        {/*begin::Radio*/}
                        <label
                          className={
                            data.transaction_type === 'market_rate'
                              ? 'btn btn-outline-secondary text-muted text-hover-white text-active-white btn-outline btn-active-success order-price order-price3  active'
                              : 'btn btn-outline-secondary text-muted text-hover-white text-active-white btn-outline btn-active-success order-price order-price3 '
                          }
                          data-kt-button='true'
                        >
                          {/*begin::Input*/}
                          <input
                            type='radio'
                            className='btn-check radioCls'
                            id='Market Rate'
                            name='transaction_type'
                            required
                            value='market_rate'
                            onClick={(e): any => {
                              nidInput(e)
                            }}
                          />
                          {/*end::Input*/}
                          Market Rate
                        </label>
                        {/*end::Radio*/}
                      </div>
                      {/*end::Radio group*/}
                    </div>
                    {/*end::Input group*/}
                  </div>

                  {data.transaction_type === 'fixed' && (
                    <div className='radio-content col-12' id='first'>
                      <div className='row g-3'>
                        <div className='col-sm-4 col-md-6 col-lg-3'>
                          {/*begin::Input group*/}
                          <div className='fv-row'>
                            {/*begin::Label*/}
                            <label className='form-label mb-1 fs-6 required'>Fixed Rate</label>
                            {/*end::Label*/}
                            {/*begin::Input*/}
                            <input
                              type='number'
                              className='form-control form-control-solid'
                              name='fixed_rate'
                              id='fixed_rate'
                              onChange={(e): any => {
                                customType(e)
                              }}
                            />

                            {/*end::Input*/}
                          </div>
                          {/*end::Input group*/}
                        </div>
                      </div>
                    </div>
                  )}

                  {data.transaction_type === 'range' && (
                    <div className='radio-content activeTab' id='second'>
                      <div className='row g-3'>
                        <div className='col-sm-6 col-md-6 col-lg-3'>
                          {/*begin::Input group*/}
                          <div className='fv-row'>
                            {/*begin::Label*/}
                            <label className='form-label mb-1 fs-6 required'>Start Rate</label>
                            {/*end::Label*/}
                            {/*begin::Input*/}
                            <input
                              type='text'
                              className='form-control form-control-solid'
                              name='start_rate'
                              id='start_rate'
                              defaultValue={data.start_rate}
                              onChange={(e): any => {
                                nidInput(e)
                                customType(e)
                              }}
                            />

                            {/*end::Input*/}
                          </div>
                          {/*end::Input group*/}
                        </div>
                        <div className='col-sm-6 col-md-6 col-lg-3'>
                          {/*begin::Input group*/}
                          <div className='fv-row'>
                            {/*begin::Label*/}
                            <label className='form-label mb-1 fs-6 required'>End Rate</label>
                            {/*end::Label*/}
                            {/*begin::Input*/}
                            <input
                              type='text'
                              name='end_rate'
                              className='form-control form-control-solid'
                              id='end_rate'
                              defaultValue={data.end_rate}
                              onChange={(e): any => {
                                nidInput(e)
                                customType(e)
                              }}
                            />

                            {/*end::Input*/}
                          </div>
                          {/*end::Input group*/}
                        </div>
                      </div>
                    </div>
                  )}

                  {data.order_type === 'Advanced' && (
                    <div className='radio-content' id='third'>
                      <div className='row g-3'>
                        <div className='col-sm-6 col-md-6 col-lg-6'>
                          {/*begin::Input group*/}
                          <div className='fv-row'>
                            {/*begin::Label*/}
                            <label className='fs-6 fw-bold form-label mb-1 fs-6'>
                              Order Valid From:
                            </label>
                            {/*end::Label*/}
                            {/*begin::Wrapper*/}
                            <div className='position-relative d-flex align-items-center'>
                              {/*begin::Icon*/}
                              {/*begin::Svg Icon | path: icons/duotune/general/gen014.svg*/}
                              <span className='svg-icon svg-icon-2 position-absolute mx-4'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width={24}
                                  height={24}
                                  viewBox='0 0 24 24'
                                  fill='none'
                                >
                                  <path
                                    opacity='0.3'
                                    d='M21 22H3C2.4 22 2 21.6 2 21V5C2 4.4 2.4 4 3 4H21C21.6 4 22 4.4 22 5V21C22 21.6 21.6 22 21 22Z'
                                    fill='currentColor'
                                  />
                                  <path
                                    d='M6 6C5.4 6 5 5.6 5 5V3C5 2.4 5.4 2 6 2C6.6 2 7 2.4 7 3V5C7 5.6 6.6 6 6 6ZM11 5V3C11 2.4 10.6 2 10 2C9.4 2 9 2.4 9 3V5C9 5.6 9.4 6 10 6C10.6 6 11 5.6 11 5ZM15 5V3C15 2.4 14.6 2 14 2C13.4 2 13 2.4 13 3V5C13 5.6 13.4 6 14 6C14.6 6 15 5.6 15 5ZM19 5V3C19 2.4 18.6 2 18 2C17.4 2 17 2.4 17 3V5C17 5.6 17.4 6 18 6C18.6 6 19 5.6 19 5Z'
                                    fill='currentColor'
                                  />
                                  <path
                                    d='M8.8 13.1C9.2 13.1 9.5 13 9.7 12.8C9.9 12.6 10.1 12.3 10.1 11.9C10.1 11.6 10 11.3 9.8 11.1C9.6 10.9 9.3 10.8 9 10.8C8.8 10.8 8.59999 10.8 8.39999 10.9C8.19999 11 8.1 11.1 8 11.2C7.9 11.3 7.8 11.4 7.7 11.6C7.6 11.8 7.5 11.9 7.5 12.1C7.5 12.2 7.4 12.2 7.3 12.3C7.2 12.4 7.09999 12.4 6.89999 12.4C6.69999 12.4 6.6 12.3 6.5 12.2C6.4 12.1 6.3 11.9 6.3 11.7C6.3 11.5 6.4 11.3 6.5 11.1C6.6 10.9 6.8 10.7 7 10.5C7.2 10.3 7.49999 10.1 7.89999 10C8.29999 9.90003 8.60001 9.80003 9.10001 9.80003C9.50001 9.80003 9.80001 9.90003 10.1 10C10.4 10.1 10.7 10.3 10.9 10.4C11.1 10.5 11.3 10.8 11.4 11.1C11.5 11.4 11.6 11.6 11.6 11.9C11.6 12.3 11.5 12.6 11.3 12.9C11.1 13.2 10.9 13.5 10.6 13.7C10.9 13.9 11.2 14.1 11.4 14.3C11.6 14.5 11.8 14.7 11.9 15C12 15.3 12.1 15.5 12.1 15.8C12.1 16.2 12 16.5 11.9 16.8C11.8 17.1 11.5 17.4 11.3 17.7C11.1 18 10.7 18.2 10.3 18.3C9.9 18.4 9.5 18.5 9 18.5C8.5 18.5 8.1 18.4 7.7 18.2C7.3 18 7 17.8 6.8 17.6C6.6 17.4 6.4 17.1 6.3 16.8C6.2 16.5 6.10001 16.3 6.10001 16.1C6.10001 15.9 6.2 15.7 6.3 15.6C6.4 15.5 6.6 15.4 6.8 15.4C6.9 15.4 7.00001 15.4 7.10001 15.5C7.20001 15.6 7.3 15.6 7.3 15.7C7.5 16.2 7.7 16.6 8 16.9C8.3 17.2 8.6 17.3 9 17.3C9.2 17.3 9.5 17.2 9.7 17.1C9.9 17 10.1 16.8 10.3 16.6C10.5 16.4 10.5 16.1 10.5 15.8C10.5 15.3 10.4 15 10.1 14.7C9.80001 14.4 9.50001 14.3 9.10001 14.3C9.00001 14.3 8.9 14.3 8.7 14.3C8.5 14.3 8.39999 14.3 8.39999 14.3C8.19999 14.3 7.99999 14.2 7.89999 14.1C7.79999 14 7.7 13.8 7.7 13.7C7.7 13.5 7.79999 13.4 7.89999 13.2C7.99999 13 8.2 13 8.5 13H8.8V13.1ZM15.3 17.5V12.2C14.3 13 13.6 13.3 13.3 13.3C13.1 13.3 13 13.2 12.9 13.1C12.8 13 12.7 12.8 12.7 12.6C12.7 12.4 12.8 12.3 12.9 12.2C13 12.1 13.2 12 13.6 11.8C14.1 11.6 14.5 11.3 14.7 11.1C14.9 10.9 15.2 10.6 15.5 10.3C15.8 10 15.9 9.80003 15.9 9.70003C15.9 9.60003 16.1 9.60004 16.3 9.60004C16.5 9.60004 16.7 9.70003 16.8 9.80003C16.9 9.90003 17 10.2 17 10.5V17.2C17 18 16.7 18.4 16.2 18.4C16 18.4 15.8 18.3 15.6 18.2C15.4 18.1 15.3 17.8 15.3 17.5Z'
                                    fill='currentColor'
                                  />
                                </svg>
                              </span>
                              {/*end::Svg Icon*/}
                              {/*end::Icon*/}
                              {/*begin::Input*/}
                              <DatePicker
                                selected={data.order_valid_from}
                                className='form-control form-control-solid ps-12 kt_datepicker flatpickr-input active'
                                placeholderText='Pick date Range'
                                onChange={(date: any) => nidInputCustom('order_valid_from', date)}
                                name='order_valid_from'
                              />

                              {/*end::Input*/}
                            </div>
                            {/*end::Wrapper*/}
                          </div>
                          {/*end::Input group*/}
                        </div>
                        <div className='col-sm-6 col-md-6 col-lg-6'>
                          {/*begin::Input group*/}
                          <div className='fv-row'>
                            {/*begin::Label*/}
                            <label className='fs-6 fw-bold form-label mb-1 fs-6'>
                              Order Valid To:
                            </label>
                            {/*end::Label*/}
                            {/*begin::Wrapper*/}
                            <div className='position-relative d-flex align-items-center'>
                              {/*begin::Icon*/}
                              {/*begin::Svg Icon | path: icons/duotune/general/gen014.svg*/}
                              <span className='svg-icon svg-icon-2 position-absolute mx-4'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width={24}
                                  height={24}
                                  viewBox='0 0 24 24'
                                  fill='none'
                                >
                                  <path
                                    opacity='0.3'
                                    d='M22.1 11.5V12.6C22.1 13.2 21.7 13.6 21.2 13.7L19.9 13.9C19.7 14.7 19.4 15.5 18.9 16.2L19.7 17.2999C20 17.6999 20 18.3999 19.6 18.7999L18.8 19.6C18.4 20 17.8 20 17.3 19.7L16.2 18.9C15.5 19.3 14.7 19.7 13.9 19.9L13.7 21.2C13.6 21.7 13.1 22.1 12.6 22.1H11.5C10.9 22.1 10.5 21.7 10.4 21.2L10.2 19.9C9.4 19.7 8.6 19.4 7.9 18.9L6.8 19.7C6.4 20 5.7 20 5.3 19.6L4.5 18.7999C4.1 18.3999 4.1 17.7999 4.4 17.2999L5.2 16.2C4.8 15.5 4.4 14.7 4.2 13.9L2.9 13.7C2.4 13.6 2 13.1 2 12.6V11.5C2 10.9 2.4 10.5 2.9 10.4L4.2 10.2C4.4 9.39995 4.7 8.60002 5.2 7.90002L4.4 6.79993C4.1 6.39993 4.1 5.69993 4.5 5.29993L5.3 4.5C5.7 4.1 6.3 4.10002 6.8 4.40002L7.9 5.19995C8.6 4.79995 9.4 4.39995 10.2 4.19995L10.4 2.90002C10.5 2.40002 11 2 11.5 2H12.6C13.2 2 13.6 2.40002 13.7 2.90002L13.9 4.19995C14.7 4.39995 15.5 4.69995 16.2 5.19995L17.3 4.40002C17.7 4.10002 18.4 4.1 18.8 4.5L19.6 5.29993C20 5.69993 20 6.29993 19.7 6.79993L18.9 7.90002C19.3 8.60002 19.7 9.39995 19.9 10.2L21.2 10.4C21.7 10.5 22.1 11 22.1 11.5ZM12.1 8.59998C10.2 8.59998 8.6 10.2 8.6 12.1C8.6 14 10.2 15.6 12.1 15.6C14 15.6 15.6 14 15.6 12.1C15.6 10.2 14 8.59998 12.1 8.59998Z'
                                    fill='currentColor'
                                  />
                                  <path
                                    d='M17.1 12.1C17.1 14.9 14.9 17.1 12.1 17.1C9.30001 17.1 7.10001 14.9 7.10001 12.1C7.10001 9.29998 9.30001 7.09998 12.1 7.09998C14.9 7.09998 17.1 9.29998 17.1 12.1ZM12.1 10.1C11 10.1 10.1 11 10.1 12.1C10.1 13.2 11 14.1 12.1 14.1C13.2 14.1 14.1 13.2 14.1 12.1C14.1 11 13.2 10.1 12.1 10.1Z'
                                    fill='currentColor'
                                  />
                                </svg>
                              </span>
                              {/*end::Svg Icon*/}
                              {/*end::Icon*/}
                              {/*begin::Input*/}

                              <DatePicker
                                selected={data.order_valid_to}
                                className='form-control form-control-solid ps-12 kt_datepicker flatpickr-input active'
                                placeholderText='Pick date Range'
                                onChange={(date: any) => nidInputCustom('order_valid_to', date)}
                                name='order_valid_to'
                              />

                              {/*end::Input*/}
                            </div>
                            {/*end::Wrapper*/}
                          </div>
                          {/*end::Input group*/}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className='col-sm-12 col-md-12 col-lg-12'>
                    {/*begin::Input group*/}
                    <div className='fv-row'>
                      {/*begin::Label*/}
                      <label className='fs-6 form-label mb-1 fs-6'>Customer Note:</label>
                      {/*end::Label*/}
                      {/*begin::Textarea*/}
                      <textarea
                        className='form-control form-control-solid'
                        rows={2}
                        name='customer_note'
                        onChange={(e): any => {
                          nidInput(e)
                        }}
                      ></textarea>
                      {/*end::Textarea*/}
                    </div>
                    {/*end::Input group*/}
                  </div>

                  <div className='col-12'>
                    <button className='btn btn-outline-primary mt-2'> Submit </button>

                    <p style={{color: 'red'}}> {customErrForMarket} </p>

                    {responseErrFields.length > 0 && (
                      <div className='row mb-6'>
                        <div className='col-lg-12'>
                          <div className='mb-10'>
                            All Errors
                            <div className='row'>
                              {responseErrFields.map((collection: any, key: any) => (
                                <ul key={key}>
                                  {collection?.toUpperCase().replaceAll('_', ' ')}
                                  <ul>
                                    {responseErr[collection].map(
                                      (collection_2: any, key_2: any) => (
                                        <li key={key_2} style={{color: 'red'}}>
                                          {' '}
                                          {collection_2.replaceAll('_', ' ')}{' '}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </ul>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='col-xl-4 ps-xxl-20'>
                <div
                  className='card card-body shadow-card mt-8 mt-xl-0 pd-5'
                  style={{backgroundColor: '#F6E5CA'}}
                >
                  <table className='table table-row-dashed table-row-gray-300 gy-7 mb-0'>
                    <tbody>
                      <tr>
                        <th className='text-gray-800 font-bolder py-2'>Category:</th>
                        <td className='py-2 text-end'>{trade_Details.category}</td>
                      </tr>
                      <tr>
                        <th className='text-gray-800 font-bolder py-2'>Last Trade Date:</th>
                        <td className='py-2 text-end'>02-sep-2021</td>
                      </tr>
                      <tr>
                        <th className='text-gray-800 font-bolder py-2'> Last Trade Price:</th>
                        <td className='py-2 text-end'>{trade_Details.last_trade_price}</td>
                      </tr>
                      <tr>
                        <th className='text-gray-800 font-bolder py-2'>Low - Hight:</th>
                        <td className='py-2 text-end'>
                          {trade_Details.close_price} - {trade_Details.high_price}
                        </td>
                      </tr>
                      <tr>
                        <th className='text-gray-800 font-bolder py-2'>Matured Share:</th>
                        <td className='py-2 text-end'>{trade_Details.matured_share}</td>
                      </tr>
                      <tr>
                        <th className='text-gray-800 font-bolder py-2'>Saleable:</th>
                        <td className='py-2 text-end'>1340</td>
                      </tr>
                      <tr>
                        <th className='text-gray-800 font-bolder py-2'>Commission:</th>
                        <td className='py-2 text-end'>0.00TK</td>
                      </tr>
                      <tr>
                        <th className='text-gray-800 font-bolder py-2'>Actual Balance:</th>
                        <td className='py-2 text-end'>106,231.57TK</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {successMsg && (
                <>
                  <p style={{color: 'green'}}>{successMsg}</p>

                  <table className='table table-hover table-rounded table-striped border gy-7 gs-7'>
                    <thead>
                      <tr className='fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200'>
                        <th>BO Account</th>
                        <th>Order Type</th>
                        <th>Trade Type</th>
                        <th>Stock Exchange</th>
                        <th>Tradding Code</th>
                        <th>Amount</th>
                        <th>Pricing Type</th>
                        <th>Start Rate</th>
                        <th>End Rate</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>{SuccessData.bo_account_id}</th>
                        <th>{SuccessData.order_type}</th>
                        <th>{SuccessData.type}</th>
                        <th>{SuccessData.trading_market_id}</th>
                        <th>{SuccessData.trade_company_id}</th>
                        <th>{SuccessData.amount}</th>
                        <th>{SuccessData.transaction_type} </th>
                        <th>{SuccessData.start_rate}</th>
                        <th>{SuccessData.end_rate}</th>
                        <th>{SuccessData.customer_note}</th>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </form>

        {/*end::Card body*/}
      </div>
    </div>
  )
}
