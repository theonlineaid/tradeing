import CustomModal from '#common/components/CustomModal'
import {RootState} from '#store/index'
import {changeMode} from '#store/slices/globalSlice'
import clsx from 'clsx'
import {FC, PropsWithChildren, useEffect, useState} from 'react'
import {BsMoonStarsFill, BsSunFill} from 'react-icons/bs'
import {IoSettingsSharp} from 'react-icons/io5'
import {RiMessage2Fill} from 'react-icons/ri'
import {TfiLayoutGrid2Alt} from 'react-icons/tfi'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {Marquess} from '../../.../../../../app/modules/tws/components/Map'
import Settings from '../../../../app/modules/setting/components/Settings'
import {toAbsoluteUrl} from '../../../helpers'
import {HeaderNotificationsMenu, HeaderUserMenu, Theme} from '../../../partials'
import {useLayout} from '../../core'
import Clock from './Clock'

const toolbarButtonMarginClass = 'ms-1 ms-lg-3',
  toolbarButtonHeightClass = 'w-30px h-30px w-md-34 h-md-34',
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-34px',
  toolbarButtonIconSizeClass = 'svg-icon-1'

const Topbar: FC<PropsWithChildren> = () => {
  const dispatch = useDispatch()
  const {mode} = useSelector((state: RootState) => state.global)
  const {config, setLayout} = useLayout()

  // --modal
  const [isModalShow, setIsModalShow] = useState<boolean>(false)
  const handleSettingClose = () => setIsModalShow(false)
  const handleSettingModal = () => setIsModalShow(true)

  // --Dark mode--
  type modeType = 'dark' | 'light'
  const toggleDarkMode = (value: modeType) => {
    localStorage.setItem('mode', value)
    dispatch(changeMode(value))
  }
  useEffect(() => {
    const _mode = localStorage.getItem('mode')
    if (_mode && mode !== _mode) {
      dispatch(changeMode(_mode as modeType))
    }
  }, [])
  // <!-- dark mode close -->

  return (
    <>
      <div className='tw-flex justify-content-between align-items-stretch flex-shrink-0'>
        {/* begin::User */}

        <div
          className={clsx('tw-flex tw-items-center', toolbarButtonMarginClass)}
          id='kt_header_user_menu_toggle'
        >
          <Link to='/' className='tw-flex header-left'>
            <img
              src={toAbsoluteUrl('/media/logos/logo.jpg')}
              alt='logo'
              className='pe-4 header-logo bg-white'
            />
          </Link>
          <Marquess />
          <div className='tw-flex tw-items-center tw-bg-white tw-h-11 tw-z-30 tw-absolute tw-right-0 dark:tw-bg-dark-200'>
            {/* clock */}
            <Clock />

            <div className='tw-px-3'>
              <button className='btn custom-btn tw-px-5 dark:tw-text-slate-100 tw-bg-gradient-to-r tw-from-blue-400 tw-to-red-400 dark:tw-bg-gradient-to-r dark:tw-from-purple-900 dark:tw-to-purple-700 dark:tw-border-[#3b6d61] dark:tw-shadow-slate-500 text-white text-sm tw-p-1'>
                Save
              </button>
            </div>

            {/* Dark mode */}
            <div
              onClick={() => toggleDarkMode(mode === 'dark' ? 'light' : 'dark')}
              className='tw-cursor-pointer'
            >
              {mode === 'dark' ? (
                <BsMoonStarsFill title='Dark' className='tw-text-cyan-400 tw-text-2xl' />
              ) : (
                <BsSunFill title='Light' className='tw-text-red-500 tw-text-2xl' />
              )}
            </div>

            {/* Settings */}
            <div onClick={() => handleSettingModal()} className='tw-cursor-pointer'>
              <IoSettingsSharp
                title='Dark'
                className={`${
                  mode === 'dark' ? 'tw-text-purple-300' : 'tw-text-cyan-500'
                } tw-ml-3 tw-text-3xl`}
              />
            </div>
            <CustomModal
              handleClose={handleSettingClose}
              show={isModalShow}
              title='Settings'
              size='lg'
              footer={<></>}
            >
              <Settings />
            </CustomModal>

            {/* theme */}
            <div className={clsx('tw-flex tw-items-center', toolbarButtonMarginClass)}>
              <div
                className={`${
                  mode === 'dark' ? 'tw-text-rose-300' : 'tw-text-lime-500'
                } tw-text-2xl tw-cursor-pointer`}
                data-kt-menu-trigger='click'
                data-kt-menu-attach='parent'
                data-kt-menu-placement='bottom-end'
                data-kt-menu-flip='bottom'
              >
                <TfiLayoutGrid2Alt title='Theme' />
              </div>
              <Theme />
            </div>
            {/* notification */}
            <div className={clsx('tw-flex tw-items-center tw-mr-3', toolbarButtonMarginClass)}>
              <div
                className={`${
                  mode === 'dark' ? 'tw-text-emerald-400' : 'tw-text-purple-400'
                } tw-text-3xl tw-cursor-pointer`}
                data-kt-menu-trigger='click'
                data-kt-menu-attach='parent'
                data-kt-menu-placement='bottom-end'
                data-kt-menu-flip='bottom'
              >
                <RiMessage2Fill title='Notification' />
              </div>
              <HeaderNotificationsMenu />
            </div>
            {/* user Avatar */}
            <div
              className={clsx('cursor-pointer symbol tw-mr-3 ', toolbarUserAvatarHeightClass)}
              data-kt-menu-trigger='click'
              data-kt-menu-attach='parent'
              data-kt-menu-placement='bottom-end'
              data-kt-menu-flip='bottom'
            >
              <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt='benemoy' />
            </div>
            <HeaderUserMenu />
          </div>
          {/* end::Toggle */}
        </div>
        {/* end::User */}

        {/* begin::Aside Toggler */}
        {config.header.left === 'menu' && (
          <div
            className='tw-flex tw-items-center d-lg-none ms-2 me-n3'
            title='Show header menu'
          ></div>
        )}
      </div>
    </>
  )
}

export {Topbar}
