import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core' 
import {List} from './components/List'
const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Credit',
    path: '/order/buy',
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

const CreditPanel = () => (
  <Routes>
    <Route
      element={
        <>
          <Outlet />
        </>
      }
    >
      <Route
        path='list'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}> Credit </PageTitle>
            <List />
          </>
        }
      />

      <Route index element={<Navigate to='/share-price/list' />} />
    </Route>
  </Routes>
)

export default CreditPanel
