window.$ = window.jQuery = require('jquery');
import cookie from 'cookies-js'
import React from 'react'
import ReactDOM from 'react-dom'
require('fullcalendar')
import {} from 'qtip2'
var moment = require('moment')
require('bootstrap')
var DateTimeField = require('react-bootstrap-datetimepicker');


class Calendar extends React.Component{

    componentDidMount(){
        const {calendar} = this.refs;
        $(calendar).fullCalendar({
            lang: 'sk',
            editable: true,
            header: {
                left: 'prev,next',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            events: (start, end, timezone, callback) => {
                let url=this.props.url
                if((this.props.url).includes("?")){
                    url=url+"&"
                }else{
                    url=url+"?"
                }
                url=url+"start="+start+"&end="+end;
                $.getJSON({url:url, success: function(result){
                    callback(result);
                }})
            },
            timeFormat: 'H:mm',
            eventDrop: function(event, delta, revertFunc) {
                event.start.add(delta)
                if(event.end!==null){
                    event.end.add(delta)
                }
                this.updateEventOnServer(event,revertFunc)
            }.bind(this),
            eventResize: function(event, delta, revertFunc) {
                if(event.end!==null){
                    event.end.add(delta)
                }
                this.updateEventOnServer(event,revertFunc)
            },
            eventClick:  function(event, jsEvent, view) {
                this.props.createEvent(event)
            }.bind(this),
        }).qtip({
             content: {
                text:'<a href="link"> asa</a>'
             }
         });
        this.intervalId=setInterval(function(){$(calendar).fullCalendar('refetchEvents')}, 20000);
    }

    updateEventOnServer(event,revertFunc){
        $.ajax({
                  type: "put",
                  url: "/api/events/"+event.id+"/",
                  headers: {
                        "X-CSRFToken":cookie.get('csrftoken'),
                        "Content-Type":"application/json",
                    },
                  data: JSON.stringify(event),
        }).fail(revertFunc);
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
        console.log(this.props.onChange)
        let active="btn btn-default "+(this.props.value ? "active" : "");
        return (
              <button type="button" className={active} onClick={this.props.onChange}>{this.props.title}</button>
        );
    }

}

class GroupList extends React.Component{

    render(){
        var groups = this.props.data.map(function(group) {
          return (
            <Group title={group.title} key={group.id} 
            value={group.value} 
            onChange={(e)=>this.props.groupChanged(group.id)}/>
          )
        }.bind(this))
        return (
        <div> <h5>Organizátor:</h5> <span className="btn-group btn-group-xs" role="group" aria-label="...">
           {groups} 
          </span>
        </div>
        );
    }
}

class Category extends React.Component{
    render(){
        let active="btn btn-default "+(this.props.value ? "active" : "");
        return (
             <button type="button" className={active} onClick={this.props.onChange}>{this.props.title}</button>
        );
    }
}

class CategoryGroup extends React.Component{
    render(){
        var categories = this.props.data.map(function(category){
            if(category.category_group===this.props.id){
                return (
                    <Category title={category.title} value={category.value} key={category.id} onChange={(e)=>this.props.onChange(category.id)}/>
                  )
            }
        }.bind(this))
        var newCategories=[]
        for(let i=0;i<categories.length;i++){
            if(categories[i]!==undefined){
                newCategories.push(categories[i])
            }
        }
        return(
            <div> {this.props.title}: <span className="btn-group btn-group-xs" role="group" aria-label="...">
               {newCategories}
              </span>
            </div>      
        );
    }
}


class CategoryGroupList extends React.Component{

    render(){
        let categoryGroups = this.props.categoryGroups.map(function(categorygroup) {
          return (
            <CategoryGroup title={categorygroup.title} key={categorygroup.id} id={categorygroup.id} data={this.props.categories} onChange={this.props.categoryChanged}/>
          )
        }.bind(this))
        return (
            <div>
            <h5>Kategórie:</h5>
            {categoryGroups} 
            </div>
        );
    }
}

class IcsExport extends React.Component{

    constructor(props){
        super(props);
        this.state = {name:[]};
        this.handleChange = this.handleChange.bind(this)
        this.exportCall = this.exportCall.bind(this)

    }

    handleChange(e){
        this.setState({name: e.target.value});
    }

    exportCall(){
        this.props.onClick(this.state.name);
    }

