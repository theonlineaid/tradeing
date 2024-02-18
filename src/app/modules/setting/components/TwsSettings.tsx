import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {updateDashboardSetting} from '../../../redux/slices/settings'
import type {RootState} from '../../../redux'

export function TwsSettings() {
  const settings = useSelector((state: RootState) => state.settings)
  const dispatch = useDispatch()
  const [data, setData] = useState<any>(settings.dashboard)
  const [visible, setVisible] = useState<any>(settings.dashboard)

  const toggleDialog = (e: any, fieldName = '', checkedValue = false) => {
    let FieldName_ = fieldName
    let checkedV = checkedValue

    if (FieldName_) {
      setVisible({...visible, [FieldName_]: checkedV})
    } else {
      setVisible({...visible, [e.target.name]: e.target.checked})
    }
  }

  useEffect(() => {
    dispatch(updateDashboardSetting(data))
  }, [data, dispatch])

  const keyToTitle = (text: string) => {
    const words = text.split('_')
    return words.map((w) => w[0].toUpperCase() + w.substring(1)).join(' ')
  }

  return (
    <>
      <div className='card-body'>
        <div className='trade-tws mb-4'>
          <ul className='settings-tws-list px-4'>
            {Object.keys(settings.dashboard).map((option) => (
              <li className='form-check form-check-custom form-check-solid'>
                <input
                  key={option}
                  className='form-check-input'
                  type='checkbox'
                  name={option}
                  defaultChecked={settings.dashboard[option]}
                  onClick={() => {
                    setData({...settings.dashboard, option: !settings.dashboard[option]})
                  }}
                />
                <label className='form-check-label'>{keyToTitle(option)}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
