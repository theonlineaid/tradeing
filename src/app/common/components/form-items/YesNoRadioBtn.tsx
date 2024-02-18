import React from 'react'
import Lottie from 'react-lottie'

import * as crossAnimation from '../../../assets/animations/93785-cross.json'
import * as tickAnimation from '../../../assets/animations/94091-tick.json'

interface Props {
  formik: any
  label: string
  name: string
  options: {value: string | number; label: string}[]
  isRequired?: boolean
}

const YesNoRadioBtn: React.FC<React.PropsWithChildren<Props>> = ({
  formik,
  label,
  name,
  options,
  isRequired = true,
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  return (
    <>
      <p className={`form-label fw-bolder ${isRequired ? 'required' : ''} fs-6`}>{label}</p>
      <div className='d-flex '>
        {options &&
          options.map((option) => (
            <div
              className='d-flex align-items-center gap-x-2 fs-4 px-2 py-1 border rounded cursor-pointer'
              key={option.value}
            >
              <input
                type='radio'
                name={name}
                id={`${name}-${option.value}`}
                value={option.value}
                className='d-none'
                {...formik.getFieldProps(name)}
              />
              <label htmlFor={`${name}-${option.value}`}>
                <div className='d-flex align-items-center gap-2'>
                  <Lottie
                    options={{
                      ...defaultOptions,
                      animationData:
                        option.value === 'yes'
                          ? (tickAnimation as any)?.default
                          : (crossAnimation as any)?.default,
                      isStopped: formik.getFieldProps(name).value !== option.value,
                    }}
                    height={32}
                    width={32}
                  />
                  <span>{option.label}</span>
                </div>
              </label>
            </div>
          ))}
      </div>
    </>
  )
}

export default YesNoRadioBtn
