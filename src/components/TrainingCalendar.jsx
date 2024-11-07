import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const TrainingCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTrainings = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings');
                const data = await response.json();
                console.log("Fetched data:", data);

                if (Array.isArray(data)) {
                    const formattedEvents = data.map(training => {
                        const startDate = moment(training.date).utc();
                        const endDate = startDate.clone().add(training.duration, 'minutes');
                        return {
                            title: `${training.activity}`,
                            start: startDate.toDate(),
                            end: endDate.toDate(),
                            customer: `${training.customer.firstname} ${training.customer.lastname}`,
                        };
                    });
                    setEvents(formattedEvents);
                } else {
                    console.error('Unexpected data format:', data);
                }
            } catch (error) {
                console.error('Error fetching trainings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainings();
    }, []);

    const eventComponent = ({ event }) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>{event.title}</span>
                <span>{event.customer}</span>
            </div>
        );
    };

    return (
        <div>
            {loading ? (
                <p>Loading trainings...</p>
            ) : (
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
            )}
        </div>
    );
};

export default TrainingCalendar;