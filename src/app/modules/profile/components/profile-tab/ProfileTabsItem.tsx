import React from 'react'
import {Link, useLocation} from 'react-router-dom'

interface Props {
  path: string
  label: string
}

const ProfileTabsItem: React.FC<React.PropsWithChildren<Props>> = ({path, label}) => {
  const location = useLocation()

  return (
    <li className='nav-item'>
      <Link
        className={`nav-link text-active-primary  ` + (location.pathname === path && 'active')}
        to={path}
      >
        {label}
      </Link>
    </li>
  )
}

export default ProfileTabsItem
