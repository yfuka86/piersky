import React from 'react';
import Router from 'react-router';
import Loading from './components/common/loading';
import RouteAction from './actions/route'

import routes from './routes';

window.PierSky = {}
window.PierSky.Router = Router;

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
  React.render(
    <Handler path={window.location.pathname} />,
    document.getElementById('react_container')
  );
  RouteAction.transition(Handler, state);
});
