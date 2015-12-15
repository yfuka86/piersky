import React from 'react';
import Router from 'react-router';
import Loading from './components/common/loading';
import RouteAction from './actions/route';
import routes from './routes';

window.PierSky = {}

if (google) {
  google.load("visualization", "1.1", {packages:['corechart', 'line']});
  google.setOnLoadCallback(() => {
    let reactElement = document.getElementById('react_container');
    if (reactElement) {
      window.PierSky.Router = Router.run(routes, Router.HistoryLocation, (Handler, state) => {
        React.render(
          <Handler path={window.location.pathname} />,
          reactElement
        );
        RouteAction.transition(Handler, state);
      });
    }
  });
} else {

}
