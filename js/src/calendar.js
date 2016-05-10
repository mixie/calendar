window.$ = window.jQuery = require('jquery');
import React from 'react'
require('fullcalendar')

export class Calendar extends React.Component{

    componentDidMount(){
        const {calendar} = this.refs;
        $(calendar).fullCalendar({
            lang: 'sk',
            editable: !this.props.viewOnly(),
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
                this.props.editEvent(event,true)
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

