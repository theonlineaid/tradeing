import React, {useEffect, useState} from 'react'

const Clock = () => {
  const [date, setDate] = useState(new Date())
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const checkFont = (name: string) => {
    const value = document.fonts.check(name)

    setIsLoaded(value)
  }

  useEffect(() => {
    const int = setInterval(() => {
      setDate(new Date())
      if (!isLoaded) {
        checkFont('16px DS-Digital')
      }
    }, 1000)

    return () => clearInterval(int)
  }, [isLoaded])

  return (
    <div className='clock tw-text-dark-100 tw-font-semibold tw-text-center tw-bg-white tw-h-10 tw-flex tw-items-center tw-justify-center tw-px-3 dark:tw-bg-dark-200 dark:tw-text-gray-300' style={{fontSize: isLoaded ? '26px' : '22px'}}>
      <div className=' create-clock'>
        <div>{`${Number(date.getHours()) <= 9 ? '0' + date.getHours() : date.getHours()} : ${
          Number(date.getMinutes()) <= 9 ? '0' + date.getMinutes() : date.getMinutes()
        } : ${Number(date.getSeconds()) <= 9 ? '0' + date.getSeconds() : date.getSeconds()}`}</div>
      </div>
    </div>
  )
}

export default Clock
