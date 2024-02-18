/**
 * Project   : Benemoy Securities Web Application
 * Details   : Bank Details - BO Account
 * Author    : BdTask Limited <https://www.bdtask.com>
 * Developers: MMR Ahmad <https://github.com/mmrahmad>
 *           : Ifrat <>
 * Date      : 01-12-2022
 */

import Tabs from './Tabs'
import {useFormik} from 'formik'
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import toastAlert from '../../../helpers/toast-alert'
import ImageWithCrop from '../../../common/components/ImageWithCrop'
import checkResponseSuccess from '../../../helpers/check-response-success'
import FormikInput from '../../../common/components/form-items/FormikInput'
import FormikRadio from '../../../common/components/form-items/FormikRadio'
import {
  bankDetailsInitValues,
  bankDetailsSchema,
  uploadInitialValue,
  UploadInitialValueInterface,
} from './BankDetails__Data'
import {
  boTrack,
  createBankInfo,
  getBankInfo,
  updateBankInfo,
  updateBoBankMedia,
} from '../../auth/core/_requests'

const API_URL_2 = import.meta.env.REACT_APP_API_URL_2

export function BankDetails() {
  // * Context
  const navigate = useNavigate()

  // * States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditMode, setIsEditMode] = useState<any>(false)
  const [uploadData, setUploadData] = useState<UploadInitialValueInterface>(uploadInitialValue)
  const [previousUploadData, setPreviousUploadData] = useState<UploadInitialValueInterface>(
    {} as UploadInitialValueInterface
  )

  let track_id = localStorage ? localStorage.getItem('bo_track_id') : ''

  const formik = useFormik({
    initialValues: bankDetailsInitValues,
    validationSchema: bankDetailsSchema,
    enableReinitialize: true,
    onSubmit: async (values, {}) => {
      setIsSubmitting(true)

      // Media upload validation check
      if (
        !(!!uploadData.account_holder_photo || !!previousUploadData?.account_holder_photo) &&
        !(
          !!uploadData.account_holder_signature || !!previousUploadData?.account_holder_signature
        ) &&
        !(!!uploadData.cheque_book_copy || !!previousUploadData?.cheque_book_copy)
      ) {
        setIsSubmitting(false)
        toastAlert('error', 'Please select required upload files')
        return
      } else {
        const uploadsForUpdate = {
          account_holder_photo: '',
          account_holder_signature: '',
          cheque_book_copy: '',
        }

        if (uploadData?.account_holder_photo) {
          uploadsForUpdate.account_holder_photo = splitBase64ImgData(
            uploadData.account_holder_photo
          )
        }
        if (uploadData?.account_holder_signature) {
          uploadsForUpdate.account_holder_signature = splitBase64ImgData(
            uploadData.account_holder_signature
          )
        }
        if (uploadData?.cheque_book_copy) {
          uploadsForUpdate.cheque_book_copy = splitBase64ImgData(uploadData.cheque_book_copy)
        }

        if (isEditMode) {
          const updateResponse = await updateBankInfo(
            {
              ...values,
              is_nominee: Boolean(values.is_nominee),
            },
            (values as any)?.id
          )

          const isSuccess = checkResponseSuccess(updateResponse)
          toastAlert(
            isSuccess ? 'success' : 'error',
            isSuccess ? 'Data updated successfully!' : 'Something went wrong with updating data!'
          )

          if (
            uploadsForUpdate.account_holder_photo ||
            uploadsForUpdate.account_holder_signature ||
            uploadsForUpdate.cheque_book_copy
          ) {
            const mediaUploadResponse = await updateBoBankMedia(
              uploadsForUpdate,
              (values as any).id
            )

            const isMediaSuccess = checkResponseSuccess(mediaUploadResponse)
            toastAlert(
              isMediaSuccess ? 'success' : 'error',
              isMediaSuccess
                ? 'Data updated successfully!'
                : 'Something went wrong with updating data!'
            )
          }
        } else {
          const createResponse = await createBankInfo({
            ...values,
            is_nominee: Boolean(values.is_nominee),
            normalize: true,
            cheque_book_copy: splitBase64ImgData(uploadData.cheque_book_copy),
            account_holder_photo: splitBase64ImgData(uploadData.account_holder_photo),
            account_holder_signature: splitBase64ImgData(uploadData.account_holder_signature),
          })

          const isSuccess = checkResponseSuccess(createResponse)
          toastAlert(
            isSuccess ? 'success' : 'error',
            isSuccess ? 'Data created successfully!' : 'Something went wrong with creating data!'
          )

          if (isSuccess && values.is_nominee) {
            navigate('/bo-account/input/nominees')
          } else if (isSuccess && !values.is_nominee) {
            navigate('/bo-account/input/finish')
          }
        }

        setIsSubmitting(false)
      }
    },
  })

  /**
   *  to send data url without form info
   * @param data : image 64 bit data url
   * @returns main data without format
   */
  const splitBase64ImgData = (data: string): string => {
    return data.split('base64,')[1]
  }

  /**
   *
   * @param name : Media name
   * @param value : Upload media 64bit data url
   */
  const handleImageState = (name, value) => {
    setUploadData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  /**
   *
   * @param name : To remove previous uploaded media url remove from state
   */
  const removePrevUploadData = (name: string) => {
    setPreviousUploadData((prevState) => {
      delete prevState[name]
      return prevState
    })
  }

  const fetchData = async () => {
    try {
      let INIT_DATA: any = {}
      if (track_id) {
        let getData = await boTrack(track_id)
        INIT_DATA.bo_account = getData.data.data.id
        const bo_data: any = {bo_account: getData.data.data.id}
        formik.setValues((prevState) => ({
          ...prevState,
          bo_account: bo_data.bo_account,
        }))
        let getInfoData = await getBankInfo(track_id)
        if (getInfoData?.data?.status === 200) {
          setPreviousUploadData((prevState) => {
            const updatedValues: any = {}
            if (getInfoData?.data?.data.account_holder_photo) {
              updatedValues.account_holder_photo =
                API_URL_2 + getInfoData?.data?.data.account_holder_photo
            }
            if (getInfoData?.data?.data.account_holder_signature) {
              updatedValues.account_holder_signature =
                API_URL_2 + getInfoData?.data?.data.account_holder_signature
            }
            if (getInfoData?.data?.data.cheque_book_copy) {
              updatedValues.cheque_book_copy = API_URL_2 + getInfoData?.data?.data.cheque_book_copy
            }
            return updatedValues
          })

          delete getInfoData?.data?.data['account_holder_photo']
          delete getInfoData?.data?.data['account_holder_signature']
          delete getInfoData?.data?.data['cheque_book_copy']

          setIsEditMode(true)
          INIT_DATA = {...INIT_DATA, ...getInfoData?.data?.data}
          formik.setValues(INIT_DATA)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

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
            <div className='card-title m-0'>Bank Details</div>
          </div>

          <div id='kt_account_profile_details' className='collapse show'>
            {/* Start using formik */}
            <form
              className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
              onSubmit={formik.handleSubmit}
            >
              <section className='card-body border-top p-9 pb-0'>
                <div className='row mb-0'>
                  <div className='col-lg-6 mb-4'>
                    <FormikInput
                      field={formik.getFieldProps('b_routing_no')}
                      meta={{
                        error: formik.errors['b_routing_no'],
                        touched: formik.touched['b_routing_no'],
                      }}
                      label='Routing Number'
                      placeholder='Routing Number'
                      type='number'
                    />
                  </div>
                  <div className='col-lg-6 mb-4'>
                    <FormikInput
                      field={formik.getFieldProps('b_name')}
                      meta={{
                        error: formik.errors['b_name'],
                        touched: formik.touched['b_name'],
                      }}
                      label='Bank Name'
                      placeholder='Bank Name'
                      type='text'
                    />
                  </div>
                  <div className='col-lg-6 mb-4'>
                    <FormikInput
                      field={formik.getFieldProps('b_branch_name')}
                      meta={{
                        error: formik.errors['b_branch_name'],
                        touched: formik.touched['b_branch_name'],
                      }}
                      label='Branch Name'
                      placeholder='Branch Name'
                      type='text'
                    />
                  </div>
                  <div className='col-lg-6 mb-4'>
                    <FormikInput
                      field={formik.getFieldProps('b_address')}
                      meta={{
                        error: formik.errors['b_address'],
                        touched: formik.touched['b_address'],
                      }}
                      label='District Name'
                      placeholder='District Name'
                      type='text'
                    />
                  </div>
                  <div className='col-lg-6 mb-4'>
                    <FormikInput
                      field={formik.getFieldProps('b_account_no')}
                      meta={{
                        error: formik.errors['b_account_no'],
                        touched: formik.touched['b_account_no'],
                      }}
                      label='Bank Account No'
                      placeholder='Bank Account No'
                      type='text'
                    />
                  </div>
                </div>
              </section>
              {/* Uploads Section */}
              <section>
                <div className='card-body border-top p-9 pb-0'>
                  <div className='row mb-0'>
                    <div className='col-lg-12'>
                      <FormikRadio
                        field={formik.getFieldProps('is_nominee')}
                        meta={{
                          error: formik.errors['is_nominee'],
                          touched: formik.touched['is_nominee'],
                        }}
                        label='Do you want to add nominee?'
                        options={[
                          {label: 'Yes', value: true},
                          {label: 'No', value: false},
                        ]}
                      />
                      <p id='bankAccountError' style={{color: 'red'}}></p>
                    </div>
                  </div>
                </div>
              </section>

              <section className='card-body border-top p-9 pb-0'>
                <h2 className='ps-5'>Upload</h2>

                <div className='row mb-4'>
                  <div className='col-lg-6'>
                    <ImageWithCrop
                      label='Account Holder Photo'
                      name='account_holder_photo'
                      initValue={previousUploadData}
                      removeInitValue={removePrevUploadData}
                      handleImageState={handleImageState}
                      aspect={1.5 / 2}
                    />
                  </div>
                </div>

                <div className='row mb-4'>
                  <div className='col-lg-6'>
                    <ImageWithCrop
                      label='Cheque Book Copy Photo'
                      name='cheque_book_copy'
                      initValue={previousUploadData}
                      removeInitValue={removePrevUploadData}
                      handleImageState={handleImageState}
                      imageSize={{width: '400px', height: '150px'}}
                    />
                  </div>
                </div>

                <div className='row mb-4'>
                  <div className='col-lg-6'>
                    <ImageWithCrop
                      label='Account Holder Signature Photo'
                      name='account_holder_signature'
                      initValue={previousUploadData}
                      removeInitValue={removePrevUploadData}
                      handleImageState={handleImageState}
                      imageSize={{width: '300px', height: '100px'}}
                    />
                  </div>
                </div>
              </section>
              {/* Submit button */}
              <div className='card-footer d-flex justify-content-end py-6 px-9'>
                <button type='submit' className='btn btn-outline-primary' disabled={isSubmitting}>
                  {!isSubmitting && 'Save Changes'}
                  {isSubmitting && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...{' '}
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>
              </div>
            </form>
            {/* End using formik */}
          </div>
        </div>
      </div>
    </div>
  )
}
