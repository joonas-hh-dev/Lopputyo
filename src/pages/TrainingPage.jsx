import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Button } from '@mui/material';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import 'ag-grid-community/styles/agGridMaterialFont.css';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from 'moment';
import AddTraining from '../components/AddTraining';

export default function AddTrainingPage() {
    const gridRef = useRef();

    const [trainings, setTrainings] = useState([]);
    const [trainingColumnDefs, setTrainingColumnDefs] = useState([
        { field: 'date',
          headerName: 'Date',
          cellRenderer: (params) => {
            const date = params.value;
            return moment(date).format('MM/DD/YYYY, h:mm A');
        }
        },
        { field: 'duration',
          headerName: 'Duration'
        },
        { field: 'activity',
          headerName: 'Activity'
        },
        {
          field: 'customer.firstname',
          headerName: 'First name'
        },
        {
          field: 'customer.lastname',
          headerName: 'Last name'
        },
        {
          field: 'id',
          suppressHeaderFilterButton: true,
          sortable: false,
          headerName: '',
          cellRenderer: (params) => {
              const id = params.data.id;
              return (
                <Button
                  color="error"
                  onClick={() => deleteTraining(id)}
                >
                  Delete
                </Button>
              );
          }
        },
    ]);
    
    const defaultColDef = {
        sortable: true,
        filter: true,
    }

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async() => {
        try {
            const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings')
            const data = await response.json();
            setTrainings(data)
            //console.log(data)
        } catch(e) {
            console.error(e)
        }
    }
    
    const saveTraining = (training) => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(training)
        })
        .then(res => fetchTrainings())
        .catch(err => console.log(err))
    }

    const deleteTraining = (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this training?");
    
        if (isConfirmed) {
            fetch(`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings/${id}`, {
                method: 'DELETE'
            })
            .then(res => fetchTrainings())
            .catch(err => console.error(err));
        }
    };

    return (
        <Container
            maxWidth={false}
            style={{ maxWidth: '100%' }}
        >
            <Typography variant="h4" gutterBottom>
                Trainings
            </Typography>
            <AddTraining saveTraining={saveTraining}/>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
                <div className="ag-theme-material" style={{ width: "100%", height: 800 }}>
                    <AgGridReact
                        ref={gridRef}
                        onGridReady={params => gridRef.current = params.api}
                        rowData={trainings}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={20}
                        columnDefs={trainingColumnDefs}
                        rowSelection="single"
                    />
                </div>
            </LocalizationProvider>
        </Container>
    );
}