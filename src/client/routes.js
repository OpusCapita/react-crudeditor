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

export default () => (
  <Router>
    <Switch>
      <Redirect exact={true} from="/" to="/home" />
      <Route exact={true} path="/home" component={Home} />
      <Route path="/crud/:entities" component={CrudWrapper} />
      <Route path="/revisions/:entityId" component={Revisions} />
    </Switch>
  </Router>
);
