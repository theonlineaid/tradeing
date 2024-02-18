import {useDispatch, useSelector} from 'react-redux'
import CustomUI from '../../../common/components/ui'
import type {RootState} from '../../../redux'
import {updateUserProfile} from '../../../redux/slices/userData'
import {updateUserData} from '../../auth/core/_requests'

export function Overview(this: any) {
  const dispatch = useDispatch()
  const userData = useSelector((state: RootState) => state.userData)

  const handleUpdateData = async (updatedData: {[key: string]: string}) => {
    const profileUpdateResult = await updateUserData({
      ...updatedData,
    })
    if (profileUpdateResult.status === 200) {
      dispatch(updateUserProfile(updatedData))
    }
  }

  const profileOverview = [
    {
      label: 'Username',
      value: userData.profile?.username,
      key: 'username',
      isDisableEdit: false,
    },
    {
      label: 'Address',
      value: userData?.profile?.address,
      key: 'address',
      isDisableEdit: false,
    },
    {
      label: 'Contact Phone',
      value: userData?.profile?.phone,
      key: 'phone',
      isDisableEdit: false,
    },
    {
      label: 'Email',
      value: userData?.profile?.email,
      key: 'email',
      isDisableEdit: true,
    },
    {
      label: 'Date of Birth',
      value: userData?.profile?.dob,
      key: 'dob',
      isDisableEdit: false,
    },
    {
      label: 'Country',
      value: userData?.profile?.country,
      key: 'country',
      isDisableEdit: false,
    },
  ]

  return (
    <>
      <div className='card mb-5 mb-xl-10 ' id='kt_profile_details_view'>
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0 px-7'>Profile Details </div>
        </div>

        <div className='card-body profile over_view_wrapper p-9'>
          {profileOverview &&
            profileOverview.map((item) => (
              <CustomUI.DataWithEdit
                key={item.key}
                name={item.key}
                label={item.label}
                value={item.value}
                handleUpdateData={handleUpdateData}
                isDisableEdit={item.isDisableEdit}
              />
            ))}
        </div>
      </div>
    </>
  )
}