    render(){
        return(
            <div>
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Calendar name" onChange={this.handleChange} />
              <span className="input-group-btn">
                <button className="btn btn-default" type="button" onClick={this.exportCall}>Export</button>
              </span>
            </div>
                <div className="input-group">
                  <span className="input-group-addon" id="basic-addon1">Exported url:</span>
                  <input type="text" className="form-control" value={this.props.url} readOnly placeholder="Username" aria-describedby="basic-addon1" size="45"/>
                </div>
            </div>
        );
    }
}

class CalEvent extends React.Component{
    render(){
        let dateformat='DD-MM-YYYY h:mm'
        var startstring = moment().format(dateformat);
        var endstring = moment().format(dateformat);
        var title = "title"
        if(this.props.event!==null){
            startstring = this.props.event.start.format(dateformat);
            endstring = this.props.event.end.format(dateformat);
            title = this.props.event.title
            for(let i=0;i<this.props.groups.length;i++){
                this.props.groups[i].value=false
            }
            for(let i=0;i<this.props.event.groups.length;i++){
                this.props.groups[this.props.event.groups[i]].value=true
            }
        }
        return(
        <div id="fullCalModal" className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">×</span> <span className="sr-only">close</span></button>
                        <h4 id="modalTitle" className="modal-title">{title}</h4>
                    </div>
                    <div id="modalBody" className="modal-body">
                    from: <DateTimeField dateTime={startstring} format={dateformat}/>
                    to: <DateTimeField dateTime={endstring} format={dateformat}/>
                    <GroupList data={this.props.groups} groupChanged={this.props.groupChanged.bind(this)}/>
                    <CategoryGroupList categories={this.props.categories} categoryGroups={this.props.categoryGroups} categoryChanged={this.props.categoryChanged.bind(this)}/>
                    </div> 
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        <button className="btn btn-primary"><a id="eventUrl" target="_blank">Event Page</a></button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}


class App extends React.Component{

    constructor(props){
        super(props);
        this.state = {groups:[],categories:[],catgroups:[],url:"/api/events/",exporturl:"exporturl",event:null};
    }


    createEvent(event){
        $('#fullCalModal').modal();
        let newState={...this.state}
        newState.event=event
        this.setState(newState)
    }

    makeQuery(newState){
        let q="/api/events/?"
        let filteredGroups=newState.groups.filter(function(group){
            return group.value
        })
        q=q+"organizators="
        for(let i=0;i<filteredGroups.length;i++){
            q=q+filteredGroups[i].id
            if(i!=filteredGroups.length-1){
                    q=q+','
           }
        }
        for(let i=0;i<newState.catgroups.length;i++){
            let filtered=newState.categories.filter(function(cat){
                return cat.value && cat.category_group===newState.catgroups[i].id
            });
            if(filtered.length>0){
                q=q+"&category_"+newState.catgroups[i].id+"="
                for(let j=0;j<filtered.length;j++){
                    q=q+filtered[j].id
                    if(j!=filtered.length-1){
                        q=q+','
                    }
                }
            }
        }
        return q
    }

    groupChanged(id){
        let newState={...this.state}
        let index = newState.groups.map(function(e) { return e.id; }).indexOf(id);
        newState.groups[index]['value']=!newState.groups[index]['value']
        newState.url=this.makeQuery(newState)
        this.setState(newState)
    }

    categoryChanged(id){
        let newState={...this.state}
        let index = newState.categories.map(function(e) { return e.id; }).indexOf(id);
        newState.categories[index]['value']=!newState.categories[index]['value']
        newState.url=this.makeQuery(newState)
        this.setState(newState)
    }  

    exportIcs(title){
        let myState={...this.state}
        let cats=myState.categories.filter(function(cat) { return cat.value; }).map(function(cat){ return cat.id});
        let groups = myState.groups.filter(function(group) { return group.value; }).map(function(group){ return group.id});
        let exporturl=Math.random().toString(36).substring(7);
        $.ajax({
          type: "post",
          url: "/api/icscalendars/",
          headers: {
                "X-CSRFToken":cookie.get('csrftoken'),
                "Content-Type":"application/json",
            },
          data: JSON.stringify({"title": title, 
                "url": exporturl, 
                "public": true,
                "categories": cats,
                "groups": groups
            }),
        }).done(function() {
            myState.exporturl=document.location+"ics/"+exporturl+".ics";
            this.setState(myState)
        }.bind(this));
        
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
                this.setState({groups: data,url:this.state.url,categories:this.state.categories,catgroups:this.state.catgroups});
              }.bind(this),
              error: function(xhr, status, err) {
                console.error("/api/groups/", status, err.toString());
              }.bind(this)
        });
    }   


    initialLoadCategoriesFromServer(){
         $.ajax({
              url: "/api/categories/",
              dataType: 'json',
              cache: false,
              success: function(data) {
                for(let i=0;i<data.length;i++){
                    data[i]['value']=false
                }
                this.setState({groups: this.state.groups,url:this.state.url,categories:data,catgroups:this.state.catgroups});
              }.bind(this),
              error: function(xhr, status, err) {
                console.error("/api/categories/", status, err.toString());
              }.bind(this)
        });
    }   


    initialLoadCategoryGroupsFromServer(){
         $.ajax({
              url: "/api/categorygroups/",
              dataType: 'json',
              cache: false,
              success: function(data) {
                this.setState({groups: this.state.groups,url:this.state.url,categories:this.state.categories,catgroups:data});
              }.bind(this),
              error: function(xhr, status, err) {
                console.error("/api/categorygroups/", status, err.toString());
              }.bind(this)
        });
    }   

    componentDidMount(){
        this.initialLoadGroupsFromServer();
        this.initialLoadCategoriesFromServer();
        this.initialLoadCategoryGroupsFromServer();
    }

    render(){
        return(
            <div>
            <div className="container">
            <div className="row">
                <div className="col-sm-6">
                <GroupList data={this.state.groups} groupChanged={this.groupChanged.bind(this)} />
                </div>
                <div className="col-sm-6">
                <CategoryGroupList categories={this.state.categories} categoryGroups={this.state.catgroups} categoryChanged={this.categoryChanged.bind(this)} />
                </div>
            </div>
            <div className="row">
                <div className=".col-md-8 .col-md-offset-2">
                <Calendar pollInterval={20000} url={this.state.url} createEvent={this.createEvent.bind(this)}/>
                </div>
            </div>
            <div className="row">
                <div className=".col-md-8 .col-md-offset-2">
                <IcsExport url={this.state.exporturl} onClick={this.exportIcs.bind(this)}/>
                </div>
            </div>
            <CalEvent event={this.state.event} groups={this.state.groups} groupChanged={this.groupChanged.bind(this)} categories={this.state.categories} categoryGroups={this.state.catgroups} categoryChanged={this.categoryChanged.bind(this)}/>
            </div>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'))

