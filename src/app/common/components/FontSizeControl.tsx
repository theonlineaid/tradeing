import {RootState} from '#store/index'
import {fontSizeDecrement, fontSizeIncrement} from '#store/slices/settings'
import {BsDashLg, BsPlusLg} from 'react-icons/bs'
import {useDispatch, useSelector} from 'react-redux'

const FontSizeControl = ({tableName}) => {
  // Dispatch
  const dispatch = useDispatch()

  // Get the settings from the redux state
  const {settings} = useSelector((state: RootState) => state)

  // increment font size
  const increment = () => {
    dispatch(fontSizeIncrement({fontSize: 1, tableName}))
  }

  // decrement font size
  const decrement = () => {
    dispatch(fontSizeDecrement({fontSize: 1, tableName}))
  }

  // get the font size
  const fontSize = settings.tableSettings.find((t) => t.tableName === tableName)?.fontSize

  return (
    <div className='clss'>
      <h2 className='tw-block tw-w-52 mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white'>
        Font Size Controll
      </h2>
      <div className='tw-flex tw-items-center tw-gap-5'>
        <button
          type='button'
          className='custom-btn 
           dropdown-toggle btn btn-primary tw-text-white'
          onClick={decrement}
        >
          <BsDashLg />
        </button>
        <span>Font Size ({fontSize}px)</span>
        <button
          type='button'
          className='custom-btn 
           dropdown-toggle btn btn-primary tw-text-white'
          onClick={increment}
        >
          <BsPlusLg />
        </button>
      </div>
    </div>
  )
}

export default FontSizeControl
