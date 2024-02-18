/* eslint-disable jsx-a11y/anchor-is-valid */
import {useFormik} from 'formik'
import {useState} from 'react'
import {useCookies} from 'react-cookie'
import {useDispatch} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'
import * as Yup from 'yup'
import {loginUser} from '../../../redux/slices/loginState'
import {updateUserProfile} from '../../../redux/slices/userData'
import {login} from '../core/_requests'
import FormikInput from './../../../common/components/form-items/FormikInput'

const loginSchema = Yup.object().shape({
  user_name: Yup.string().required('User Name is required').min(2, 'username minimum 2 character'),
  password: Yup.string()
    .min(6, 'Minimum 6 character')
    .max(16, 'Maximum 16 character')
    .required('Password is required'),
})

const initialValues = {
  user_name: 'khurshid170@gmail.com',
  password: '123456',
}

export function Login() {
  const setCookie = useCookies(['Authorization'])[1]

  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        const data: any = await login({email: values.user_name, password: values.password})

        if (data.status === 200) {
          dispatch(updateUserProfile(data?.data?.data))

          if (data?.data?.data?.is_verified) {
            // console.log('cookie: ', data.data.data.token.access)

            setCookie('Authorization', data.data.data.token.access.replace('Bearer ', ''), {
              path: '/',
              expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            })

            localStorage.setItem('users_status', data.data.data.users_status)

            dispatch(loginUser(data.data.data.token.access.replace('Bearer ', '')))
          } else {
            localStorage.setItem('OTP', 'true')
            navigate('/auth/registration')
          }
        }
      } catch (error) {
        setStatus('The login detail is incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  return (
    <>
      {/* <MarketData/> */}
      <form className='form w-100' onSubmit={formik.handleSubmit} noValidate>
        <div className='text-center mb-10'>
          <h1 className='tw-text-gray-600 tw-font-bold tw-text-3xl tw-mb-5 dark:tw-text-slate-300'>
            Sign In to Benemoy
          </h1>
          <div className='text-gray-400 fw-bold fs-4'>
            New Here?{' '}
            <Link to='/auth/registration' className='link-primary fw-bolder dark:tw-text-cyan-400'>
              Create an Account
            </Link>
          </div>
        </div>

        {formik.status ? (
          <div className='mb-lg-15 alert alert-danger'>
            <div className='alert-text font-weight-bold'>{formik.status}</div>
          </div>
        ) : (
          <>
            {/* <div className='text-info'>
            Use account <strong>admin@demo.com</strong> and password <strong>demo</strong> to
            continue.
          </div> */}
          </>
        )}

        {/* begin::Form group */}
        <div className='fv-row mb-6'>
          <FormikInput
            field={formik.getFieldProps('user_name')}
            meta={{
              error: formik.errors['user_name'],
              touched: formik.touched['user_name'],
            }}
            label='Email or Username'
            placeholder='Email or Username'
            type='text'
          />
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className='fv-row mb-6'>
          <FormikInput
            field={formik.getFieldProps('password')}
            meta={{
              error: formik.errors['password'],
              touched: formik.touched['password'],
            }}
            label='Password'
            placeholder='Password'
            type='password'
          />
          <Link
            to='/auth/forgot-password'
            className='text-danger fs-6 fw-bolder'
            style={{marginLeft: '5px'}}
          >
            Forgot Password ?
          </Link>
        </div>
        {/* end::Form group */}

        {/* begin::Action */}
        <div className='text-center'>
          <button
            type='submit'
            id='kt_sign_in_submit'
            className='tw-bg-primary tw-text-white tw-text-xl tw-font-bold tw-w-full tw-p-3 tw-rounded-lg dark:tw-bg-gradient-to-r dark:tw-from-purple-900 dark:tw-to-purple-800'
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {!loading && <span className='indicator-label'>Continue</span>}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Action */}
      </form>
    </>
  )
}
