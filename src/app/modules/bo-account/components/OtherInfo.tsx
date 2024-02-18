import cogoToast from 'cogo-toast'
import {useLayoutEffect, useState} from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import dataFormateForSelect from '../../../helpers/data-formate-for-select'
import {
  boTrack,
  createOtherInfo,
  getCountryList,
  getOtherInfo,
  updateOtherInfo,
} from '../../auth/core/_requests'
import Tabs from './Tabs'

const initialValue = {
  bo_account: '',
  citizen: 'Bangladesh',
  statement_cycle: '',
  occupation: '',
  tin: '',
}

export function OtherInfo() {
  const [data, setData] = useState<any>(initialValue)
  const [err, setErr] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState<any>(false)
  const [country, setCountry] = useState([])
  const [boTrackData, setBoTrackData] = useState<any>([])
  const [AllErrFirst, setAllErrFirst] = useState<any>([])

  const handleSubmit = async (event: any) => {
    const form = event.currentTarget
    setLoading(true)
    event.preventDefault()
    if (form.checkValidity() === false) {
      event.stopPropagation()

      let fields_one = Object.keys(data)

      let requiredFields = ['citizen', 'statement_cycle']
      let validate: any = []

      fields_one.map((collection: any, key: any) => {
        if (requiredFields.includes(collection) && !data[collection]) {
          validate.push(collection)
        }
      })
      setAllErrFirst(validate)
    }

    if (form.checkValidity() === true) {
      event.preventDefault()
      let validate
      if (editMode) {
        validate = await updateOtherInfo(data, data.id)
      } else {
        validate = await createOtherInfo(data)
      }

      if (validate?.data?.status === 201 || validate?.data?.status === 200) {
        if (editMode) {
          cogoToast.success('Data Update is Successful', {position: 'top-right'})
        } else {
          cogoToast.success('Data Insert is Successful', {position: 'top-right'})
          window.location.assign('/bo-account/input/address')
        }
        setLoading(false)
      } else {
        cogoToast.error('Something went wrong', {position: 'top-right'})
      }
    }
    setLoading(false)
  }

  const fetchData = async () => {
    let track_id = localStorage.getItem('bo_track_id')
    try {
      if (track_id) {
        let getData = await boTrack(track_id)
        setBoTrackData(getData.data.data)
        nidInputDate('bo_account', getData.data.data.id)
        const countryData: any = await getCountryList()
        if (countryData.status === 200) {
          let _data = await dataFormateForSelect(countryData.data, 'name', 'name')
          setCountry(_data)
        }
        let getInfoData = await getOtherInfo(track_id)
        if (getInfoData?.data?.status === 200) {
          setData(getInfoData?.data?.data)
          setEditMode(true)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  useLayoutEffect(() => {
    fetchData()
  }, [])

  const nidInputDate = async (field_name: string, v: any) => {
    setData({...data, [field_name]: v})
  }

  return (
    <div className='row g-5 g-xxl-8'>
      <div className='col-md-3'>
        <div className='card h-100'>
          <Tabs />
        </div>
      </div>

      <div className='col-md-9'>
        <div className='card mb-5 mb-xl-10 h-100'>
          <div className='card-header border-0 cursor-pointer'>
            <div className='card-title m-0'>Others Info</div>
          </div>

          <div id='kt_account_profile_details' className='collapse show'>
            <form onSubmit={handleSubmit} noValidate className='form'>
              <div className='card-body border-top p-9'>
                <p style={{color: 'green'}}>{successMsg}</p>
                {AllErrFirst.map((d, k) => (
                  <ol style={{color: 'red'}} key={k}>
                    {d.replaceAll('_', ' ').toUpperCase()} is required
                  </ol>
                ))}

                <div className='row mb-6'>
                  <div className='col-lg-6'>
                    <label className='col-form-label required fs-6'>Citizen/Resident of </label>
                    <select
                      className='form-select form-control form-control-solid'
                      aria-label='Select example'
                      onKeyUp={(e: any) => {
                        nidInputDate(e.target.name, e.target.value)
                      }}
                      onChange={(e): any => {
                        nidInputDate(e.target.name, e.target.value)
                      }}
                      name='citizen'
                      required
                      value={data?.citizen}
                    >
                      {country.map((d: any, k: any) => (
                        <option value={d.label} key={k}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='col-lg-6'>
                    <label className='col-form-label required fs-6'>Statement Cycle</label>
                    <select
                      className='form-select form-control form-control-solid'
                      aria-label='Select example'
                      onKeyUp={(e: any) => {
                        nidInputDate(e.target.name, e.target.value)
                        nidInputDate('bo_account', boTrackData.id)
                      }}
                      onChange={(e): any => {
                        nidInputDate('bo_account', boTrackData.id)
                        nidInputDate(e.target.name, e.target.value)
                      }}
                      name='statement_cycle'
                      required
                      value={data?.statement_cycle}
                    >
                      <option value=''>Please Select</option>
                      <option value='3 Years'>3 Years</option>
                      <option value='2 Years'>2 Years</option>
                      <option value='1 Years'>1 Years</option>
                      <option value='6 Months'>6 Months</option>
                      <option value='3 Months'>3 Months</option>
                      <option value='1 Months'>1 Months</option>
                    </select>
                  </div>
                </div>

                <div className='row mb-6'>
                  <div className='col-lg-6'>
                    <div className='mb-10'>
                      Occupation
                      <input
                        type='text'
                        className='form-control form-control-solid'
                        placeholder='Your Occupation'
                        onKeyUp={(e: any) => {
                          nidInputDate(e.target.name, e.target.value)
                        }}
                        onChange={(e): any => {
                          nidInputDate(e.target.name, e.target.value)
                        }}
                        name='occupation'
                        defaultValue={data?.occupation}
                      />
                    </div>
                  </div>

                  <div className='col-lg-6'>
                    <div className='mb-10'>
                      TIN
                      <input
                        type='text'
                        className='form-control form-control-solid'
                        placeholder='Your TIN Number'
                        onKeyUp={(e: any) => {
                          nidInputDate(e.target.name, e.target.value)
                        }}
                        onChange={(e): any => {
                          nidInputDate(e.target.name, e.target.value)
                        }}
                        name='tin'
                        defaultValue={data?.tin}
                      />
                    </div>
                  </div>
                </div>

                <p style={{color: 'red'}}>{err}</p>
                <p style={{color: 'green'}}>{successMsg}</p>
              </div>

              <div className='card-footer d-flex justify-content-end py-6 px-9'>
                <button type='submit' className='btn btn-outline-primary' disabled={loading}>
                  {!loading && 'Save Changes'}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...{' '}
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
