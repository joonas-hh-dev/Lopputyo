import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import _ from 'lodash';

const TrainingStats = () => {
    const [statsData, setStatsData] = useState([]);

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings');
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    const activityMinutes = _(data)
                        .groupBy('activity')
                        .map((trainings, activity) => ({
                            activity,
                            minutes: _.sumBy(trainings, 'duration')
                        }))
                        .value();

                    setStatsData(activityMinutes);
                } else {
                    console.error('Unexpected data format:', data);
                }
            } catch (error) {
                console.error('Error fetching trainings:', error);
            }
        };

        fetchTrainings();
    }, []);

    return (
        <div>
            <h2>Training Stats</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={statsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="activity" />
                    <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="minutes" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrainingStats;