window.$ = window.jQuery = require('jquery');
import cookie from 'cookies-js'
import React from 'react'
import ReactDOM from 'react-dom'
require('fullcalendar')
import {} from 'qtip2'
var moment = require('moment')
require('bootstrap')
var DateTimeField = require('react-bootstrap-datetimepicker');
import {} from 'parsleyjs'


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
                this.props.updateEventOnServer(event,revertFunc)
            }.bind(this),
            eventResize: function(event, delta, revertFunc) {
                if(event.end!==null){
                    event.end.add(delta)
                }
                this.props.updateEventOnServer(event,revertFunc)
            },
            eventClick:  function(event, jsEvent, view) {
                this.props.openEvent(event,false)
            }.bind(this),
            dayClick:function(date, jsEvent, view) {
                let event={title:"",start:date, end:date, categories:[],groups:[],public:false,allDay:false};
                this.props.openEvent(event,true)
            }.bind(this),
            eventLimit:true,
        });
        this.intervalId=setInterval(function(){$(calendar).fullCalendar('refetchEvents')}, 30000);
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
        let active="btn btn-default "+(this.props.value ? "active" : "");
        return (
              <button type="button" className={active} onClick={this.props.onChange}>{this.props.name}</button>
        );
    }
}

class GroupList extends React.Component{

