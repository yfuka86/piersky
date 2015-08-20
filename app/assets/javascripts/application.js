import React from 'react';
import Router from 'react-router';
import routes from './routes';
import Loading from './components/common/loading';
import RouteActionCreators from './actions/route'


React.render(
  <Loading />,
  document.getElementById('loading_container')
);

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
  React.render(
    <Handler path={window.location.pathname} />,
    document.getElementById('react_container')
  );
  RouteActionCreators.transition(Handler, state);
});
