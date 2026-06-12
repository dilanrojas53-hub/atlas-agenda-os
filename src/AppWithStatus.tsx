import { Route, Switch } from 'wouter';
import AppWithJoin from './AppWithJoin';
import { StatusTrackingPage } from './pages/StatusTrackingPage';
import { ModernAdminPage } from './pages/admin/ModernAdminPage';
import { ModernClientPortalPage } from './pages/client/ModernClientPortalPage';
import { ModernSuperAdminPage } from './pages/superadmin/ModernSuperAdminPage';

export default function AppWithStatus() {
  return (
    <Switch>
      <Route path="/status/:id" component={StatusTrackingPage} />
      <Route path="/business/:slug" component={ModernAdminPage} />
      <Route path="/admin/:slug" component={ModernAdminPage} />
      <Route path="/app/:slug" component={ModernClientPortalPage} />
      <Route path="/atlas" component={ModernSuperAdminPage} />
      <Route component={AppWithJoin} />
    </Switch>
  );
}
