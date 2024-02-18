/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import cogoToast from 'cogo-toast'
import {useFormik} from 'formik'
import {useEffect, useMemo, useState} from 'react'
import {useCookies} from 'react-cookie'
import Countdown from 'react-countdown'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import * as Yup from 'yup'
import {PasswordMeterComponent} from '../../../../_metronic/assets/ts/components'
import checkResponseSuccess from '../../../helpers/check-response-success'
import toastAlert from '../../../helpers/toast-alert'
import type {RootState} from '../../../redux'
import {loginUser} from '../../../redux/slices/loginState'
import {
  removeTemporaryCredential,
  updateTemporaryCredential,
} from '../../../redux/slices/temporaryCredential'
import {removeUserProfile, updateUserProfile} from '../../../redux/slices/userData'
import {
  forgot,
  login,
  otpValidation,
  register,
  sendVerificationCode,
  shareListInitial,
} from '../core/_requests'
import Otp from './Otp'
import RegistrationForm from './RegistrationForm'

const initialValues = {
  username: '',
  email: '',
  password: '',
  client_code: '',
  phone: '',
  changePassword: '',
  acceptTerms: '',
}

const registrationSchema = Yup.object().shape({
  username: Yup.string().required('User Name is required'),
  client_code: Yup.string().required('Client Code is required'),
  phone: Yup.string().required('Phone is required'),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 character')
    .max(50, 'Maximum 50 character')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Minimum 8 character')
    .max(16, 'Maximum 16 character')
    .required('Password is required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Character Character'
    ),
  changePassword: Yup.string()
    .required('Password confirmation is required')
    .when('password', {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
    }),
  acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
})

export function Registration() {
  const userData = useSelector((state: RootState) => state?.userData)
  const temporaryCredential = useSelector((state: RootState) => state?.temporaryCredential)

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [otpPage, setOtpPage] = useState(false)
  const [verification_code, setOtp] = useState('')
  const [otpSuccess, setOtpSuccess] = useState('')
  const navigate = useNavigate()
  const [reSend, setReSend] = useState(false)
  const [otpTime, setOtpTime] = useState(true)
  const [count, setCount] = useState(Date.now() + 2 * 60 * 1000)
  const dispatch = useDispatch()
  const setCookie = useCookies(['Authorization'])[1]

  const [errorInRegister, setErrorInRegister] = useState<any>()

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
      setLoading(true)
      try {
        setEmail(values.email)
        const registerRes = await register({
          email: values.email,
          username: values.username,
          password: values.password,
          client_code: values.client_code,
          phone: values.phone,
        })

        const isSuccess = checkResponseSuccess(registerRes)
        toastAlert(
          isSuccess ? 'success' : 'error',
          isSuccess ? 'Successfully registered!' : 'Something went wrong with register!'
        )

        if (isSuccess) {
          const otpSendRes = await sendVerificationCode(values.email)

          const isSuccess = checkResponseSuccess(otpSendRes)
          toastAlert(
            isSuccess ? 'success' : 'error',
            isSuccess ? 'Otp send successful!' : 'Something went wrong with sending opt!'
          )
          if (isSuccess) {
            const temControl = {
              email: values?.email,
              password: btoa(values?.password),
            }
            dispatch(updateTemporaryCredential(temControl))

            setOtpPage(true)
            localStorage.setItem('OTP', 'true')
            setCount(Date.now() + 2 * 60 * 1000)
            setOtpTime(true)
          }
          resetForm()
        } else {
          setErrorInRegister(registerRes.data?.msg)
        }

        setLoading(false)
      } catch (error: any) {
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  const otpSubmit = async (event: any) => {
    const form = event.currentTarget
    event.preventDefault()
    if (form.checkValidity() === false) {
      event.stopPropagation()
    }

    if (form.checkValidity() === true) {
      try {
        const {data: auth} = await otpValidation({
          email: userData?.profile?.email ? userData?.profile?.email : email,
          verification_code,
        })

        if (auth?.status === 200) {
          cogoToast.success(auth?.msg, {position: 'top-right'})
          localStorage.removeItem('OTP')
          const data: any = await login({
            email: temporaryCredential?.email,
            password: atob(temporaryCredential?.password),
          })

          if (data.data.status === 200) {
            cogoToast.success('Login success!', {position: 'top-right'})
            dispatch(updateUserProfile(data.data?.data))
            dispatch(removeTemporaryCredential())
            if (data?.data?.data?.is_verified) {
              setCookie('Authorization', data.data.access_token.replace('Bearer ', ''))
              dispatch(loginUser(data.data.access_token.replace('Bearer ', '')))
            }
            navigate('/auth/login')
          } else {
            cogoToast.error('Login failed!')
          }
        } else {
          cogoToast.error(auth?.msg, {position: 'top-right'})
        }
      } catch (error) {
        localStorage.removeItem('name')
        setOtpSuccess('Registration Success')
      }
    }
  }
  useEffect(() => {
    if (!localStorage) return

    const storeOtp = localStorage.getItem('OTP')

    if (storeOtp) {
      const _otp = JSON.parse(storeOtp)
      setOtpPage(_otp)
    }
  }, [])

  useEffect(() => {
    PasswordMeterComponent.bootstrap()
  }, [])

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
    if (userData?.profile?.email) {
    }
    const reData: any = await forgot(userData?.profile?.email ? userData?.profile?.email : email)
    cogoToast.success(reData?.data?.message, {position: 'top-right'})
    setReSend(!reSend)
    setCount(Date.now() + 2 * 60 * 1000)
    setOtpTime(true)
  }
  const suggestions = useMemo(
    () => <Countdown date={count} renderer={renderer} />,
    [reSend, otpTime, count]
  )

  const handleSignOut = () => {
    dispatch(removeUserProfile())
    setOtpPage(false)
    localStorage.removeItem('OTP')
    navigate('/login')
  }

  if (!userData.profile?.is_verified && !otpPage) {
    return <RegistrationForm formik={formik} loading={loading} errorInRegister={errorInRegister} />
    // navigate('/dashboard')
  } else if (otpPage && !userData.profile?.is_verified) {
    return (
      <Otp
        email={temporaryCredential?.email ?? userData.profile?.email ?? ''}
        handleReSend={handleReSend}
        handleSignOut={handleSignOut}
        isSubmitting={formik.isSubmitting}
        isValid={formik.isValid}
        otpSubmit={otpSubmit}
        otpSuccess={otpSuccess}
        otpTime={otpTime}
        setOtp={setOtp}
        suggestions={suggestions}
      />
    )
  } else {
    dispatch(removeUserProfile())
    // dispatch(removeUserProfile())
    // location.reload()
    return null
  }
}
