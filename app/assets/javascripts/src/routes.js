import React from 'react';
import {Route, DefaultRoute, NotFound} from 'react-router';
import App from './components/app';
import Home from './components/home';
import IntegrationsBoard from './components/integrations/integrations_board';
import IntegrationsIndex from './components/integrations/integrations_index';
import IntegrationsNew from './components/integrations/integrations_new';
import IntegrationsShow from './components/integrations/integrations_show';
import IntegrationsSetting from './components/integrations/integrations_setting';
import UsersBoard from './components/users/users_board';
import UsersIndex from './components/users/users_index';
import UsersShow from './components/users/users_show';
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
        <Route name='integrations-show' path=':id'>
          <DefaultRoute handler={IntegrationsShow} />
          <Route name='integration-setting' handler={IntegrationsSetting} path='setting' />
        </Route>
      </Route>
      <Route name='users' handler={UsersBoard} path='users'>
        <DefaultRoute handler={UsersIndex} />
        <Route name='users-index' handler={UsersIndex} path='index' />
        <Route name='invitations' handler={InvitationsPage} path='invitations'>
          <DefaultRoute handler={InvitationsIndex} />
          <Route name='invitations-new' handler={InvitationsNew} path='new' />
        </Route>
        <Route name='users-show' handler={UsersShow} path=':id' />
      </Route>
    </Route>
  </Route>
);

export default routes;