/**
 * Project   : Benemoy Securities Web Application
 * Details   : Basic Info - BO Account
 * Author    : BdTask Limited <https://www.bdtask.com>
 * Developers: MMR Ahmad <https://github.com/mmrahmad>
 *           : Ifrat <>
 * Date      : 29-11-2022
 */

import {Field, FieldArray, Form, Formik, FormikHelpers} from 'formik'
import {useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import * as Yup from 'yup'
import {KTSVG, toAbsoluteUrl} from '../../../../_metronic/helpers'
import FormikInput from '../../../common/components/form-items/FormikInput'
import FormikSelect from '../../../common/components/form-items/FormikSelect'
import dataFormateForSelect from '../../../helpers/data-formate-for-select'
import {
  boTrack,
  createBasicInfo,
  getBasicInfo,
  getCountryList,
  updateBasicInfo,
} from '../../auth/core/_requests'
import {BasicInfoInterface, basicInfoSchema, BASIC_INFO_INIT_VALUES} from './BasicInfo__Data'
import Tabs from './Tabs'
import toastAlert from '../../../helpers/toast-alert'
import checkResponseSuccess from '../../../helpers/check-response-success'

interface BasicInfoFormState {
  peoples: BasicInfoInterface[]
}

export function BasicInfo() {
  // * Context
  const navigate = useNavigate()

  // * States
  const [loading, setLoading] = useState<boolean>(false)
  const [boTrackData, setBoTrackData] = useState<any>([])
  const [editMode, setEditMode] = useState<boolean>(false)
  const [country, setCountry] = useState([])
  const [initialValues, setInitialValues] = useState<BasicInfoFormState>({
    peoples: [],
  })

  // * Refs
  const stepperRef = useRef<HTMLDivElement | null>(null)

  // * Schema
  const validationSchema = Yup.object().shape({
    peoples: Yup.array().of(basicInfoSchema),
  })

  // * Actions
  const handleSubmitForm: (
    values: BasicInfoFormState,
    formikHelpers: FormikHelpers<BasicInfoFormState>
  ) => void | Promise<any> = async (values, {setFieldError}) => {
    // Start submitting
    setLoading(true)

    const _values: BasicInfoFormState = JSON.parse(JSON.stringify(values))
    _values.peoples.map((people, index) => {
      _values.peoples[index].nid_no_type = people.nid.length
      _values.peoples[index].bo_account = boTrackData.id
      return people
    })

    if (_values.peoples.length > 1) {
      if (
        _values.peoples[0].nid === _values.peoples[1].nid ||
        _values.peoples[0].name === _values.peoples[1].name
      ) {
        toastAlert('error', "Same NID or name use for person 1 and 2, It's must be different")
        setLoading(false)
        return
      }
    }

    if (editMode) {
      // IF HAVE ID
      _values.peoples.forEach(async (people) => {
        const updateResponse = await updateBasicInfo(people, (people as any).id)
        const isSuccess = checkResponseSuccess(updateResponse)
        toastAlert(
          isSuccess ? 'success' : 'error',
          isSuccess ? 'Data updated successfully!' : 'Something went wrong with updating data!'
        )
      })
    } else {
      let createResponse = await createBasicInfo(_values.peoples)

      const isSuccess = checkResponseSuccess(createResponse)
      toastAlert(
        isSuccess ? 'success' : 'error',
        isSuccess ? 'Data created successfully!' : 'Something went wrong with creating data!'
      )
      if (isSuccess) navigate('/bo-account/input/address')
    }

    // End submitting
    setLoading(false)
  }

  const fetchData = async () => {
    let track_id = localStorage.getItem('bo_track_id')
    if (!track_id) return
    try {
      let getData = await boTrack(track_id)

      setBoTrackData(getData.data.data)

      const countryData: any = await getCountryList()
      if (countryData.status === 200) {
        let _data = await dataFormateForSelect(countryData.data, 'name', 'name')
        setCountry(_data)
      }

      let getBasicData = await getBasicInfo(track_id)

      if (getBasicData?.data?.status === 200) {
        setInitialValues((prevState) => {
          // ({...prevState, peoples: getBasicData.data?.data})
          if (getData.data.data?.bo_type === 'Joint' && getBasicData.data?.data?.length < 2) {

            return {
              ...prevState,
              peoples: [
                getBasicData.data?.data[0],
                {
                  ...BASIC_INFO_INIT_VALUES,
                  person_type: 'Second_Person',
                },
              ],
            }
          } else {
            return {
              ...prevState,
              peoples: getBasicData.data?.data,
            }
          }
        })

        setEditMode(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // * Effects
  useEffect(() => {
    if (boTrackData?.bo_type === 'Joint') {
      setInitialValues((prevState) => ({
        ...prevState,
        peoples: [
          BASIC_INFO_INIT_VALUES,
          {
            ...BASIC_INFO_INIT_VALUES,
            person_type: 'Second_Person',
          },
        ],
      }))
    } else {
      setInitialValues((prevState) => ({...prevState, peoples: [BASIC_INFO_INIT_VALUES]}))
    }
  }, [boTrackData?.bo_type])

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
            <div className='card-title m-0'>Basic Info</div>
          </div>
          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleSubmitForm}
            validationSchema={validationSchema}
            render={({values, errors, resetForm, setFieldValue}) => (
              <Form>
                <FieldArray
                  name='peoples'
                  render={(arrayHelpers) => (
                    <div className='modal-body'>
                      {values.peoples && values.peoples.length
                        ? values.peoples.map((people, index) => {
                            return (
                              <div
                                className={index == 1 ? 'border-top mt-10' : ''}
                                key={`section-no-${index}`}
                              >
                                <h2 className='py-6'>
                                  {index == 0 ? 'First' : 'Second'} Holder Details
                                </h2>
                                <div className='row mb-4'>
                                  <div className='col-md-6 mb-4'>
                                    <Field name={`peoples[${index}].nid`}>
                                      {({field, form, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label='Enter your NID no'
                                          placeholder='Enter your NID number'
                                        />
                                      )}
                                    </Field>
                                  </div>
                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`peoples[${index}].name`}>
                                      {({field, form, meta}) => (
                                        <>
                                          <FormikInput
                                            field={field}
                                            meta={meta}
                                            label='Your name (as per NID)'
                                            placeholder='Enter your name'
                                          />
                                        </>
                                      )}
                                    </Field>
                                  </div>
                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`peoples[${index}].father_name`}>
                                      {({field, form, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label='Father/husband name'
                                          placeholder='Father/husband name'
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`peoples[${index}].mother_name`}>
                                      {({field, form, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label='Mother name'
                                          placeholder='Mother name'
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`peoples[${index}].dob`}>
                                      {({field, form, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label='Date of birth'
                                          type='date'
                                        />
                                      )}
                                    </Field>
                                  </div>
                                  <div className='col-lg-6'>
                                    <Field name={`peoples[${index}].sex`} as='select'>
                                      {({field, form, meta}) => (
                                        <FormikSelect
                                          field={field}
                                          meta={meta}
                                          label='Sex'
                                          options={[
                                            {value: 'Male', label: 'Male'},
                                            {value: 'Female', label: 'Female'},
                                          ]}
                                        />
                                      )}
                                    </Field>
                                  </div>
                                  <div className='col-lg-6'>
                                    <Field name={`peoples[${index}].citizen`} as='select'>
                                      {({field, form, meta}) => (
                                        <FormikSelect
                                          field={field}
                                          meta={meta}
                                          label='Citizen/resident of'
                                          options={country.map((item: any) => ({
                                            label: item.label,
                                            value: item.value,
                                          }))}
                                        />
                                      )}
                                    </Field>
                                  </div>
                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`peoples[${index}].occupation`}>
                                      {({field, form, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label='Occupation'
                                          placeholder='Occupation'
                                          isRequired={false}
                                        />
                                      )}
                                    </Field>
                                  </div>
                                </div>
                                {/* End basic info */}
                                <h5 className='pt-3'>Other Info</h5>

                                <div className='row'>
                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`peoples[${index}].statement_cycle`} as='select'>
                                      {({field, form, meta}) => (
                                        <FormikSelect
                                          field={field}
                                          meta={meta}
                                          label='Statement cycle'
                                          isRequired={false}
                                          options={[
                                            {value: '3 Years', label: '3 Years'},
                                            {value: '2 Years', label: '2 Years'},
                                            {value: '1 Years', label: '1 Years'},
                                            {value: '6 Months', label: '6 Months'},
                                            {value: '3 Months', label: '3 Months'},
                                            {value: '1 Months', label: '1 Months'},
                                          ]}
                                        />
                                      )}
                                    </Field>
                                  </div>
                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`peoples[${index}].tin`}>
                                      {({field, form, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label='TIN'
                                          placeholder='Enter your TIN number'
                                        />
                                      )}
                                    </Field>
                                  </div>
                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`peoples[${index}].passport_no`}>
                                      {({field, form, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label='Passport number (optional)'
                                          placeholder='Passport number'
                                          isRequired={false}
                                        />
                                      )}
                                    </Field>
                                  </div>
                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`peoples[${index}].passport_issue_place`}>
                                      {({field, form, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label='Issue place of passport (optional)'
                                          placeholder='Issue place of passport'
                                          isRequired={false}
                                        />
                                      )}
                                    </Field>
                                  </div>
                                  <div className='col-lg-6'>
                                    <Field name={`peoples[${index}].passport_issue_date`}>
                                      {({field, form, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label='Issue date of passport (optional)'
                                          type='date'
                                          isRequired={false}
                                        />
                                      )}
                                    </Field>
                                  </div>
                                  <div className='col-lg-6'>
                                    <Field name={`peoples[${index}].passport_expire_date`}>
                                      {({field, form, meta}) => {
                                        return (
                                          <FormikInput
                                            field={field}
                                            meta={meta}
                                            label='Expiry date of passport (optional)'
                                            type='date'
                                            isRequired={false}
                                          />
                                        )
                                      }}
                                    </Field>
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        : null}
                      <div className='card-footer d-flex justify-content-end py-6 px-9'>
                        <button
                          type='submit'
                          className='btn btn-outline-primary'
                          disabled={loading}
                        >
                          {!loading && 'Save Changes'}
                          {loading && (
                            <span className='indicator-progress' style={{display: 'block'}}>
                              Please wait...{' '}
                              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                />
              </Form>
            )}
          />
        </div>
      </div>

      <div className='modal fade' id='kt_modal_create_app' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-centered mw-900px'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2>Your NID number</h2>

              <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
              </div>
            </div>

            <div className='modal-body py-lg-10 px-lg-10'>
              <div
                ref={stepperRef}
                className='stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid'
                id='kt_modal_create_app_stepper'
              >
                <div className='d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px'>
                  <div className='stepper-nav ps-lg-10'>
                    <img src={toAbsoluteUrl('/stock-market/HelpNID.png')} alt='' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
