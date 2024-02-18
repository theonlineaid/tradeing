import React, {useState} from 'react'

interface Props {
  subject?: string
  message: string
}

const MyAlert: React.FC<Props> = ({subject, message}) => {
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(true)

  const handleVisibility = () => {
    setIsAlertVisible((prevState) => !prevState)
  }

  if (!isAlertVisible) return null
  return (
    <div
      className='tw-bg-red-100 tw-border tw-border-red-400 tw-text-red-700 tw-max-w-[75%] tw-px-4 tw-py-3 tw-my-3  tw-mx-auto tw-rounded tw-relative'
      role='alert'
    >
      {subject && <strong className='tw-font-bold'>{subject} : </strong>}
      <span className='tw-block sm:tw-inline'>{message}</span>
      <span
        className='tw-absolute tw-top-0 tw-bottom-0 tw-right-0 tw-px-4 tw-py-3'
        onClick={handleVisibility}
      >
        <svg
          className='tw-fill-current tw-h-6 tw-w-6 tw-text-red-500'
          role='button'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
        >
          <title>Close</title>
          <path d='M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z' />
        </svg>
      </span>
    </div>
  )
}

export default MyAlert
