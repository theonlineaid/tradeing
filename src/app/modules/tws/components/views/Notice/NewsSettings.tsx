import FontSizeControl from '#common/components/FontSizeControl'
import {useState} from 'react'
import ReactDatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

const NewsSettings = ({checkData, handleCheckData, tableName}) => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  return (
    <div className='tw-flex tw-flex-col tw-gap-5'>
      <div className='d-flex gap-3'>
        <div className='tw-w-1/2 d-flex flex-column'>
          <span className='tw-block tw-w-full mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white'>
            Start Date
          </span>
          <ReactDatePicker
            selected={startDate}
            onChange={(date: any) => setStartDate(date)}
            isClearable
            className='tw-w-full border p-1 rounded'
            placeholderText='star date'
          />
        </div>
        <div className='tw-w-1/2 d-flex flex-column'>
          <span className='tw-block tw-w-full mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white'>
            Start Date
          </span>
          <ReactDatePicker
            selected={endDate}
            onChange={(date: any) => setEndDate(date)}
            isClearable
            className='tw-w-full border p-1 rounded'
            placeholderText='end date'
          />
        </div>
      </div>

      {/* font size */}
      <FontSizeControl tableName={tableName} />
    </div>
  )
}

export default NewsSettings
