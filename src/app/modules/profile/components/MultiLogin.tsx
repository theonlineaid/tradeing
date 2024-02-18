/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {useFormik} from 'formik'
import {useState} from 'react'
import {useCookies} from 'react-cookie'
import {Link} from 'react-router-dom'
import * as Yup from 'yup'
import {useAuth} from '../../auth/core/Auth'
import {login} from '../../auth/core/_requests'

const loginSchema = Yup.object().shape({
  user_name: Yup.string().required('User Name is required'),
  password: Yup.string()
    .min(6, 'Minimum 6 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const initialValues = {
  user_name: 'mosan87162@imdutex.com',
  password: 'Asdfg@12345',
}

export function MultiLogin() {
  const setCookie = useCookies(['Authorization'])[1]
  const [loading, setLoading] = useState(false)
  const {saveAuth, setCurrentUser} = useAuth()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        const data: any = await login({email: values.user_name, password: values.password})
        if (data.data.status === 200) {
          setCookie('Authorization', data.data.access_token.replace('Bearer ', ''))
          saveAuth(data.data.data)
          setCurrentUser(data.data.data)
        }
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus('The login detail is incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  return (
    <div className='row'>
      <div className='col-md-5 mx-auto p-lg-5'>
        <div className='card shadow p-10'>
          <form
            className='form w-100'
            onSubmit={formik.handleSubmit}
            noValidate
            id='kt_login_signin_form'
          >
            {/* begin::Heading */}
            <div className='text-center mb-10'>
              <h1 className='text-dark mb-6'>Add Another Profile</h1>
            </div>
            {/* begin::Heading */}

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
            <div className='fv-row mb-14'>
              <label className='form-label fs-6 fw-bolder text-dark'>Email or Username</label>
              <input
                placeholder='Email or Username'
                {...formik.getFieldProps('user_name')}
                className={clsx(
                  'form-control form-control-lg form-control-solid',
                  {'is-invalid': formik.touched.user_name && formik.errors.user_name},
                  {
                    'is-valid': formik.touched.user_name && !formik.errors.user_name,
                  }
                )}
                type='text'
                name='user_name'
                autoComplete='off'
              />
              {formik.touched.user_name && formik.errors.user_name && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{formik.errors.user_name}</span>
                </div>
              )}
            </div>
            {/* end::Form group */}

            {/* begin::Form group */}
            <div className='fv-row mb-10'>
              <div className='d-flex justify-content-between mt-n5'>
                <div className='d-flex flex-stack mb-2'>
                  {/* begin::Label */}
                  <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
                  {/* end::Label */}
                  {/* begin::Link */}
                  <Link
                    to='/auth/forgot-password'
                    className='link-primary fs-6 fw-bolder'
                    style={{marginLeft: '5px'}}
                  >
                    Forgot Password ?
                  </Link>
                  {/* end::Link */}
                </div>
              </div>
              <input
                type='password'
                autoComplete='off'
                {...formik.getFieldProps('password')}
                className={clsx(
                  'form-control form-control-lg form-control-solid',
                  {
                    'is-invalid': formik.touched.password && formik.errors.password,
                  },
                  {
                    'is-valid': formik.touched.password && !formik.errors.password,
                  }
                )}
              />
              {formik.touched.password && formik.errors.password && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.password}</span>
                  </div>
                </div>
              )}
            </div>
            {/* end::Form group */}

            {/* begin::Action */}
            <div className='text-center'>
              <button
                type='submit'
                id='kt_sign_in_submit'
                className='btn btn-lg btn-outline-primary w-100 mb-5'
                disabled={formik.isSubmitting || !formik.isValid}
              >
                {!loading && <span className='indicator-label'>Add Profile</span>}

                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
              {/* <span className='btn btn-light' onClick={handlePlus}>
                +
              </span>
              <span className='btn btn-light' onClick={handleMinus}>
                -
              </span> */}
            </div>
            {/* end::Action */}
          </form>
        </div>
      </div>
    </div>
  )
}
