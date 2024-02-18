/**
 * Project   : Benemoy Securities Web Application
 * Details   : DP & BO Type - BO Account
 * Author    : BdTask Limited <https://www.bdtask.com>
 * Developers: MMR Ahmad <https://github.com/mmrahmad>
 *           : Ifrat <>
 * Date      : 29-11-2022
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import {useFormik} from 'formik'
import {useCallback, useEffect, useLayoutEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import FormikInput from '../../../common/components/form-items/FormikInput'
import FormikRadio from '../../../common/components/form-items/FormikRadio'
import FormikSelect from '../../../common/components/form-items/FormikSelect'
import dataFormateForSelect from '../../../helpers/data-formate-for-select'
import {boAccountCreate, boTrack, getBoDps, updateBoAccount} from '../../auth/core/_requests'
import BoReference from './BoReference'
import {
  newAccValidationSchema,
  NewAccValInterface,
  NEW_ACC_INIT_VALUE,
} from './NewAccountCreate__Data'
import checkResponseSuccess from '../../../helpers/check-response-success'
import toastAlert from '../../../helpers/toast-alert'
import Tabs from './Tabs'

export function NewAccountCreate(props) {
  // * context
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // * States
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [boTrackId, setBoTrackId] = useState<string>('')
  const [boDataDPS, setBoDataDPS] = useState([
    {
      label: 'Loading...',
      value: '',
    },
  ])
  const [initialValue, setInitialValue] = useState<NewAccValInterface>(NEW_ACC_INIT_VALUE)
  // * Actions
  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: newAccValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, formikHelpers) => {
      setLoading(true)

      if (boTrackId) {
        const updateResponse = await updateBoAccount(values, (values as any).id)

        const isSuccess = checkResponseSuccess(updateResponse)
        toastAlert(
          isSuccess ? 'success' : 'error',
          isSuccess ? 'Data updated successfully!' : 'Something went wrong with updating data!'
        )
      } else {
        const createResponse = await boAccountCreate(values)

        const isSuccess = checkResponseSuccess(createResponse)
        toastAlert(
          isSuccess ? 'success' : 'error',
          isSuccess ? 'Data created successfully!' : 'Something went wrong with creating data!'
        )
        if (isSuccess) {
          const {bo_track_id} = createResponse.data.data
          if (bo_track_id) {
            localStorage.setItem('bo_track_id', bo_track_id)
          } else {
            toastAlert('error', 'Bo Track ID not generated!')
          }
          navigate('/bo-account/input/basic')
        }
      }
      setLoading(false)
    },
  })

  const fetchData = useCallback(
    async (track_id: string | null) => {
      try {
        // If have track ID
        if (track_id) {
          setBoTrackId(track_id)
          const getData = await boTrack(track_id)
          setEditMode(true)
          const {data} = getData.data
          delete data?.bo_no
          setInitialValue(data)
        }

        const dpsData: any = await getBoDps()

        if (dpsData.data.status === 200) {
          let _data = await dataFormateForSelect(dpsData.data.data, 'id', 'dp_name')
          setBoDataDPS(_data)
        }
      } catch (error) {
        console.error(error)
      }
    },
    [dispatch]
  )

  const handleChangeTrackId = (boTrackId: string) => {
    if (!boTrackId) {
      setInitialValue(NEW_ACC_INIT_VALUE)
      setBoTrackId('')
    }
    setBoTrackId(boTrackId)
  }

  // * Effects
  useEffect(() => {
    setInitialValue(NEW_ACC_INIT_VALUE)
  }, [])

  useLayoutEffect(() => {
    let track_id = localStorage.getItem('bo_track_id')
    fetchData(track_id)
  }, [boTrackId, fetchData])

  return (
    <>
      <BoReference handleChangeTrackId={handleChangeTrackId} />
      <div className='row g-5 g-xxl-8'>
        <div className='col-md-3 pe-1'>
          <div className='card h-100'>
            <Tabs trackId={boTrackId} />
          </div>
        </div>

        <div className='col-md-9'>
          <div className='card h-100'>
            <div className='card-header border-0 cursor-pointer'>
              <div className='card-title m-0'>Select DP & BO Type</div>
            </div>

            <div id='kt_account_profile_details' className='collapse show'>
              <form onSubmit={formik.handleSubmit} className='form'>
                <div className='card-body border-top p-9'>
                  <div className='row mb-6'>
                    <div className='col-12'>
                      <FormikSelect
                        field={formik.getFieldProps('dp')}
                        meta={{
                          error: formik.errors['dp'],
                          touched: formik.touched['dp'],
                        }}
                        label='Choose DP'
                        options={boDataDPS}
                        isHorizontal
                        labelWidth={34}
                      />
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <div className='col-xl-6 col-xxl-4'>
                      <FormikRadio
                        field={formik.getFieldProps('bo_option')}
                        meta={{
                          error: formik.errors['bo_option'],
                          touched: formik.touched['bo_option'],
                        }}
                        label='BO option'
                        options={[
                          {label: 'New BO', value: 'New_BO'},
                          {label: 'Link BO', value: 'Link_BO'},
                        ]}
                        isHorizontal
                      />

                      {formik.values['bo_option'] === 'Link_BO' && (
                        <div className='mb-6'>
                          <FormikInput
                            field={formik.getFieldProps('link_account_no')}
                            meta={{
                              error: formik.errors['link_account_no'],
                              touched: formik.touched['link_account_no'],
                            }}
                            label='Link BO account'
                            placeholder='Link BO account'
                          />
                        </div>
                      )}
                    </div>

                    {/* ********* */}
                    <div className='col-xl-6  col-xxl-4'>
                      <FormikRadio
                        field={formik.getFieldProps('residency')}
                        meta={{
                          error: formik.errors['residency'],
                          touched: formik.touched['residency'],
                        }}
                        label='Residency'
                        options={[
                          {label: 'Resident Bangladesh (RB)', value: 'Bangladesh'},
                          {label: 'Non Resident Bangladesh (NRB)', value: 'Non_Resident'},
                        ]}
                        isHorizontal
                      />
                    </div>

                    {/* ********* */}
                    <div className='col-xl-6  col-xxl-4'>
                      <FormikRadio
                        field={formik.getFieldProps('bo_type')}
                        meta={{
                          error: formik.errors['bo_type'],
                          touched: formik.touched['bo_type'],
                        }}
                        label='BO type'
                        options={[
                          {label: 'Individual', value: 'Individual'},
                          {label: 'Joint', value: 'Joint'},
                        ]}
                        isHorizontal
                      />
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
    </>
  )
}
