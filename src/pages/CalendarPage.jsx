import React from 'react';
import { Container, Typography } from '@mui/material';
import TrainingCalendar from '../components/TrainingCalendar';

export default function TrainingCalendarPage() {
    return (
        <Container
            maxWidth={false}
            style={{ maxWidth: '100%' }}
        >
            <Typography variant="h4" gutterBottom>
                Training Calendar
            </Typography>
            <TrainingCalendar />
        </Container>
    );
}