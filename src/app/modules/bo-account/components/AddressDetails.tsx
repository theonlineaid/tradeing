/**
 * Project   : Benemoy Securities Web Application
 * Details   : Address Info - BO Account
 * Author    : BdTask Limited <https://www.bdtask.com>
 * Developers: MMR Ahmad <https://github.com/mmrahmad>
 *           : Ifrat <>
 * Date      : 29-11-2022
 */

import Tabs from './Tabs'
import {useFormik} from 'formik'
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'
import toastAlert from '../../../helpers/toast-alert'
import checkResponseSuccess from '../../../helpers/check-response-success'
import dataFormateForSelect from '../../../helpers/data-formate-for-select'
import FormikInput from './../../../common/components/form-items/FormikInput'
import FormikSelect from './../../../common/components/form-items/FormikSelect'
import {
  boTrack,
  createAddressInfo,
  getAddressInfo,
  getCountryList,
  updateAddressInfo,
} from '../../auth/core/_requests'
import {addressDetailsSchema, addressInitialValues} from './AddressDetails__Data'

export function AddressDetails() {
  // * Contexts
  const navigate = useNavigate()

  // * States
  const [loading, setLoading] = useState(false)
  const [country, setCountry] = useState([])
  const [editMode, setEditMode] = useState<any>(false)

  // * Actions
  const formik = useFormik({
    initialValues: addressInitialValues,
    validationSchema: addressDetailsSchema,
    onSubmit: async (values) => {
      setLoading(true)

      if (editMode) {
        const updateResponse = await updateAddressInfo(values, (values as any).id)

        const isSuccess = checkResponseSuccess(updateResponse)
        toastAlert(
          isSuccess ? 'success' : 'error',
          isSuccess ? 'Data updated successfully!' : 'Something went wrong with updating data!'
        )
      } else {
        const createResponse = await createAddressInfo(values)

        const isSuccess = checkResponseSuccess(createResponse)
        toastAlert(
          isSuccess ? 'success' : 'error',
          isSuccess ? 'Data created successfully!' : 'Something went wrong with creating data!'
        )
        isSuccess && navigate('/bo-account/input/bank-details')
      }
      setLoading(false)
    },
  })

  const fetchData = async () => {
    try {
      let INIT_DATA: any = {}
      let track_id = localStorage.getItem('bo_track_id')
      if (track_id) {
        let getData = await boTrack(track_id)
        INIT_DATA.bo_account = getData.data.data.id
        const bo_data: any = {bo_account: getData.data.data.id}
        formik.setValues(bo_data)

        const countryData: any = await getCountryList()
        if (countryData.status === 200) {
          let _data = await dataFormateForSelect(countryData.data, 'name', 'name')
          setCountry(_data)
        }

        let getInfoData = await getAddressInfo(track_id)
        if (getInfoData?.data?.status === 200) {
          INIT_DATA = {
            ...INIT_DATA,
            ...getInfoData?.data?.data,
          }
          setEditMode(true)
          formik.setValues(INIT_DATA)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  // * Effects
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='row g-5 g-xxl-8'>
      <div className='col-md-3'>
        <div className='card h-100'>
          <Tabs />
        </div>
      </div>
      <div className='col-md-9'>
        <div className='card h-100'>
          <div className='card-header border-0 cursor-pointer'>
            <div className='card-title m-0'>Address Details</div>
          </div>

          <div id='kt_account_profile_details' className='collapse show'>
            <form
              className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
              onSubmit={formik.handleSubmit}
            >
              <div className='card-body border-top p-9'>
                <div className='card card-border shadow-sm mb-4 pt-4 pb-6 px-4'>
                  <div className='row gx-2'>
                    <div className='col'>
                      <FormikInput
                        field={formik.getFieldProps('permanant_address')}
                        meta={{
                          error: formik.errors['permanant_address'],
                          touched: formik.touched['permanant_address'],
                        }}
                        label='Your Permanent Address'
                        placeholder='Address'
                        type='text'
                      />
                    </div>
                    <div className='col'>
                      <FormikInput
                        field={formik.getFieldProps('present_address_line2')}
                        meta={{
                          error: formik.errors['present_address_line2'],
                          touched: formik.touched['present_address_line2'],
                        }}
                        label=''
                        placeholder='Apartment, street, City'
                        type='text'
                        isRequired={false}
                      />
                    </div>
                  </div>
                </div>
                <div className='card card-border shadow-sm pt-4 pb-6 px-4'>
                  <div className='row'>
                    <div className='col-lg-6 mb-4'>
                      <FormikInput
                        field={formik.getFieldProps('present_address_line1')}
                        meta={{
                          error: formik.errors['present_address_line1'],
                          touched: formik.touched['present_address_line1'],
                        }}
                        label='Your Present Address'
                        placeholder='Present address 2'
                        type='text'
                      />
                    </div>
                    <div className='col-lg-6 mb-4'>
                      <FormikInput
                        field={formik.getFieldProps('present_address_line3')}
                        meta={{
                          error: formik.errors['present_address_line3'],
                          touched: formik.touched['present_address_line3'],
                        }}
                        label='Present address 2'
                        placeholder='Present address 2'
                        type='text'
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-lg-6 mb-4'>
                      <FormikInput
                        field={formik.getFieldProps('city')}
                        meta={{
                          error: formik.errors['city'],
                          touched: formik.touched['city'],
                        }}
                        label='City'
                        placeholder='City'
                        type='text'
                      />
                    </div>
                    <div className='col-lg-6 mb-4'>
                      <FormikInput
                        field={formik.getFieldProps('state')}
                        meta={{
                          error: formik.errors['state'],
                          touched: formik.touched['state'],
                        }}
                        label='State/Division'
                        placeholder='State/Division'
                        type='text'
                      />
                    </div>
                    <div className='col-lg-6 mb-4'>
                      <FormikSelect
                        options={country.map((d: any, k: any) => ({
                          label: d.label,
                          value: d.label,
                        }))}
                        field={formik.getFieldProps('country')}
                        meta={{
                          error: formik.errors['country'],
                          touched: formik.touched['country'],
                        }}
                        label='Citizen/Resident of'
                        type='text'
                      />
                    </div>
                    <div className='col-lg-6 mb-4'>
                      <FormikInput
                        field={formik.getFieldProps('postcode')}
                        meta={{
                          error: formik.errors['postcode'],
                          touched: formik.touched['postcode'],
                        }}
                        label='Postal Code / ZipCode'
                        placeholder='Postal Code / ZipCode'
                        type='number'
                      />
                    </div>
                    <div className='col-lg-6 mb-4'>
                      <FormikInput
                        field={formik.getFieldProps('phone')}
                        meta={{
                          error: formik.errors['phone'],
                          touched: formik.touched['phone'],
                        }}
                        label='Phone'
                        placeholder='Phone'
                        type='text'
                      />
                    </div>
                    <div className='col-lg-6 mb-4'>
                      <FormikInput
                        field={formik.getFieldProps('email')}
                        meta={{
                          error: formik.errors['email'],
                          touched: formik.touched['email'],
                        }}
                        label='Email'
                        placeholder='email'
                        type='email'
                        isRequired={false}
                      />
                    </div>
                    <div className='col-lg-6 mb-4'>
                      <FormikInput
                        field={formik.getFieldProps('contract1')}
                        meta={{
                          error: formik.errors['contract1'],
                          touched: formik.touched['contract1'],
                        }}
                        label='Contact 1'
                        placeholder='01xxxxxx'
                        type='text'
                        isRequired={false}
                      />
                    </div>
                    <div className='col-lg-6 mb-4'>
                      <FormikInput
                        field={formik.getFieldProps('contract2')}
                        meta={{
                          error: formik.errors['contract2'],
                          touched: formik.touched['contract2'],
                        }}
                        label='Contact 2'
                        placeholder='01xxxxxx'
                        type='text'
                        isRequired={false}
                      />
                    </div>
                    <div className='col-lg-6 mb-4'>
                      <FormikInput
                        field={formik.getFieldProps('fax')}
                        meta={{
                          error: formik.errors['fax'],
                          touched: formik.touched['fax'],
                        }}
                        label='Fax'
                        placeholder='fax'
                        type='text'
                        isRequired={false}
                      />
                    </div>
                  </div>
                </div>
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
