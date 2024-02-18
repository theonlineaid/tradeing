import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageTitle} from '../../../_metronic/layout/core'
import AccountSummery from './AccountSummery'
import {AddMultiProfile} from './components/AddMultiProfile'
import {NewAccountCreate} from '../bo-account/components/NewAccountCreate'
import {Overview} from './components/Overview'
import {ProfileHeader} from './ProfileHeader'

const ProfilePage = () => {
  return (
    <div className='container py-5'>
      <Routes>
        <Route
          element={
            <>
              <ProfileHeader />
              <Outlet />
            </>
          }
        >
          <Route
            path='overview'
            element={
              <>
                <PageTitle>Overview</PageTitle>
                <Overview />
              </>
            }
          />
          <Route
            path='bo-account'
            element={
              <>
                <PageTitle>BO Account</PageTitle>
                <NewAccountCreate />
              </>
            }
          />
          <Route
            path='add-profile'
            element={
              <>
                <PageTitle>Add Another Profile</PageTitle>
                <AddMultiProfile />
              </>
            }
          />

          <Route
            path='account-summery'
            element={
              <>
                <PageTitle>Account Summery</PageTitle>
                <AccountSummery />
              </>
            }
          />
          <Route index element={<Navigate to='/profile/overview' />} />
        </Route>
      </Routes>
    </div>
  )
}

export default ProfilePage
