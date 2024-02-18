import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {NewAccountCreate} from './components/NewAccountCreate'
import {ProfileHeader} from '../profile/ProfileHeader'
import {AddressDetails} from './components/AddressDetails'
import {BankDetails} from './components/BankDetails'
import {BasicInfo} from './components/BasicInfo'
import {Finish} from './components/Finish'
import {Nominees} from './components/Nominees'
import {OtherInfo} from './components/OtherInfo'
import {Upload} from './components/Upload'

const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Account',
    path: '/profile/bo-account/input/create',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const ProfilePage = () => (
  <div className='container py-5'>
    <Routes>
      <Route
        element={
          <>
            <Outlet />
          </>
        }
      >
        <Route
          path='create'
          element={
            <>
              <PageTitle breadcrumbs={profileBreadCrumbs}>DP & BO Type Selection</PageTitle>
              <ProfileHeader />
              <NewAccountCreate />
            </>
          }
        />

        <Route
          path='basic'
          element={
            <>
              <PageTitle breadcrumbs={profileBreadCrumbs}>Basic Info</PageTitle>
              <ProfileHeader />
              <BasicInfo />
            </>
          }
        />

        <Route
          path='other-info'
          element={
            <>
              <PageTitle breadcrumbs={profileBreadCrumbs}>Other Info</PageTitle>
              <ProfileHeader />
              <OtherInfo />
            </>
          }
        />

        <Route
          path='address'
          element={
            <>
              <PageTitle breadcrumbs={profileBreadCrumbs}>Address</PageTitle>
              <ProfileHeader />
              <AddressDetails />
            </>
          }
        />

        <Route
          path='bank-details'
          element={
            <>
              <PageTitle breadcrumbs={profileBreadCrumbs}>Bank Details</PageTitle>
              <ProfileHeader />
              <BankDetails />
            </>
          }
        />

        <Route
          path='nominees'
          element={
            <>
              <PageTitle breadcrumbs={profileBreadCrumbs}>Nominees</PageTitle>
              <ProfileHeader />
              <Nominees />
            </>
          }
        />

        <Route
          path='upload'
          element={
            <>
              <PageTitle breadcrumbs={profileBreadCrumbs}>Upload</PageTitle>
              <ProfileHeader />
              <Upload />
            </>
          }
        />

        <Route
          path='finish'
          element={
            <>
              <PageTitle breadcrumbs={profileBreadCrumbs}>Finish</PageTitle>
              <ProfileHeader />
              <Finish />
            </>
          }
        />

        <Route index element={<Navigate to='/profile/bo-account/input/create' />} />
      </Route>
    </Routes>
  </div>
)

export default ProfilePage
