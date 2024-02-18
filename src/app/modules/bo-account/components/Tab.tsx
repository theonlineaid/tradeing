import {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {getBoAllInfo} from '../../auth/core/_requests'

interface Props {
  isActiveSection: boolean
  path: string
  serialNo: number
  label: string
}

const Tab: React.FC<React.PropsWithChildren<Props>> = ({
  isActiveSection,
  path,
  serialNo,
  label,
}) => {
  const location = useLocation()
  const pathnameArray = location.pathname.split('/')

  return (
    <Link to={isActiveSection ? '/bo-account/input/' + path : '#'} className='bo-acc-step'>
      <div className='bo-step-border'></div>
      <div
        className={
          pathnameArray[pathnameArray.length - 1] === path
            ? 'bd-highlight bo-step currentTab'
            : 'bd-highlight bo-step activeTab'
        }
      >
        <div className='step-line'></div>
        <h5 className='step-number'>{serialNo}</h5>
        <p className={isActiveSection ? 'step-label' : 'step-label-disable'}>{label}</p>
      </div>
    </Link>
  )
}

export default Tab
