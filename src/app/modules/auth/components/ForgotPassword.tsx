/* eslint-disable react-hooks/exhaustive-deps */
import cogoToast from 'cogo-toast'
import {useFormik} from 'formik'
import {useMemo, useState} from 'react'
import Countdown from 'react-countdown'
import {Link, useNavigate} from 'react-router-dom'
import * as Yup from 'yup'

import {forgot, otp} from '../core/_requests'
import FormikInput from './../../../common/components/form-items/FormikInput'

const initialValues = {
  email: '',
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
})

export function ForgotPassword() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [reSend, setReSend] = useState(false)
  const [passwordType, setPasswordType] = useState(true)
  const [rePasswordType, setRePasswordType] = useState(true)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const [count, setCount] = useState(Date.now() + 2 * 60 * 1000)
  const [values, setValues] = useState<any>({
    otp: '',
    password: '',
    new_password: '',
  })
  const [otpTime, setOtpTime] = useState(true)
  const [emailResponseData, setEmailResponseData] = useState<any>(null)

  const validation = (name, value) => {
    if (name === 'password') {
      var message: any = document.getElementById('passwordMessage')
      var passw = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

      if (value.match(passw)) {
        message.innerHTML = ''
        return true
      } else {
        message.innerHTML =
          'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
      }
      return false
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setValues({...values, [name]: value})

    validation(name, value)
  }

  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (EmailValues, {setStatus, setSubmitting}) => {
      setValues({...values, email: EmailValues?.email})
      setLoading(true)
      const data: any = await forgot(EmailValues.email)
      setEmailResponseData(data)
      if (data?.data?.status === 200) {
        cogoToast.success(data?.data?.message, {position: 'top-right'})
      } else {
        cogoToast.error(data?.data?.message, {position: 'top-right'})
      }

      if (data?.data?.status === 200) {
        setCount(Date.now() + 2 * 60 * 1000)
        setOtpTime(true)
      }
      setHasErrors(undefined)
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (values?.otp === '') {
      cogoToast.error('please input OTP', {position: 'top-right'})
      return
    }
    if (values?.password === values?.new_password && validation('password', values?.password)) {
      const otpData: any = await otp(values)

      if (otpData?.data?.status === 200) {
        cogoToast.success(otpData?.data?.message, {position: 'top-right'})
        navigate('/login')
      } else {
        cogoToast.error(otpData?.data?.message, {position: 'top-right'})
      }
    } else {
      cogoToast.error('password is incorrect', {position: 'top-right'})
    }
  }

  const renderer = ({hours, minutes, seconds, completed}) => {
    if (completed) {
      setOtpTime(false)
      return <></>
    } else {
      return (
        <span>
          {hours}:{minutes}:{seconds}
        </span>
      )
    }
  }

  const handleReSend = async () => {
    const reData: any = await forgot(values.email)
    cogoToast.success(reData?.data?.message, {position: 'top-right'})
    setEmailResponseData(reData)
    setReSend(!reSend)
    setCount(Date.now() + 2 * 60 * 1000)
    setOtpTime(true)
  }

  const suggestions = useMemo(
    () => <Countdown date={count} renderer={renderer} />,
    [reSend, otpTime, count]
  )
  const handlePasswordTypeChange = () => {
    setPasswordType((prevState) => !prevState)
  }
  const handleRePasswordTypeChange = () => {
    setRePasswordType((prevState) => !prevState)
  }

  return (
    <>
      {emailResponseData?.data?.status === 200 ? (
        <form onSubmit={handleSubmit}>
          <h1 className='text-dark mb-3 text-center'>Change Your Password ?</h1>

          <div className='text-gray-400 fw-bold fs-4 text-center'>
            Enter your OTP And New Password .
          </div>

          {otpTime ? <>{suggestions}</> : 'Expired Time'}

          <div className='fv-row mb-10'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>OTP</label>
            <input
              name='otp'
              type='number'
              placeholder='Enter Your OTP'
              className='form-control form-control-lg form-control-solid'
              onChange={handleChange}
            />
          </div>
          <div className='fv-row mb-10'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>New Password</label>
            <div className='passwordWrapper'>
              <input
                name='password'
                type={passwordType ? 'password' : 'text'}
                placeholder='Enter Your Password'
                className='form-control form-control-lg form-control-solid'
                onChange={handleChange}
              />
              <svg
                onClick={handlePasswordTypeChange}
                style={{color: !passwordType ? '#0095E8' : ''}}
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                />
              </svg>
            </div>

            <p>
              <span id='passwordMessage' style={{color: 'red'}}></span>
            </p>
          </div>
          <div className='fv-row mb-10'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>Re-Password</label>

            <div className='passwordWrapper'>
              <input
                name='new_password'
                type={rePasswordType ? 'password' : 'text'}
                placeholder='Enter Your Re-Password'
                className='form-control form-control-lg form-control-solid'
                onChange={handleChange}
              />
              <svg
                onClick={handleRePasswordTypeChange}
                style={{color: !rePasswordType ? '#0095E8' : ''}}
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                />
              </svg>
            </div>
          </div>
          <div className='d-flex justify-content-end align-items-center gap-3'>
            <Link to='/auth/login'>
              <button className='btn btn-outline-danger btn-lg'>Back to login</button>
            </Link>
            {otpTime ? (
              <button type='submit' className='btn btn-lg btn-primary fw-bolder'>
                Submit
              </button>
            ) : (
              <button
                type='button'
                onClick={handleReSend}
                className='btn btn-lg btn-primary fw-bolder'
              >
                ReSend
              </button>
            )}
          </div>
        </form>
      ) : (
        <form
          className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
          noValidate
          id='kt_login_password_reset_form'
          onSubmit={formik.handleSubmit}
        >
          <div className='text-center mb-10'>
            {/* begin::Title */}
            <h1 className='text-dark mb-3'>Forgot Password ?</h1>
            {/* end::Title */}

            {/* begin::Link */}
            <div className='text-gray-400 fw-bold fs-4'>
              Enter your email to reset your password.
            </div>
            {/* end::Link */}
          </div>

          {/* begin::Title */}
          {hasErrors === true && (
            <div className='mb-lg-15 alert alert-danger'>
              <div className='alert-text font-weight-bold'>
                Sorry, looks like there are some errors detected, please try again.
              </div>
            </div>
          )}

          {hasErrors === false && (
            <div className='mb-10 bg-light-info p-8 rounded'>
              <div className='text-info'>Sent password reset. Please check your email</div>
            </div>
          )}
          {/* end::Title */}

          {/* begin::Form group */}
          <div className='fv-row mb-10'>
            <FormikInput
              field={formik.getFieldProps('email')}
              meta={{
                error: formik.errors['email'],
                touched: formik.touched['email'],
              }}
              label='Email'
              placeholder='Your email here'
              type='text'
            />
          </div>
          {/* end::Form group */}

          {/* begin::Form group */}
          <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
            <button
              type='submit'
              id='kt_password_reset_submit'
              className='btn btn-lg btn-primary fw-bolder me-4'
            >
              <span className='indicator-label'>Submit</span>
              {loading && (
                <span className='indicator-progress'>
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
            <Link to='/auth/login'>
              <button
                type='button'
                id='kt_login_password_reset_form_cancel_button'
                className='btn btn-lg btn-light-primary fw-bolder'
                disabled={formik.isSubmitting || !formik.isValid}
              >
                Cancel
              </button>
            </Link>{' '}
          </div>
          {/* end::Form group */}
        </form>
      )}
    </>
  )
}
