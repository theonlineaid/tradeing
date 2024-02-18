function Otp({
  email,
  handleSignOut,
  otpSubmit,
  otpTime,
  suggestions,
  setOtp,
  isSubmitting,
  isValid,
  otpSuccess,
  handleReSend,
}) {
  return (
    <>
      <h1 className='text-dark mb-3'>Enter Confirmation Code</h1>
      <div className='text-gray-400 fw-bold fs-4'>
        To confirm your account, enter the 6-digit code that we sent to: {email}
      </div>
      <div className='text-end mb-5'>
        <button type='button' className='btn btn-outline-primary' onClick={handleSignOut}>
          SignOut
        </button>
      </div>
      <form className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework' onSubmit={otpSubmit}>
        {otpTime ? <>{suggestions}</> : 'Expired Time'}
        <div className='fv-row mb-10 d-flex align-items-center'>
          <label className='form-label fs-6 fw-bolder text-dark me-4'>
            OTP ( Check Your Email Now )
          </label>
          <input
            placeholder='Type Your Code'
            type='text'
            name='verification_code'
            className='form-control'
            autoComplete='off'
            required
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        <div className='text-center'>
          {otpTime ? (
            <>
              <button
                type='submit'
                id='kt_sign_in_submit'
                className='btn btn-lg btn-outline-primary w-100 mb-5'
                disabled={isSubmitting || !isValid}
              >
                <span className='indicator-label'>Verify</span>
              </button>
              <p>{otpSuccess}</p>
            </>
          ) : (
            <button
              type='button'
              onClick={handleReSend}
              className='btn btn-lg btn-outline-primary fw-bolder'
            >
              ReSend
            </button>
          )}
        </div>
      </form>
    </>
  )
}

export default Otp
