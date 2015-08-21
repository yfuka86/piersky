import React from 'react';
import {Route, DefaultRoute, NotFound} from 'react-router';
import App from './components/app';

let routes = (
  <Route>
    <Route handler={App} path="/">
    </Route>
  </Route>
);

export default routes;