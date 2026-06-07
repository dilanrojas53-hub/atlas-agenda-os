import { Route, Switch } from 'wouter';
import AppWithJoin from './AppWithJoin';
import { StatusTrackingPage } from './pages/StatusTrackingPage';

export default function AppWithStatus() {
  return (
    <Switch>
      <Route path="/status/:id" component={StatusTrackingPage} />
      <Route component={AppWithJoin} />
    </Switch>
  );
}
