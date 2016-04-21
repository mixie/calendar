window.$ = window.jQuery = require('jquery');
import React from 'react'
import ReactDOM from 'react-dom'
require('fullcalendar')

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
