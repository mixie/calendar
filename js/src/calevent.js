import React from 'react'
var DateTimeField = require('react-bootstrap-datetimepicker');
import {GroupList} from './groups.js'
import {CategoryGroupList} from './categories.js'
var moment = require('moment')
require("bootstrap-validator")

class ErrorMessage extends React.Component{
    render(){
        return(
            <div className="alert alert-danger" role="alert">
                          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                          Názov udalosti nesmie byť prázdny.
                        </div>
            );
    }
}



export class CalEvent extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {
          valid:true
        };
    }

    setStartDate(date){
        let newEvent=$.parseJSON(JSON.stringify(this.props.event));
        newEvent.start=moment(date).local();
        let end = moment(newEvent.end).local();
        if (end.diff(newEvent.start)<0){
            newEvent.end = moment(date).local();
        }else{
            newEvent.end = moment(newEvent.end).local();
        }
        this.props.updateEvent(newEvent)
    }

    setEndDate(date){
        let newEvent=$.parseJSON(JSON.stringify(this.props.event));
        newEvent.end=moment(date).local();
        let start = moment(newEvent.start).local();
        if (start.diff(newEvent.end)>0){
            newEvent.start = moment(date).local();
        }else{
            newEvent.start = moment(newEvent.start).local();
        }
        this.props.updateEvent(newEvent)
    }

    setTitle(e){
        let valid = !$("#event-title").is(":invalid")
        this.setState({valid:valid})
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
        newEvent.end=moment(newEvent.end);
        newEvent.start=moment(newEvent.start);
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

    validateEvent(event){
        if(!$("#event-title").is(":invalid")){
            $(fullCalModalEdit).modal("hide")
            console.log(event.start)
            this.props.saveEvent(event)
        }
    }

    render(){
        let publicEvent="btn btn-default "+(this.props.event.public ? "active" : "");
        let alldayEvent="btn btn-default "+(this.props.event.allDay ? "active" : "");
        return(
        <div id="fullCalModalEdit" className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">×</span> <span className="sr-only">close</span></button>
                            názov: <input type="text" id="event-title" className="form-control" required value={this.props.event.title} data-error="Názov udalosti nesmie byť prázdny" onChange={this.setTitle.bind(this)} />
                            {(!this.state.valid) && <ErrorMessage />}
                        </div>
                        <div id="modalBody" className="modal-body">
                        <div className="form-group">
                        <button type="button" className={publicEvent}  onClick={this.publicChanged.bind(this)}>Verejná</button>
                        <button type="button" className={alldayEvent}  onClick={this.allDayChanged.bind(this)}>Celodenná</button>
                        </div>
                        <div className="form-group">
                        od: <DateTimeField dateTime={this.props.eventstart} format="YYYY-MM-DD HH:mm" inputFormat="YYYY-MM-DD HH:mm" onChange={this.setStartDate.bind(this)}/>
                        do: <DateTimeField dateTime={this.props.eventend} format="YYYY-MM-DD HH:mm" inputFormat="YYYY-MM-DD HH:mm" onChange={this.setEndDate.bind(this)}/>
                        </div>
                        <div className="form-group">
                        <GroupList data={this.props.groups} groupChanged={this.groupChanged.bind(this)} groupListName={"Skupiny"}/>
                        <GroupList data={this.props.otherGroups} groupChanged={this.groupChanged.bind(this)} groupListName={"Ostatné skupiny"}/>
                        <CategoryGroupList categories={this.props.categories} categoryGroups={this.props.categoryGroups} categoryChanged={this.categoryChanged.bind(this)}/>
                        </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-danger pull-left"  data-dismiss="modal" onClick={(e)=>this.props.deleteEvent(this.props.event.id)}>Zmazať</button>
                            <button type="button" className="btn btn-default" data-dismiss="modal">Zavrieť</button>
                            <button className="btn btn-primary" onClick={(e)=>this.validateEvent(this.props.event)}>Uložiť</button>
                        </div>
                    </div> 
                </div>
        </div>
        );
    }
}
