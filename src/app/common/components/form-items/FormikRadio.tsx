import clsx from 'clsx'

interface Props {
  field: any
  meta: {
    error: string | undefined
    touched: boolean | undefined
  }
  label: string
  isRequired?: boolean
  isHorizontal?: boolean
  options: {label: string; value: string | number | boolean}[]
}

const FormikRadio: React.FC<React.PropsWithChildren<Props>> = ({
  field,
  meta,
  label,
  options,
  isHorizontal = false,
  isRequired = true,
}) => {
  return (
    <>
      <h3 className={`form-label fw-bolder ${isRequired ? 'required' : ''} fs-6`}>
        {label} &nbsp;
      </h3>
      <div role='group' className={`${isHorizontal ? 'gap-3 d-flex flex-column' : ''}`}>
        {options &&
          options.map((option, i) => (
            <label className='btn btn-outline btn-outline-dashed btn-outline-default text-start px-4 py-2 me-3'>
              <input
                className={clsx(
                  'form-check-input',
                  {'is-invalid': field.touched && field.error},
                  {
                    'is-valid': field.touched && !field.error,
                  },
                  {'radio-btn-checked': field.value === option.value}
                )}
                {...field}
                // defaultChecked={field.value === option.value}
                value={option.value}
                type='radio'
              />
              <span className='fw-bold ps-2 fs-6'>{option.label}</span>
            </label>
          ))}
      </div>

      <div className='position-relative mb-3'>
        {meta.touched && meta.error && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <p className={isHorizontal ? 'text-end' : ''} role='alert'>
                {meta.error}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default FormikRadio
