import React from 'react'
import {GroupList} from './groups.js'
import {CategoryGroupList} from './categories.js'
var moment = require('moment')

class CategoryView extends React.Component{
    render(){
        let active="btn disabled "+(this.props.value ? "btn-primary" : "btn-default");
        return (
             <button type="button" className={active} onClick={this.props.onChange}>{this.props.title}</button>
        );
    }
}

class CategoryGroupView extends React.Component{
    render(){
        var categories = this.props.data.map(function(category){
            if(category.category_group===this.props.id){
                return (
                    <CategoryView title={category.title} value={category.value} key={category.id} onChange={(e)=>this.props.onChange(category.id)}/>
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


class CategoryGroupListView extends React.Component{

    render(){
        let categoryGroups = this.props.categoryGroups.map(function(categorygroup) {
          return (
            <CategoryGroupView title={categorygroup.title} key={categorygroup.id} id={categorygroup.id} data={this.props.categories} onChange={this.props.categoryChanged}/>
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

class GroupView extends React.Component{
    render(){
        let active="btn disabled "+(this.props.value ? "btn-primary" : "btn-default");
        return (
              <button type="button" className={active} onClick={this.props.onChange}>{this.props.name}</button>
        );
    }
}

class GroupListView extends React.Component{

    render(){
        var groups = this.props.data.map(function(group) {
          return (
            <GroupView name={group.name} key={group.id} 
            value={group.value} 
            onChange={(e)=>this.props.groupChanged(group.id)}/>
          )
        }.bind(this))
        return (
        <div> <h5><strong>{this.props.groupListName}</strong></h5> <span className="btn-group btn-group-xs" role="group" aria-label="...">
           {groups} 
          </span>
        </div>
        );
    }
}


export class CalEventView extends React.Component{

    render(){
        let publicEvent="btn disabled "+(this.props.event.public ? "btn-primary" : "btn-default");
        let alldayEvent="btn disabled "+(this.props.event.allDay ? "btn-primary" : "btn-default");
        return(
        <div id="fullCalModalView" className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">×</span> <span className="sr-only">close</span></button>
                        {this.props.event.title}
                    </div>
                    <div id="modalBody" className="modal-body">
                    <div className="form-group">
                    <button type="button" className={publicEvent}>Verejná</button>
                    <button type="button" className={alldayEvent}>Celodenná</button>
                    </div>
                    <div className="form-group">
                    od: {this.props.eventstart} <br/>
                    do: {this.props.eventend}
                    </div>
                    <div className="form-group">
                     {(this.props.groups.length>0) && <GroupListView data={this.props.groups} groupListName={"Skupiny"}/>}
                     {(this.props.groups.length>0) && <GroupListView data={this.props.otherGroups} groupListName={"Ostatné skupiny"}/>}
                    <CategoryGroupListView categories={this.props.categories} categoryGroups={this.props.categoryGroups}/>
                    </div>
                    </div>
                    <div className="modal-footer">
                        {(this.props.groups.length>0) && <button className="btn btn-warning pull-left"  data-dismiss="modal" onClick={(e)=>this.props.editEvent(this.props.event.id)}>Upraviť</button>}
                        <button type="button" className="btn btn-default" data-dismiss="modal">Zavrieť</button>
                    </div>
                </div> 
            </div>
        </div>
        );
    }
}
