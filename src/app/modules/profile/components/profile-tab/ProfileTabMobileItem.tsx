import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {Link, useLocation} from 'react-router-dom'

interface Props {
  id: string
  path: string
  label: string
}

const ProfileTabMobileItem: React.FC<React.PropsWithChildren<Props>> = ({id, path, label}) => {
  const location = useLocation()
  return (
    <Dropdown.Item href={id}>
      <Link
        className={`nav-link text-active-primary me-2 ` + (location.pathname === path && 'active')}
        to={path}
      >
        {label}
      </Link>
    </Dropdown.Item>
  )
}

export default ProfileTabMobileItem
