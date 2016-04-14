import $ from 'jquery'
import cookie from 'cookies-js'
import React from 'react'
import ReactDOM from 'react-dom'
require('fullcalendar')
import {} from 'qtip2'


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
                $.getJSON({url:this.props.url, success: function(result){
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
             <input type="checkbox" name="group" value={this.props.value} onChange={this.props.onChange} checked={checked} />{this.props.title} <br />
          </li>
        );
    }

}

class GroupList extends React.Component{

    render(){
        var groups = this.props.data.map(function(group) {
          return (
            <Group title={group.title} key={group.id} 
            data={group.id} value={group.value} 
            onChange={(e)=>this.props.groupChanged(group.id)}/>
          )
        }.bind(this))
        return (
          <ul className="groupList">
            {groups} 
          </ul>
        );
    }
}

class Category extends React.Component{
    render(){
        return(
            <i>
            <input type="checkbox" /><label>{this.props.title}</label>
            </i>
        );
    }
}

class CategoryGroup extends React.Component{
    render(){
        var categories = this.props.data.map(function(category){
            if(category.category_group===this.props.id){
                return (
                    <Category title={category.title} key={category.id} onChange={(e)=>this.props.onChange(category.id)}/>
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
        var categoryGroups = this.props.categoryGroups.map(function(categorygroup) {
          return (
            <CategoryGroup title={categorygroup.title} key={categorygroup.id} data={this.props.categories} id={categorygroup.id} onChange={this.props.categoryChanged}/>
          )
        }.bind(this))
        return (
          <ul className="categoryGroupList">
            {categoryGroups} 
          </ul>
        );
    }
}


class App extends React.Component{

    constructor(props){
        super(props);
        this.state = {groups:[],categories:[],catgroups:[],url:"/api/events/"};
    }


    makeQuery(groups){
        let q="/api/events/?"
        let groupquery=""
        for(let i =0;i<groups.length;i++){
            if(groups[i]['value']){
                groupquery=groupquery+groups[i]['id']+","
            }
        }
        q=q+"organizators="+groupquery.substring(0,groupquery.length-1)
        return q
    }

    groupChanged(id){
        let newState={...this.state}
        let index = newState.groups.map(function(e) { return e.id; }).indexOf(id);
        newState.groups[index]['value']=!newState.groups[index]['value']
        newState.url=this.makeQuery(newState.groups)
        this.setState(newState)
    }

    categoryChanged(id){

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
                <h1> Hello </h1>
                <GroupList data={this.state.groups} groupChanged={this.groupChanged.bind(this)} />
                <CategoryGroupList categories={this.state.categories} categoryGroups={this.state.catgroups} categoryChanged={this.categoryChanged.bind(this)} />
                <Calendar pollInterval={2000} url={this.state.url}/>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'))

