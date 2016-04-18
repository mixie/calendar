from ics import Calendar, Event as CalEvent


def convertEventsToCal(name, events):
    c = Calendar()
    for ev in events:
        c.events.append(CalEvent(name=ev.title,begin=ev.start,end=ev.end))
    return str(c)
