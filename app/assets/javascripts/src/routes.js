import React from 'react';
import {Route, DefaultRoute, NotFound} from 'react-router';
import App from './components/app';
import IntegrationsBoard from './components/integrations/integrations_board';
import IntegrationsIndex from './components/integrations/integrations_index';
import IntegrationsNew from './components/integrations/integrations_new';
import IntegrationsShow from './components/integrations/integrations_show';
import UsersBoard from './components/users/users_board';
import UsersIndex from './components/users/users_index';
import UsersShow from './components/users/users_show';

let routes = (
  <Route>
    <Route name='app' handler={App} path="/webapp">
      <Route name='integrations' handler={IntegrationsBoard} path='integrations'>
        <DefaultRoute handler={IntegrationsIndex} />
        <Route name='integrations-new' handler={IntegrationsNew} path='new' />
        <Route name='integrations-show' handler={IntegrationsShow} path=':id' />
      </Route>
      <Route name='users' handler={UsersBoard} path='users'>
        <DefaultRoute handler={UsersIndex} />
        <Route name='users-show' handler={UsersShow} path=':id' />
      </Route>
    </Route>
  </Route>
);

export default routes;