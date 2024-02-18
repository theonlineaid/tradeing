/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from 'axios'
import {FC, PropsWithChildren} from 'react'
import {useCookies} from 'react-cookie'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {useAuth} from '../../../../app/modules/auth'
import {toAbsoluteUrl} from '../../../helpers'
import {logoutUser} from '../../../../app/redux/slices/loginState'
import type {RootState} from '../../../../app/redux'

const HeaderUserMenu: FC<PropsWithChildren> = () => {
  const dispatch = useDispatch()
  const {logout} = useAuth()
  const removeCookie: any = useCookies(['Authorization'])[2]

  const userData = useSelector((state: RootState) => state.userData)

  const cookesRemove = async () => {
    dispatch(logoutUser(false))
    axios.defaults.headers.common['Authorization'] = ''
    removeCookie('Authorization', {path: '/'})
  }

  const newBoAcc = async (e: any) => {
    localStorage.removeItem('bo_track_id')
  }

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-3 fs-6 w-275px dark:tw-bg-dark-200'
      data-kt-menu='true'
      data-dev=''
    >
      <div className='menu-item  px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <Link className='symbol symbol-50px me-5' to={'/profile/overview'}>
            <img alt='Logo' src={toAbsoluteUrl('/media/avatars/300-1.jpg')} />
          </Link>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5 dark:tw-text-slate-200'>
              {userData?.profile?.username}
              <span className='badge badge-success fw-bolder fs-8 px-2 py-1 ms-2'>Pro</span>
            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {userData?.profile?.email}
            </a>
          </div>
        </div>
      </div>

      <div className='separator tw-border-b dark:tw-border-b-slate-700 my-2'></div>

      <div className='menu-item px-3'>
        <Link to={'/profile/overview'} className='menu-link px-3 dark:hover:tw-bg-dark-400 dark:hover:tw-text-purple-500'>
          Login As {userData?.profile?.username}
        </Link>
      </div>
      <div className='menu-item px-3'>
        <Link
          to={'/bo-account/input/create'}
          className='menu-link px-3 dark:hover:tw-bg-dark-400 dark:hover:tw-text-purple-500'
          onClick={(e) => newBoAcc(e)}
        >
          Need a BO Account?
        </Link>
      </div>

      <div className='menu-item px-3'>
        <Link to={'/profile/overview'} className='menu-link px-3 dark:hover:tw-bg-dark-400 dark:hover:tw-text-purple-500'>
          My Profile
        </Link>
      </div>

      <div className='separator tw-border-b dark:tw-border-b-slate-700 my-2'></div>

      <div className='menu-item px-3 my-1'>
        <Link to='#' className='menu-link px-3 dark:hover:tw-bg-dark-400 dark:hover:tw-text-purple-500'>
          Account Settings
        </Link>
      </div>

      <div className='menu-item px-3'>
        <a
          onClick={() => {
            cookesRemove()
            logout()
          }}
          className='menu-link px-3 dark:hover:tw-bg-dark-400 dark:hover:tw-text-purple-500'
        >
          Sign Out
        </a>
      </div>
    </div>
  )
}

export {HeaderUserMenu}
