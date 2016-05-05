import React from 'react'
var DateTimeField = require('react-bootstrap-datetimepicker');
import {GroupList} from './groups.js'
import {CategoryGroupList} from './categories.js'
var moment = require('moment')



export class CalEvent extends React.Component{
    
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

export class CalViewOnlyEvent extends React.Component{

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
