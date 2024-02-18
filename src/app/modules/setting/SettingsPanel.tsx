import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {GeneralSettingsTab} from './components/GeneralSettingsTab'

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
        path='general'
        element={
          <>
            <GeneralSettingsTab />
          </>
        }
      />
      <Route index element={<Navigate to='/settings/general' />} />
    </Route>
  </Routes>
)

export default CreditPanel
