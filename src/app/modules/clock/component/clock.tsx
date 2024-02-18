import {useEffect, useState} from 'react'
import {Number} from './Number'
import {Word} from './Word'

export const Clock = ({h24 = true}) => {
  const [hour, setHour] = useState(0)
  const [minute, setMinute] = useState(0)
  const [second, setSecond] = useState(0)

  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const update = () => {
    const date = new Date()
    let hour = date.getHours()
    if (!h24) {
      hour = hour % 12 || 12
    }
    setHour(hour)
    setMinute(date.getMinutes())
    setSecond(date.getSeconds())
  }

  useEffect(() => {
    update()
    const checkFont = document.fonts.check('16px DS-Digital')
    console.warn({checkFont})

    setIsLoaded(checkFont)

    const interval = setInterval(() => {
      update()
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!isLoaded) {
    return null
  }

  return (
    <div className='hour'>
      time
      <Number value={hour} />
      <Word value={':'} />
      <Number value={minute} />
      <Word value={':'} />
      <Number value={second} />
    </div>
  )
}
