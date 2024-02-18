/* eslint-disable react-hooks/rules-of-hooks */
import {useEffect, useState} from 'react'
import {getBoAllInfo} from '../../auth/core/_requests'
import Tab from './Tab'

export default function Tabs({trackId = ''}) {
  const [boAllInfo, setBoAllInfo] = useState({})
  const [boTrackId, setBoTrackId] = useState<string>('')

  const CONFIG_TABS = [
    {id: 'bo_account', label: 'DP & BO type', path: 'create', sectionTag: 'Bo_create__type'},
    {id: 'holder_details', label: 'Basic Info', path: 'basic', sectionTag: 'Bo_create__basicInfo'},
    {id: 'bo_address', label: 'Address', path: 'address', sectionTag: 'Bo_create__Address'},
    {
      id: 'bo_bank_details',
      label: 'Bank Details',
      path: 'bank-details',
      sectionTag: 'Bo_create__BankInfo',
    },
    {id: 'noninee', label: 'Nominees', path: 'nominees', sectionTag: 'Bo_create__Nominee'},
    {id: 'preview', label: 'Finish', path: 'finish', sectionTag: 'Bo_create__finish'},
  ]

  const fetchData = async (track_id: string) => {
    const response = await getBoAllInfo(track_id)
    if (response.data.status >= 200 && response.data.status < 300) {
      setBoAllInfo(response.data?.data)
    }
  }

  const checkIsEmpty = (value: any) => {
    if (!value) return true
    if (!(value instanceof Array)) {
      // Object
      return Object.keys(value).length === 0
    } else {
      return value.length === 0
    }
  }

  useEffect(() => {
    let track_id = localStorage.getItem('bo_track_id')
    if (!track_id) {
      setBoTrackId('')
      return
    }
    setBoTrackId(track_id)
    fetchData(track_id)
  }, [trackId])

  return (
    <div className='mb-3'>
      <div className='new-account'>
        <h5 className='new-account-head text-primary px-10'>New BO Account</h5>
        <div className='bo_acc-step-container border-top'>
          {CONFIG_TABS &&
            CONFIG_TABS.map((tab, i) => (
              <Tab
                key={tab.path}
                isActiveSection={
                  tab.path === 'create' ||
                  !checkIsEmpty(boAllInfo[tab.id]) ||
                  !checkIsEmpty(boAllInfo[CONFIG_TABS[i - 1]?.id])
                }
                label={tab.label}
                path={tab.path}
                serialNo={i + 1}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
