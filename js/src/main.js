import $ from 'jquery'
import cookie from 'cookies-js'
import {} from './druhy.js'
import React from 'react'
import ReactDOM from 'react-dom'
require('fullcalendar')
import {} from 'qtip2'

// $.ajax({
//   type: "post",
//   url: "/api/groups/",
//   headers: {
//         "X-CSRFToken":cookie.get('csrftoken'),
//         "Content-Type":"application/json",
//     },
//   data: JSON.stringify({"title": "TEST"}),
// });


class Calendar extends React.Component{


	componentDidMount(){
		const {calendar} = this.refs;
		$(calendar).fullCalendar({
			lang: 'sk',
			header: {
				left: 'prev,next',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
		    events: (start, end, timezone, callback) => {
				$.getJSON({url:"/api/events/?organized_bys=2,3", success: function(result){
					for (let i=0;i<result.length;i++){
						result[i]['color']='red';
					}
					callback(result);
				}})
			}
		}).qtip({
             content: {
             	text:'<a href="link"> asa</a>'
             }
         });
		this.intervalId=setInterval(function(){$(calendar).fullCalendar('refetchEvents')}, 10000);
	}
	componentWillUnmount(){
		const {calendar} = this.refs;
		clearInterval(this.intervalId)
		$(calendar).fullCalendar('destroy');
	}

	render(){
		const {calendar} = this.refs;
		$(calendar).fullCalendar('refetchEvents')
		return(
			<div ref="calendar"></div>
		);
	}
}

function mapEvents(events){
		let resEvents=[]
		for(let i=0;i<events.length;i++){
			resEvents.push({title:events[i].title,start:Date.now(),end:Date.now()})
		}
		return resEvents
}

class Group extends React.Component{

	render(){
		var checked=(this.props.value ? "checked" : "");
	    return (
	      <li className="group">
	         <input type="checkbox" name="group" value={this.props.data} onChange={this.props.onChange} checked={checked} />{this.props.title} <br />
	      </li>
	    );
	}

}

class GroupList extends React.Component{

	render(){
		console.log(this.props)
	    var groups = this.props.data.map(function(group) {
	    	console.log("AAA"+this.props)
	      return (
	        <Group title={group.title} key={group.id} data={group.id} value={group.value} onChange={(e)=>this.props.groupChanged(group.id,e.target.value)}/>
	      )
	    }.bind(this))
	    return (
	      <ul className="groupList">
			{groups} 
	      </ul>
	    );
	}

}


class App extends React.Component{

	state={groups:[]}

	makeQuery(){
		let q="/api/events/?"
		let groupquery=""
		for(let i =0;i<this.state.groups.length;i++){
			if(this.state.groups[i]['value']){
				groupquery=groupquery+this.state.groups[i]['value']+","
			}
		}
		if(groupquery!=""){
			q=q+"organizator="+groupquery
		}
		console.log(q)
		return q
	}

	groupChanged(id,val){
		this.setState({})
		console.log(this.state)
		makeQuery()
		update()
	}

	initialLoadGroupsFromServer(){
		 $.ajax({
		      url: "/api/groups/",
		      dataType: 'json',
		      cache: false,
		      success: function(data) {
		      	for(let i=0;i<data.length;i++){
		      		data[i]['value']=true
		      	}
		        this.setState({groups: data});
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error("/api/groups/", status, err.toString());
		      }.bind(this)
    	});
		console.log(this.state.groups)
    }	

	componentDidMount(){
		this.initialLoadGroupsFromServer();
	}

	render(){
		return(
			<div>
				<h1> Hello </h1>
				<GroupList data={this.state.groups} groupChanged={this.groupChanged} />
				<Calendar pollInterval={2000}/>
			</div>
		);
	}
}

ReactDOM.render(<App/>, document.getElementById('app'))

