import $ from 'jquery'
import jQuery from 'jquery'
import cookie from 'cookies-js'
import React from 'react'
import ReactDOM from 'react-dom'
require('fullcalendar')
import {} from 'qtip2'
import {} from './druhy'

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
                let url=this.props.url
                if((this.props.url).includes("?")){
                    url=url+"&"
                }else{
                    url=url+"?"
                }
                url=url+"start="+start+"&end="+end;
                $.getJSON({url:url, success: function(result){
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
        this.intervalId=setInterval(function(){$(calendar).fullCalendar('refetchEvents')}, 20000);
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
        var active=(this.props.value ? "active" : "");
        return (
             <button type="button" class="btn btn-secondary{active}" onClick={this.props.onChange}>{this.props.title}</button>
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
           <div class="btn-group" role="group" aria-label="...">
            {groups} 
          </div>
        );
    }
}

class Category extends React.Component{
    render(){
        var checked=(this.props.value ? "checked" : "");
        return(
            <span>
            <label><input type="checkbox" onChange={this.props.onChange} checked={checked} />{this.props.title}</label>
            </span>
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
            <li>{this.props.title}: {newCategories} </li>
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
          <ul className="categoryGroupList">
            {categoryGroups} 
          </ul>
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
                <label>Calendar name:<input type="text" name="calendarName" onChange={this.handleChange}/></label>
                <button type="button" onClick={this.exportCall}>Export</button> <br/>
                Exported url: <input type="text" value={this.props.url} readOnly size="45"/>
            </div>
        );
    }
}


class App extends React.Component{

    constructor(props){
        super(props);
        this.state = {groups:[],categories:[],catgroups:[],url:"/api/events/",exporturl:"exporturl"};
    }


    makeQuery(newState){
        let q="/api/events/?"
        let filteredGroups=newState.groups.filter(function(group){
            return group.value
        })
        if(filteredGroups.length>0){
            q=q+"organizators="
            for(let i=0;i<filteredGroups.length;i++){
                q=q+filteredGroups[i].id
                if(i!=filteredGroups.length-1){
                        q=q+','
                }
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
        console.log(newState)
        this.setState(newState)
    }  

    exportIcs(title){
        let myState={...this.state}
        let cats=myState.categories.filter(function(cat) { return cat.value; }).map(function(cat){ return cat.id});
        let groups = myState.groups.filter(function(group) { return group.value; }).map(function(group){ return group.id});
        console.log("Title")
        console.log(title)
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
        console.log(this.state)
        return(
            <div>
                <GroupList data={this.state.groups} groupChanged={this.groupChanged.bind(this)} />
                <CategoryGroupList categories={this.state.categories} categoryGroups={this.state.catgroups} categoryChanged={this.categoryChanged.bind(this)} />
                <IcsExport url={this.state.exporturl} onClick={this.exportIcs.bind(this)}/>
                <Calendar pollInterval={20000} url={this.state.url}/>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'))