    render(){
        var groups = this.props.data.map(function(group) {
          return (
            <Group name={group.name} key={group.id} 
            value={group.value} 
            onChange={(e)=>this.props.groupChanged(group.id)}/>
          )
        }.bind(this))
        return (
        <div> <h5><strong>Organizátor</strong></h5> <span className="btn-group btn-group-xs" role="group" aria-label="...">
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
            <div className="row">
            <div className="col-sm-5"> 
                {this.props.title}:
            </div>
            <div className="col-sm-7"> 
             <span className="btn-group btn-group-xs" role="group" aria-label="...">
               {newCategories}
              </span>
            </div>
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
            <h5><strong>Kategórie</strong></h5>
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
    
    constructor(props) {
        super(props);
        this.state = {
          start: this.props.event.start,
          end: this.props.event.end
        };
    }

    setStartDate(date){
        let newEvent=$.parseJSON(JSON.stringify(this.props.event));
        newEvent.start=moment(date);
        newEvent.end=moment(newEvent.end);
        this.props.updateEvent(newEvent)
    }

    setEndDate(date){
        let newEvent=$.parseJSON(JSON.stringify(this.props.event));
        newEvent.end=moment(date);
        newEvent.start=moment(newEvent.start);
        this.props.updateEvent(newEvent)
    }

    setTitle(e){
        let newEvent=$.parseJSON(JSON.stringify(this.props.event));
        newEvent.end=moment(newEvent.end);
        newEvent.start=moment(newEvent.start);
        newEvent.title=e.target.value;
        this.props.updateEvent(newEvent)
    }


    groupChanged(id){
        let newEvent=$.parseJSON(JSON.stringify(this.props.event));
        newEvent.end=moment(newEvent.end);
        newEvent.start=moment(newEvent.start);
        let index=newEvent.groups.indexOf(id)
        if (index>-1){
            newEvent.groups.splice(index,1)
        }else{
            newEvent.groups.push(id)
        }
        this.props.updateEvent(newEvent)
    }

    categoryChanged(id){
        let newEvent=$.parseJSON(JSON.stringify(this.props.event));
        newEvent.end=moment(newEvent.end);
        newEvent.start=moment(newEvent.start);
        let index=newEvent.categories.indexOf(id)
        if (index>-1){
            newEvent.categories.splice(index,1)
        }else{
            newEvent.categories.push(id)
        }
        this.props.updateEvent(newEvent)
    }  

    allDayChanged(){
        let newEvent=$.parseJSON(JSON.stringify(this.props.event));
        console.log(newEvent.start)
        newEvent.end=moment(newEvent.end);
        newEvent.start=moment(newEvent.start);
        console.log(newEvent.start)
        newEvent.allDay=!newEvent.allDay;
        this.props.updateEvent(newEvent)
    }  

    publicChanged(){
        let newEvent=$.parseJSON(JSON.stringify(this.props.event));
        newEvent.end=moment(newEvent.end);
        newEvent.start=moment(newEvent.start);
        newEvent.public=!newEvent.public;
        this.props.updateEvent(newEvent)
    }  


    render(){
        let publicEvent="btn btn-default "+(this.props.event.public ? "active" : "");
        let alldayEvent="btn btn-default "+(this.props.event.allDay ? "active" : "");
        return(
        <div id="fullCalModal" className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">×</span> <span className="sr-only">close</span></button>
                        title: <input type="text" className="form-control" value={this.props.event.title} onChange={this.setTitle.bind(this)} />
                    </div>
                    <div id="modalBody" className="modal-body">
                    <div className="form-group">
                    <button type="button" className={publicEvent}  onClick={this.publicChanged.bind(this)}>Public</button>
                    <button type="button" className={alldayEvent}  onClick={this.allDayChanged.bind(this)}>Allday</button>
                    </div>
                    <div className="form-group">
                    from: <DateTimeField dateTime={this.props.eventstart} format="YYYY-MM-DD HH:mm" inputFormat="YYYY-MM-DD HH:mm" onChange={this.setStartDate.bind(this)}/>
                    to: <DateTimeField dateTime={this.props.eventend} format="YYYY-MM-DD HH:mm" inputFormat="YYYY-MM-DD HH:mm" onChange={this.setEndDate.bind(this)}/>
                    </div>
                    <div className="form-group">
                    <GroupList data={this.props.groups} groupChanged={this.groupChanged.bind(this)}/>
                    <CategoryGroupList categories={this.props.categories} categoryGroups={this.props.categoryGroups} categoryChanged={this.categoryChanged.bind(this)}/>
                    </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-danger pull-left"  data-dismiss="modal" onClick={(e)=>this.props.deleteEvent(this.props.event.id)}>Delete</button>
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        <button className="btn btn-primary"  data-dismiss="modal" onClick={(e)=>this.props.saveEvent(this.props.event)}>Save</button>
                    </div>
                </div> 
            </div>
        </div>
        );
    }
}

class CalViewOnlyEvent extends React.Component{

    render(){
        let publicEvent="btn btn-default "+(this.props.event.public ? "active" : "");
        let alldayEvent="btn btn-default "+(this.props.event.allDay ? "active" : "");
        return(
        <div id="fullCalModal" className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">×</span> <span className="sr-only">close</span></button>
                        title: this.props.event.title
                    </div>
                    <div id="modalBody" className="modal-body">
                    <div className="form-group">
                    <button type="button" className={publicEvent}  onClick={this.publicChanged.bind(this)}>Public</button>
                    <button type="button" className={alldayEvent}  onClick={this.allDayChanged.bind(this)}>Allday</button>
                    </div>
                    <div className="form-group">
                    from: <DateTimeField dateTime={this.props.eventstart} format="YYYY-MM-DD HH:mm" inputFormat="YYYY-MM-DD HH:mm" onChange={this.setStartDate.bind(this)}/>
                    to: <DateTimeField dateTime={this.props.eventend} format="YYYY-MM-DD HH:mm" inputFormat="YYYY-MM-DD HH:mm" onChange={this.setEndDate.bind(this)}/>
                    </div>
                    <div className="form-group">
                    <GroupList data={this.props.groups} groupChanged={this.groupChanged.bind(this)}/>
                    <CategoryGroupList categories={this.props.categories} categoryGroups={this.props.categoryGroups} categoryChanged={this.categoryChanged.bind(this)}/>
                    </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-danger pull-left"  data-dismiss="modal" onClick={(e)=>this.props.deleteEvent(this.props.event.id)}>Delete</button>
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        <button className="btn btn-primary"  data-dismiss="modal" onClick={(e)=>this.props.saveEvent(this.props.event)}>Save</button>
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
        this.state = {groups:[],categories:[],catgroups:[],url:"/api/events/",exporturl:"exporturl",
        event:{title:"",start:moment(), end:moment(), categories:[],groups:[]}, 
        eventgroups:[],eventcategories:[],eventstart:"2016-10-02T18:10",eventend:"2016-10-02T18:10",public:false,allDay:false};
    }


    openEvent(event,isNew){
        this.setState({isNew:isNew})
        $('#fullCalModal').modal();
        this.updateEventOnScreen(event)
    }

    updateEventOnScreen(event){
        let newState={...this.state}
        newState.event=event;
        let dateformat='YYYY-MM-DD HH:mm'
        for(let i=0;i<newState.eventgroups.length;i++){
            newState.eventgroups[i].value=false
        }
        for(let i=0;i<event.groups.length;i++){
            let index = newState.eventgroups.map(function(e) { return e.id; }).indexOf(event.groups[i]);
            newState.eventgroups[index].value=true
        }
        for(let i=0;i<newState.eventcategories.length;i++){
            newState.eventcategories[i].value=false
        }
        for(let i=0;i<event.categories.length;i++){
            let index = newState.eventcategories.map(function(e) { return e.id; }).indexOf(event.categories[i]);
            newState.eventcategories[index].value=true
        }
        newState.eventstart=event.start.format(dateformat);
        if(event.end!==null){
            newState.eventend=event.end.format(dateformat);
        }else{
            newState.eventend=newState.eventstart;
        }
        this.setState(newState)
    }

    updateEventOnServer(event,revertFunc){
        let url="/api/events/"
        let start = event.start.format('YYYY-MM-DDTHH:mm').replace("P","T").replace("A","T")
        let end = event.end.format('YYYY-MM-DDTHH:mm').replace("P","T").replace("A","T")
        let method="post"
        if(!this.state.isNew){
            url=url+event.id+"/";
            method="put"
        }
        $.ajax({
                  type: method,
                  url: url,
                  headers: {
                        "X-CSRFToken":cookie.get('csrftoken'),
                        "Content-Type":"application/json",
                    },
                  data: JSON.stringify({
                        "id": event.id,
                        "title": event.title,
                        "start": start,
                        "end": end,
                        "public": event.public,
                        "allDay": event.allDay,
                        "categories":event.categories,
                        "groups":event.groups
                    }),
        }).success(function(){
            const {calendar} = this.refs;
            $(calendar).fullCalendar('refetchEvents')
        }.bind(this)).fail(revertFunc);
        
    }

    deleteEvent(eventid){
        let url="/api/events/"+eventid+"/";
        $.ajax({
                  type: "delete",
                  url: url,
                  headers: {
                        "X-CSRFToken":cookie.get('csrftoken'),
                        "Content-Type":"application/json",
                    },
        }).success(function(){
            const {calendar} = this.refs;
            $(calendar).fullCalendar('refetchEvents')
        }.bind(this));
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
        $.ajax({
          type: "post",
          url: "/api/icscalendars/",
          headers: {
                "X-CSRFToken":cookie.get('csrftoken'),
                "Content-Type":"application/json",
            },
          data: JSON.stringify({"title": title, 
                "public": true,
                "categories": cats,
                "groups": groups,
                "url": "a",
            }),
        }).done(function(data) {
            myState.exporturl=document.location+"ics/"+data.url+".ics";
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
                this.setState({groups: data});
                let data2=$.parseJSON(JSON.stringify(data))
                this.setState({eventgroups: data2});
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
                this.setState({categories:data});
                let data2=$.parseJSON(JSON.stringify(data))
                this.setState({eventcategories: data2});
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
                this.setState({catgroups:data});
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
                <div className="container">
                <div className="row">
                    <div className="col-md-4 col-sm-6 col-md-offset-2">
                    <GroupList data={this.state.groups} groupChanged={this.groupChanged.bind(this)} />
                    </div>
                    <div className="col-md-4 col-sm-6">
                    <CategoryGroupList categories={this.state.categories} categoryGroups={this.state.catgroups} categoryChanged={this.categoryChanged.bind(this)} />
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-8 col-md-offset-2">
                    <Calendar pollInterval={20000} url={this.state.url} openEvent={this.openEvent.bind(this)} updateEventOnServer={this.updateEventOnServer.bind(this)}/>
                    </div>
                </div> 
                <hr/>
                <div className="row">
                    <div className="col-md-10 col-md-offset-1">
                        <IcsExport url={this.state.exporturl} onClick={this.exportIcs.bind(this)}/>
                    </div>
                </div>
                <CalEvent event={this.state.event} groups={this.state.eventgroups} categories={this.state.eventcategories} deleteEvent={this.deleteEvent.bind(this)} saveEvent={this.updateEventOnServer.bind(this)} categoryGroups={this.state.catgroups} updateEvent={this.updateEventOnScreen.bind(this)} eventstart={this.state.eventstart} eventend={this.state.eventend}/>
                </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'))

