import React from 'react';
import { Container, Typography } from '@mui/material';
import TrainingStats from '../components/TrainingStats';

export default function TrainingStatsPage() {
    return (
        <Container
        maxWidth={false}
        style={{ maxWidth: '100%' }}>
            <Typography variant="h4" gutterBottom>
                Training Statistics
            </Typography>
            <TrainingStats />
        </Container>
    );
}
