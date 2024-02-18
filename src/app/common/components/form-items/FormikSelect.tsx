import clsx from 'clsx'

interface Props {
  field: any
  meta: {
    error: string | undefined
    touched: boolean | undefined
  }
  label: string
  type?: string
  isRequired?: boolean
  postalExceptThisSymbols?: string[] | []
  options: {label: string; value: string | number}[]
  isHorizontal?: boolean
  labelWidth?: number
}

const FormikSelect: React.FC<React.PropsWithChildren<Props>> = ({
  field,
  meta,
  label,
  isRequired = true,
  postalExceptThisSymbols = [],
  options,
  isHorizontal = false,
  labelWidth = 100,
}) => {
  return (
    <>
      <div
        className={`d-flex justify-content-between ${
          isHorizontal ? 'flex-row align-items-center' : 'flex-column'
        }`}
      >
        <label
          className={`form-label fw-bolder w-34 ${isRequired ? 'required' : ''} fs-6`}
          style={{minWidth: labelWidth + '%'}}
        >
          {label} &nbsp;
        </label>
        <div className='position-relative mb-3 flex-grow-1'>
          <select
            onKeyDown={(e) => postalExceptThisSymbols.includes(e?.key) && e.preventDefault()}
            defaultValue={field.value}
            {...field}
            className={clsx(
              'form-select form-control-lg form-control-solid',
              {'is-invalid': field.touched && field.error},
              {
                'is-valid': field.touched && !field.error,
              }
            )}
          >
            <option value=''>-- Please Select --</option>
            {options &&
              options.map((option, i) => (
                <option value={option.value} key={`${option.value} - ${i}`}>
                  {option.label}
                </option>
              ))}
          </select>
        </div>
      </div>
      {meta.touched && meta.error && (
        <div className='fv-plugins-message-container'>
          <div className='fv-help-block'>
            <p className={isHorizontal ? 'text-end' : ''} role='alert'>
              {meta.error}
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default FormikSelect
