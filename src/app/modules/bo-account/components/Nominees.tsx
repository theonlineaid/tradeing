/**
 * Project   : Benemoy Securities Web Application
 * Details   : Nominees - BO Account
 * Author    : BdTask Limited <https://www.bdtask.com>
 * Developers: MMR Ahmad <https://github.com/mmrahmad>
 *           : Ifrat <>
 * Date      : 04-12-2022
 */

import Tabs from './Tabs'
import {BsTrash} from 'react-icons/bs'
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'
import toastAlert from '../../../helpers/toast-alert'
import {Field, FieldArray, Form, Formik} from 'formik'
import checkResponseSuccess from '../../../helpers/check-response-success'
import FormikInput from '../../../common/components/form-items/FormikInput'
import FormikRadio from '../../../common/components/form-items/FormikRadio'
import dataFormateForSelect from '../../../helpers/data-formate-for-select'
import FormikSelect from '../../../common/components/form-items/FormikSelect'
import {NomineeDataInterface, nomineeValidationSchema, NOMINEE_INIT_VALUE} from './Nominees__Data'
import {
  boTrack,
  createNomineeInfo,
  getCountryList,
  getNomineeInfo,
  updateNomineeInfo,
} from '../../auth/core/_requests'

const Nominees: React.FC<React.PropsWithChildren> = () => {
  //  * Context
  const navigate = useNavigate()

  // * States
  const [loading, setLoading] = useState(false)
  const [country, setCountry] = useState([])
  const [boAccount, setBoAccount] = useState<number | null>()
  const [editMode, setEditMode] = useState<any>(false)
  const [initialValues, setInitialValues] = useState<{nominees: NomineeDataInterface[]}>({
    nominees: [],
  })

  // * Actions
  const fetchData = async () => {
    let track_id = localStorage.getItem('bo_track_id')
    try {
      if (track_id) {
        let getData = await boTrack(track_id)
        setBoAccount(getData.data?.data?.id ?? 0)

        const countryData: any = await getCountryList()
        if (countryData.status === 200) {
          let _data = await dataFormateForSelect(countryData.data, 'name', 'name')
          setCountry(_data)
        }

        let getInfoData = await getNomineeInfo(track_id)
        if (getInfoData?.data?.status === 200) {
          setInitialValues((prevState) => ({...prevState, nominees: getInfoData.data?.data}))

          setEditMode(true)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleFormSubmit = async (values) => {
    setLoading(true)

    if (editMode) {
    } else {
      const createResponse = await createNomineeInfo(
        values.nominees.map((item) => ({
          ...item,
          bo_account: boAccount,
          nid_no_type: item.nid.length,
        }))
      )

      const isSuccess = checkResponseSuccess(createResponse)
      toastAlert(
        isSuccess ? 'success' : 'error',
        isSuccess ? 'Data created successfully!' : 'Something went wrong with creating data!'
      )
      if (isSuccess) navigate('/bo-account/input/finish')
    }
    // updateNomineeInfo
    values.nominees.forEach(async (nominee) => {
      if (nominee?.id) {
        const updateResponse = await updateNomineeInfo(
          {
            ...nominee,
            bo_account: boAccount,
            nid_no_type: nominee.nid.length,
          },
          nominee.id
        )
        const isSuccess = checkResponseSuccess(updateResponse)
        toastAlert(
          isSuccess ? 'success' : 'error',
          isSuccess ? 'Data updated successfully!' : 'Something went wrong with updating data!'
        )
      } else {
        const createResponse = await createNomineeInfo(
          values.nominees.map((nominee) => ({
            ...nominee,
            bo_account: boAccount,
            nid_no_type: nominee.nid.length,
          }))
        )

        const isSuccess = checkResponseSuccess(createResponse)
        toastAlert(
          isSuccess ? 'success' : 'error',
          isSuccess ? 'Data created successfully!' : 'Something went wrong with creating data!'
        )
      }
    })
    setLoading(false)
  }

  // * Effects
  useEffect(() => {
    setInitialValues((prevState) => ({
      ...prevState,
      nominees: [NOMINEE_INIT_VALUE],
    }))
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
            <div className='card-title m-0'>Nominees</div>
          </div>

          <div id='kt_account_profile_details' className='collapse show'>
            <Formik
              initialValues={initialValues}
              validationSchema={nomineeValidationSchema}
              enableReinitialize
              onSubmit={handleFormSubmit}
            >
              {({values, errors}) => (
                <Form>
                  <FieldArray
                    name='nominees'
                    render={({push, pop, remove}) => (
                      <section className='card-body border-top px-9 py-6'>
                        {values.nominees &&
                          values.nominees.map((nominee, index) => (
                            <div
                              className='p-8 shadow-sm rounded my-8 position-relative'
                              key={`nominee-info-card-${index}`}
                            >
                              <div
                                className='actions position-absolute top-0 end-0 bg-danger rounded-circle p-3 cursor-pointer'
                                title='Remove this nominee'
                                onClick={() => remove(index)}
                              >
                                <BsTrash className='text-white fs-2' />
                              </div>
                              <div className='row'>
                                <h3 className='mb-4 font-bold text-center text-primary fs-1'>
                                  <u>Nominee Details - {index + 1}</u>
                                </h3>
                                <div className='nominee-nid'>
                                  <Field name={`nominees[${index}].nid`}>
                                    {({field, meta}) => (
                                      <FormikInput
                                        field={field}
                                        meta={meta}
                                        label='Enter Your NID No'
                                        placeholder='Enter Your NID No'
                                      />
                                    )}
                                  </Field>
                                </div>

                                <div className='row'>
                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`nominees[${index}].name`}>
                                      {({field, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label="Nominee's Name"
                                          placeholder="Nominee's Name"
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div className='col-lg-6'>
                                    <Field name={`nominees[${index}].father_name`}>
                                      {({field, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label="Nominee's Father/Husband Name"
                                          placeholder="Nominee's Father/Husband Name"
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`nominees[${index}].mother_name`}>
                                      {({field, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label="Nominee's Mother Name"
                                          placeholder="Nominee's Mother Name"
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`nominees[${index}].dob`}>
                                      {({field, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          type='date'
                                          label="Nominee's Date Of Birth"
                                          placeholder="Nominee's Date Of Birth"
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`nominees[${index}].sex`}>
                                      {({field, meta}) => (
                                        <FormikRadio
                                          field={field}
                                          meta={meta}
                                          label='Sex'
                                          options={[
                                            {label: 'Male', value: 'Male'},
                                            {label: 'Female', value: 'Female'},
                                          ]}
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`nominees[${index}].percentage`}>
                                      {({field, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          type='number'
                                          label='Percentage (%)'
                                          placeholder='Percentage (%)'
                                          props={{
                                            step: 0.01,
                                            max: 100,
                                            min: 0,
                                          }}
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`nominees[${index}].relation_with_applicant`}>
                                      {({field, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label='Relation With Applicants'
                                          placeholder='Relation With Applicants'
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`nominees[${index}].country`}>
                                      {({field, meta}) => (
                                        <FormikSelect
                                          field={field}
                                          meta={meta}
                                          label='Citizen/Resident of'
                                          options={country.map((d: any) => ({
                                            label: d.label,
                                            value: d.label,
                                          }))}
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`nominees[${index}].address1`}>
                                      {({field, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label="Nominee's Address"
                                          placeholder="Nominee's Address"
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`nominees[${index}].address2`}>
                                      {({field, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label="Nominee's Address 2"
                                          placeholder="Nominee's Address 2"
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`nominees[${index}].address3`}>
                                      {({field, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label="Nominee's Address 3"
                                          placeholder="Nominee's Address 3"
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`nominees[${index}].city`}>
                                      {({field, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label="Nominee's City"
                                          placeholder="Nominee's City"
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`nominees[${index}].state`}>
                                      {({field, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label="Nominee's State/Division"
                                          placeholder="Nominee's State/Division"
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`nominees[${index}].postcode`}>
                                      {({field, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label='Postal Code / ZipCode'
                                          placeholder='Postal Code / ZipCode'
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div className='col-lg-6 mb-4'>
                                    <Field name={`nominees[${index}].phone`}>
                                      {({field, meta}) => (
                                        <FormikInput
                                          field={field}
                                          meta={meta}
                                          label='Phone'
                                          placeholder='Phone'
                                        />
                                      )}
                                    </Field>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                        <div className='col-lg-7'>
                          <div className='d-flex gap-3 py-5'>
                            <button
                              type='button'
                              className='btn btn-outline-primary'
                              onClick={(e) => push(NOMINEE_INIT_VALUE)}
                            >
                              <span>+</span> Add Another Nominee
                            </button>

                            <button
                              type='button'
                              className='btn btn-outline-danger'
                              disabled={values.nominees.length < 2}
                              onClick={(e) => pop()}
                            >
                              <span>-</span> Remove Last One
                            </button>
                          </div>
                        </div>
                      </section>
                    )}
                  />

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
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}

export {Nominees}
