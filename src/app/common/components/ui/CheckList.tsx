import {ColDef} from 'ag-grid-community'
import React from 'react'

interface CheckData extends ColDef {
  id: number
}
interface Props {
  check: CheckData
  handleCheckData: (event: any, value: number) => void
}

const CheckList: React.FC<React.PropsWithChildren<Props>> = ({check, handleCheckData}) => {
  return (
    <li className='form-check form-check-custom form-check-solid'>
      <input
        className='form-check-input checked:tw-bg-slate-400 dark:tw-bg-slate-700 focus:tw-bg-slate-400 tw-border-solid tw-border-1 checked:tw-border-none tw-border-gray-300 dark:tw-border-gray-600 tw-rounded'
        type='checkbox'
        name={check.field}
        id={check.field}
        defaultChecked={!check.hide}
        onClick={(e) => handleCheckData(e, check.id)}
      />
      <label className='form-check-label dark:tw-text-slate-100' htmlFor={check.field}>
        {check.headerName}
      </label>
    </li>
  )
}

export default CheckList
