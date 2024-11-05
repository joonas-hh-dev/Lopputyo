import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import 'ag-grid-community/styles/agGridMaterialFont.css';
import { Box, Button, Tab } from '@mui/material';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import AddTraining from "./AddTraining";
import TrainingCalendar from "./TrainingCalendar";
import TrainingStats from "./TrainingStats";
import moment from 'moment';
import { saveAs } from 'file-saver';

function TrainingApp() {
  const gridRef = useRef();
  const [value, setValue] = useState('1');

  const [customers, setCustomers] = useState([]);
    const [customerColumnDefs, setCustomerColumnDefs] = useState([
        { field: 'firstname',
          headerName: 'First name'
        },
        { field: 'lastname',
          headerName: 'Last name'
        },
        { field: 'streetaddress',
          headerName: 'Street address'
        },
        { field: 'postcode',
          headerName: 'Post code'
        },
        { field: 'city',
          headerName: 'City'
        },
        { field: 'email',
          headerName: 'Email'
        },
        { field: 'phone',
          headerName: 'Phone'},
        {
            field: 'button',
            suppressHeaderFilterButton: true,
            sortable: false,
            headerName: '',
            cellRenderer: EditCustomer,
            cellRendererParams: (params) => ({
                rowData: params.data,
                updateCustomer: updateCustomer,
                link: params.data._links.self.href
            })
        },
        {
          field: '_links.self.href',
          suppressHeaderFilterButton: true,
          sortable: false,
          headerName: '',
          cellRenderer: (params) => {
              const value = params.data._links.self.href;
              return (
              <Button
              color="error"
              onClick={() => deleteCustomer(value)}
              >
              Delete
              </Button>
              );
          }
        },
    ]);

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

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  const defaultColDef = {
    sortable: true,
    filter: true,
  }

  const fetchCustomers = async() => {
    try {
        const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers')
        const data = await response.json();
        setCustomers(data._embedded.customers)
        //console.log(data)
    } catch(e) {
        console.error(e)
    }
  }

  const saveCustomer = (customer) => {
    fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
    })
    .then(res => fetchCustomers())
    .catch(err => console.log(err))
  }

  const deleteCustomer = (link) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this customer?");
    if (isConfirmed) {
      fetch(link, {method: 'DELETE'})
      .then(res => fetchCustomers())
      .catch(err => console.error(err))
    }
  }

  const updateCustomer = (customer, link) => {
    fetch(link, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customer)
    })
    .then(res => fetchCustomers())
    .catch(err => console.log(err))
  }

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

  const downloadCSV = () => {
    if (!customers || customers.length === 0) {
      console.error('No data available to export');
      return;
    }
  
    try {
      const excludeKeys = ['button', '_links'];
  
      const headers = Object.keys(customers[0])
        .filter(key => !excludeKeys.includes(key))
        .join(",") + "\n";
  
      const rows = customers.map(customer => 
        Object.entries(customer)
          .filter(([key]) => !excludeKeys.includes(key))
          .map(([_, value]) => 
            typeof value === 'object' ? '' : value
          )
          .join(",")
      ).join("\n");
  
      const csvContent = headers + rows;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'customers.csv');
    } catch (error) {
      console.error('Error generating CSV:', error);
    }
  };
  

  useEffect(() => {
    fetchCustomers();
    fetchTrainings();
  }, []);

  return (
  <TabContext value={value}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <TabList onChange={handleChange}>
        <Tab label="Customer" value="1" />
        <Tab label="Training" value="2" />
        <Tab label="Calendar" value="3" />
        <Tab label="Statistics" value="4" />
      </TabList>
    </Box>
    <TabPanel value="1">
    <Box display="flex" gap={2} mb={2}> 
    <AddCustomer saveCustomer={saveCustomer}/>
    <Button
    variant="contained"
    color="primary"
    onClick={downloadCSV}
    style={{ margin: "10px 0" }}
    >
      Download CSV
    </Button>
    </Box>
      <div className="ag-theme-material" style={{ width: "100%", height: 800 }}>
          <AgGridReact
          ref={gridRef}
          onGridReady={params => gridRef.current = params.api}
          rowData={customers}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
          columnDefs={customerColumnDefs}
          rowSelection="single" />
        </div>
    </TabPanel>
    <TabPanel value="2">
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
          rowSelection="single" />
        </div>
      </LocalizationProvider>
    </TabPanel>
    <TabPanel value="3">
      <TrainingCalendar />
    </TabPanel>
    <TabPanel value="4">
      <TrainingStats />
    </TabPanel>
  </TabContext>
  );
}

export default TrainingApp;