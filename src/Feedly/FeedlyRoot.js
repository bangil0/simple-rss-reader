import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

import News from './News'
import Login from '../Login'
import img from '../icon.png'

const routes = [
    {
        path: "/News",
        component: News
    },
    {
        path: "/Login",
        component: Login
    }
];

function RouteWithSubRoutes(route) {
	return (
		<Route
			path={route.path}
			render={props => (
				<route.component {...props} routes={route.routes} />
			)}
		/>
	);
}

class FeedlyRoot extends Component {
	render() {
		return (
			<Router>
				<div className="row">
					<div className="col-md-12 no-padding-right no-padding-left border-bottom">
						<div className="btn-toolbar toolbar-padding" role="toolbar" aria-label="Button Toolbar">
							<div className="btn-group mr-2" role="group" id="button-group">
								<NavLink to="/News" className="btn btn-outline-primary btn-sm" id="newsButton" activeClassName="active">
								<i className="fa fa-newspaper-o"></i> Feeds
								</NavLink>
								<NavLink to="/Login" className="btn btn-outline-primary btn-sm" id="settingButton" activeClassName="active">
								<i className="fa fa-wrench"></i>
								</NavLink>
							</div>
						</div>
					</div>
				</div>
	
				{ routes.map((route, i) => (
					<RouteWithSubRoutes key={i} {...route} />
				))}
	
				<div className="row">
					<div className="col-md-12" style={{ height: '100vh' }}>
						<img src={img} alt="Logo" className="working-center-image" style={{ height: '512px', width: '512px' }}/>
					</div>
				</div>
			</Router>
	
		);
	}	
}

export default FeedlyRoot