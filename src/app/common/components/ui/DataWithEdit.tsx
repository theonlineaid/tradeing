import React, {useState} from 'react'
import {Tooltip} from 'react-hover-tooltip'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import MyTooltip from './MyTooltip'

const DataWithEdit = ({label, name, value, handleUpdateData, isDisableEdit}) => {
  const [isEditEnable, setIsEditEnable] = useState(false)
  const [inputData, setInputData] = useState<string>('')

  const handleChange = (e) => {
    setInputData(e.target.value)
  }

  const onSaveData = () => {
    setIsEditEnable(false)
    handleUpdateData({
      [name]: inputData,
    })
  }

  return (
    <div className='row d-flex align-items-center mb-5'>
      <label className='col-sm-4 fw-bolder text-muted'>{label}</label>

      <div className='col-md-6 col-sm-7'>
        <span id='editProfile' className='profile-data fw-bolder fs-6'>
          {!isEditEnable ? (
            <div>{value}</div>
          ) : (
            <input
              type='text'
              name={name}
              className='form-control form-control-solid'
              defaultValue={value}
              onChange={handleChange}
            />
          )}
        </span>
      </div>
      {!isDisableEdit && (
        <div className='col-md-2 col-sm-1'>
          {!isEditEnable ? (
            <MyTooltip id='edit-data' content='Edit'>
              <img
                className='profile-edit'
                src={toAbsoluteUrl('/media/icons/edit.png')}
                alt='Edit'
                onClick={() => setIsEditEnable(true)}
              />
            </MyTooltip>
          ) : (
            <div>
              <MyTooltip id='save-data' content='Save'>
                <img
                  className='profile-edit'
                  src={toAbsoluteUrl('/media/icons/save.png')}
                  alt='Profile'
                  onClick={onSaveData}
                />
              </MyTooltip>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DataWithEdit
