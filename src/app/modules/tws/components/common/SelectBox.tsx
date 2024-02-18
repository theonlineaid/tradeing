import { RootState } from '#store/index'
import { useDispatch, useSelector } from 'react-redux'
interface Props {
  layout?: any
  externalFilterChanged?: any
  label?: string
  name?: string
  option?: Array<any>
}

const SelectBox: React.FC<React.PropsWithChildren<Props>> = ({
  layout,
  externalFilterChanged,
  label,
  name,
  option
}) => {
  // States


  const dispatch = useDispatch()
  const { linkedTable, buySell} = useSelector((state: RootState) => state)

  return (
    <div className="tw-inline-block tw-mr-2 tw-w-48">
        <label id="filter" className="tw-block tw-w-full mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white">{label}</label>
        <select onChange={(e) => externalFilterChanged(e)} name={name} id="filter" className="tw-inline tw-mr-4 tw-w-full tw-p-2 tw-mb-6 tw-text-sm tw-text-gray-900 tw-border tw-border-gray-300 tw-rounded-lg tw-bg-gray-50 focus:tw-ring-blue-500 focus:tw-border-blue-500 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-placeholder-gray-400 dark:tw-text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500">
            {option?.map(item => (
                <option value={item?.value} >{item?.label}</option>
            ))}
        </select>
    </div>
  )
}

export default SelectBox
