import clsx from 'clsx'
import {useField} from 'formik'
import {useState} from 'react'

interface Props {
  field: any
  meta: {
    error: string | undefined
    touched: boolean | undefined
  }
  label: string
  placeholder?: string
  type?: React.HTMLInputTypeAttribute | undefined
  isRequired?: boolean
  postalExceptThisSymbols?: string[] | []
  props?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
}

const FormikInput: React.FC<React.PropsWithChildren<Props>> = ({
  field,
  meta,
  label,
  placeholder = '',
  type = 'text',
  isRequired = true,
  postalExceptThisSymbols = [],
  props = {},
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

  const handlePasswordTypeChange = () => {
    setIsPasswordVisible((prevState) => !prevState)
  }

  return (
    <>
      <label className={`form-label fw-bolder dark:tw-text-slate-300 ${isRequired ? 'required' : ''}  fs-6`}>
        {label} &nbsp;
      </label>

      <div className={type === 'password' ? 'position-relative mb-3' : ''}>
        <div className={type === 'password' ? 'passwordWrapper' : ''}>
          <input
            placeholder={placeholder}
            type={isPasswordVisible ? 'text' : type}
            onKeyDown={(e) => postalExceptThisSymbols.includes(e?.key) && e.preventDefault()}
            {...field}
            {...props}
            className={clsx(
              'form-control form-control-lg form-control-solid dark:tw-text-slate-400 dark:tw-bg-dark-400 dark:tw-border-dark-border',
              {'is-invalid': meta.touched && meta.error},
              {
                'is-valid': meta.touched && !meta.error,
              },
              {
                'date-field': type === 'date' && 'form-control form-control-solid',
              }
            )}
          />
          {type === 'password' && (
            <svg
              style={{color: isPasswordVisible ? '#0095E8' : ''}}
              onClick={handlePasswordTypeChange}
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
          )}
        </div>

        {meta.touched && meta.error && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{meta.error}</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default FormikInput
