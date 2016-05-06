import React from 'react'

class Group extends React.Component{
    render(){
        let active="btn "+(this.props.value ? " btn-primary active" : "btn-default");
        return (
              <button type="button" className={active} onClick={this.props.onChange}>{this.props.name}</button>
        );
    }
}

export class GroupList extends React.Component{

    render(){
        var groups = this.props.data.map(function(group) {
          return (
            <Group name={group.name} key={group.id} 
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