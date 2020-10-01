import React, { Component } from 'react';

class Lists extends Component {
	constructor(props) {
		super(props)

		this.state = {
			lists : this.props.lists,
			activeLink: ''
		}

		this.handleClick = this.handleClick.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			lists: nextProps.lists
		});
	}

	handleClick = (link) => {
		this.props.loadStory(link);

		this.setState({
			activeLink: link
		})
	}
	
	render() {
		return (
			<div className="col-md-3 scrollable px-0">
				{this.state.lists.map((item) => (
					<div className={`card list-group-item border-bottom ${this.state.activeLink === item.link ? 'active' : ''}`}>
						<div className="card-body pl-4" onClick={() => this.handleClick(item.link)}>
							<h5>{item.title}</h5>
							<p className="badge badge-info p-2">— {item.author}</p>
						</div>
					</div>
				))}
			</div>
		);
	}
}

export default Lists;