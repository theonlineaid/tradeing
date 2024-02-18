import {Link} from 'react-router-dom'
import FormikInput from './../../../common/components/form-items/FormikInput'

function RegistrationForm({formik, loading, errorInRegister}) {
  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Heading */}
      <div className='mb-7 text-center'>
        {/* begin::Title */}
        <h1 className='text-dark mb-3'>Create an Account</h1>
        {/* end::Title */}

        {/* begin::Link */}
        <div className='text-gray-400 fw-bold fs-4 dark:tw-text-slate-400'>
          Already have an account?
          <Link to='/auth/login' className='link-primary fw-bolder dark:tw-text-sky-500' style={{marginLeft: '5px'}}>
            Login
          </Link>
        </div>
        {/* end::Link */}
      </div>
      {/* end::Heading */}

      {errorInRegister && !(errorInRegister instanceof Array)
        ? Object.keys(errorInRegister).map((err, index) => (
            <div key={`err-sec-${index}`}>
              {errorInRegister?.[err].map((msg, index) => (
                <p key={`err-msg-${index}`} className='text-capitalize alert alert-danger'>
                  {msg}
                </p>
              ))}
            </div>
          ))
        : null}

      {/* end::Action */}

      {/* begin::Form group */}
      <div className='row mb-4'>
        <div className='col-md-6'>
          <FormikInput
            field={formik.getFieldProps('username')}
            meta={{
              error: formik.errors['username'],
              touched: formik.touched['username'],
            }}
            label='User Name'
            placeholder='User Name'
          />
        </div>
        <div className='col-md-6'>
          <FormikInput
            field={formik.getFieldProps('client_code')}
            meta={{
              error: formik.errors['client_code'],
              touched: formik.touched['client_code'],
            }}
            label='Client Code'
            placeholder='Client Code'
            type='number'
          />
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group Email */}
      <div className='fv-row mb-4'>
        <FormikInput
          field={formik.getFieldProps('email')}
          meta={{
            error: formik.errors['email'],
            touched: formik.touched['email'],
          }}
          label='Email'
          placeholder='Email'
          type='email'
        />
      </div>
      {/* end::Form group */}

      {/* begin::Form group Email */}
      <div className='fv-row mb-4'>
        <FormikInput
          field={formik.getFieldProps('phone')}
          meta={{
            error: formik.errors['phone'],
            touched: formik.touched['phone'],
          }}
          label='Phone'
          placeholder='Phone'
          type='number'
        />
      </div>
      {/* end::Form group */}

      {/* begin::Form group Password */}
      <div className='mb-5' data-kt-password-meter='true'>
        <div className='mb-1'>
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
          {/* begin::Meter */}
          <div
            className='d-flex align-items-center mb-3'
            data-kt-password-meter-control='highlight'
          >
            <div className='flex-grow-1 bg-secondary dark:tw-bg-slate-600 bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary dark:tw-bg-slate-600 bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary dark:tw-bg-slate-600 bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary dark:tw-bg-slate-600 bg-active-success rounded h-5px'></div>
          </div>
          {/* end::Meter */}
        </div>
        <div className='text-muted'>
          Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case
          Character
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group Confirm password */}
      <div className='fv-row mb-5'>
        <FormikInput
          field={formik.getFieldProps('changePassword')}
          meta={{
            error: formik.errors['changePassword'],
            touched: formik.touched['changePassword'],
          }}
          label='Confirm Password'
          placeholder='Password confirmation'
          type='password'
        />
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <div className='form-check form-check-custom form-check-solid'>
          <input
            className='form-check-input dark:tw-bg-slate-700 dark:tw-border-dark-border'
            type='checkbox'
            id='kt_login_toc_agree'
            {...formik.getFieldProps('acceptTerms')}
          />
          <label
            className='form-check-label fw-bold required text-gray-700 dark:tw-text-slate-400 fs-6'
            htmlFor='kt_login_toc_agree'
          >
            I Agree the
            <Link to='/auth/terms' className='ms-1 link-primary dark:tw-text-sky-500'>
              terms and conditions
            </Link>
          </label>
        </div>
        {formik.touched.acceptTerms && formik.errors.acceptTerms && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.acceptTerms}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_up_submit'
          className='tw-bg-primary tw-text-white tw-text-xl tw-font-bold tw-w-full tw-p-3 tw-rounded-lg dark:tw-bg-gradient-to-r dark:tw-from-purple-900 dark:tw-to-purple-800'
          // disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
        >
          {!loading && <span className='indicator-label'>Submit</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...{' '}
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_login_signup_form_cancel_button'
            className='tw-bg-primary tw-text-white tw-text-xl tw-font-bold tw-w-full tw-p-3 tw-rounded-lg dark:tw-bg-dark-300 dark:hover:tw-bg-dark-400 tw-mt-3'
          >
            Cancel
          </button>
        </Link>
      </div>
      {/* end::Form group */}
    </form>
  )
}

export default RegistrationForm
