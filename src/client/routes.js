import React from 'react';
import Home from './components/Home';
import CrudWrapper from './components/CrudWrapper';
import Revisions from './components/Revisions';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

const baseUrl = __WEBPACK__BASE_URL
console.log("dir: " + baseUrl);

export default () => (
  <Router>
    <Switch>
      <Redirect exact={true} from={baseUrl + "/"} to={baseUrl + "/home"} />
      <Route exact={true} path={baseUrl + "/home"} component={Home} />
      <Route path={baseUrl + "/crud/:entities"} component={CrudWrapper} />
      <Route path={baseUrl + "/revisions/:entityId"} component={Revisions} />
    </Switch>
  </Router>
);
