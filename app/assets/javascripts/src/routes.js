import React from 'react';
import {Route, DefaultRoute, NotFound, Redirect} from 'react-router';
import App from './components/app';
import Home from './components/home';
import IntegrationsBoard from './components/integrations/integrations_board';
import IntegrationsIndex from './components/integrations/integrations_index';
import IntegrationsNew from './components/integrations/integrations_new';
import IntegrationShow from './components/integrations/integration_show';
import IntegrationStatistics from './components/integrations/integration_statistics';
import IntegrationSettings from './components/integrations/integration_settings';
import UsersBoard from './components/users/users_board';
import UsersIndex from './components/users/users_index';
import UserShow from './components/users/user_show';
import UserStatistics from './components/users/user_statistics';
import UserProfile from './components/users/user_profile';
import InvitationsPage from './components/invitations/invitations_page';
import InvitationsIndex from './components/invitations/invitations_index';
import InvitationsNew from './components/invitations/invitations_new';

let routes = (
  <Route>
    <Route name='app' handler={App} path="/webapp">
      <DefaultRoute handler={Home} />
      <Route name='home' handler={Home} path='home' />

      <Route name='integrations' handler={IntegrationsBoard} path='integrations'>
        <DefaultRoute handler={IntegrationsIndex} />
        <Route name='integrations-index' handler={IntegrationsIndex} path='index' />
        <Route name='integrations-new' handler={IntegrationsNew} path='new' />
        <Redirect from=":id" to="integration-statistics" />
        <Route name='integration-show' handler={IntegrationShow} path=':id'>
          <DefaultRoute handler={IntegrationStatistics} />
          <Route name='integration-statistics' handler={IntegrationStatistics} path='statistics' />
          <Route name='integration-settings' handler={IntegrationSettings} path='settings' />
        </Route>
      </Route>

      <Route name='users' handler={UsersBoard} path='users'>
        <DefaultRoute handler={UsersIndex} />
        <Route name='users-index' handler={UsersIndex} path='index' />
        <Route name='invitations' handler={InvitationsPage} path='invitations'>
          <DefaultRoute handler={InvitationsIndex} />
          <Route name='invitations-new' handler={InvitationsNew} path='new' />
        </Route>
        <Redirect from=":id" to="user-statistics" />
        <Route name='user-show' handler={UserShow} path=':id' >
          <DefaultRoute handler={UserStatistics} />
          <Route name='user-statistics' handler={UserStatistics} path='statistics' />
          <Route name='user-profile' handler={UserProfile} path='profile' />
        </Route>
      </Route>

    </Route>
  </Route>
);

export default routes;