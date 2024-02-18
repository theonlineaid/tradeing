import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import ProfileTabs from './components/profile-tab'
import Dropdown from 'react-bootstrap/Dropdown'
import type {RootState} from '../../redux'
import {FaCaretDown} from 'react-icons/fa'
import {useSelector} from 'react-redux'
import CustomUI from '../../common/components/ui'

const ProfileHeader: React.FC<React.PropsWithChildren> = () => {
  const {profileTabs, userData} = useSelector((state: RootState) => state)

  return (
    <div className='card mb-2 mb-xl-3'>
      <div className='card-body pt-6 pb-0 px-6'>
        <div className='d-flex flex-wrap flex-sm-nowrap align-items-center'>
          <div className='me-7 mb-4'>
            <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative'>
              <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt='Profile' />
              <div className='position-absolute translate-middle bottom-0 start-100 mb-1 bg-success rounded-circle border border-4 border-white h-20px w-20px'></div>
            </div>
          </div>

          <div className='flex-grow-1'>
            <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
              <div className='d-flex flex-column'>
                <div className='d-flex align-items-center mb-2'>
                  <a href='#' className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
                    {userData?.profile?.username
                      ? userData.profile.username
                      : userData.profile?.email.split('@')[0]}
                  </a>
                  <a href='#'>
                    <KTSVG
                      path='/media/icons/duotune/general/gen026.svg'
                      className='svg-icon-1 svg-icon-primary'
                    />
                  </a>
                </div>

                <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                  <CustomUI.IconText
                    path='/media/icons/duotune/communication/com006.svg'
                    text='Developer'
                  />
                  <CustomUI.IconText
                    path='/media/icons/duotune/general/gen018.svg'
                    text={userData.profile?.address ?? ''}
                  />
                  <CustomUI.IconText
                    path='/media/icons/duotune/communication/com011.svg'
                    text={userData?.profile?.email ?? ''}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Dropdown className='user_account mb-5'>
          <Dropdown.Toggle id='dropdown-basic'>
            <FaCaretDown />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {profileTabs.data.length > 0 &&
              profileTabs.data.map((item) =>
                item.isVisibleInMobile ? (
                  <ProfileTabs.MobileItem
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    path={item.path}
                  />
                ) : null
              )}
          </Dropdown.Menu>
        </Dropdown>
        <div className='d-flex overflow-auto h-50px mb-3 profile-tab user_account2'>
          <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
            {profileTabs.data.length > 0 &&
              profileTabs.data.map((item) => (
                <ProfileTabs.Item key={item.id} label={item.label} path={item.path} />
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export {ProfileHeader}
