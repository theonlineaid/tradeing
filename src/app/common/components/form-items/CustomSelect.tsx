import React from 'react'

interface Props {
  handleChange: (e) => void

  options:
    | {
        label: string
        value: string | number | readonly string[] | undefined
      }[]
    | []
  name: string
}

const CustomSelect: React.FC<React.PropsWithChildren<Props>> = ({handleChange, options, name}) => {
  return (
    <select className='form-select w-125px' onChange={handleChange} name={name}>
      <option value=''>All</option>
      {options &&
        options.map((item, index) => (
          <option key={String(item.value) + '-' + index} value={item.value}>
            {item?.label}
          </option>
        ))}
    </select>
  )
}

export default CustomSelect
