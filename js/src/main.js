window.$ = window.jQuery = require('jquery');
import cookie from 'cookies-js'
import React from 'react'
import ReactDOM from 'react-dom'
require('fullcalendar')
var moment = require('moment')
require('bootstrap')
import {} from 'parsleyjs'
import {Calendar} from './calendar.js'
import {GroupList} from './groups.js'
import {CategoryGroupList} from './categories.js'
import {IcsExport} from './icsexport.js'
import {CalEvent, CalViewOnlyEvent} from './calevent.js'



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

