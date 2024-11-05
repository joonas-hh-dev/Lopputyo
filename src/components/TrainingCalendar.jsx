import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const TrainingCalendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings');
                const data = await response.json();
                console.log("Fetched data:", data);

                if (Array.isArray(data)) {
                    const formattedEvents = data.map(training => {
                        const startDate = moment(training.date).utc();
                        const endDate = startDate.clone().add(training.duration, 'minutes');
                        return {
                            title: `${training.activity} / ${training.customer.firstname} ${training.customer.lastname}`,
                            start: startDate.toDate(),
                            end: endDate.toDate(),
                        };
                    });
                    setEvents(formattedEvents);
                } else {
                    console.error('Unexpected data format:', data);
                }
            } catch (error) {
                console.error('Error fetching trainings:', error);
            }
        };
        
        fetchTrainings();
    }, []);

    const eventStyleGetter = (event) => {
        return {
            style: {
                backgroundColor: '#3174ad',
                borderRadius: '5px',
                color: 'white',
                padding: '5px',
                display: 'block',
                whiteSpace: 'normal'
            }
        };
    };

    const eventComponent = ({ event }) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ whiteSpace: 'nowrap' }}>{event.title}</span>
                <span style={{ whiteSpace: 'nowrap' }}>{event.customer}</span>
            </div>
        );
    };

    return (
        <div>
            <h2>Training Calendar</h2>
            <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            defaultView="month"
            views={['month', 'week', 'day', 'agenda']}
            step={60}
            timeslots={1}
            min={new Date(0, 0, 0, 8, 0, 0)}
            max={new Date(0, 0, 0, 20, 0, 0)}
            components={{
                event: eventComponent,
            }}
            />
        </div>
    );
};

export default TrainingCalendar;