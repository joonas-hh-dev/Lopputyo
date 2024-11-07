import React, { useState, useEffect, useRef } from 'react';
import { Typography, Box, Button, Container } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import AddCustomer from '../components/AddCustomer';
import EditCustomer from '../components/EditCustomer';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { saveAs } from 'file-saver';

export default function CustomerPage() {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const gridRef = useRef(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const defaultColDef = {
        sortable: true,
        filter: true,
    }

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers');
            const data = await response.json();
            setCustomers(data._embedded.customers);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

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

    const updateCustomer = (updatedCustomer, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCustomer)
        })
        .then(res => {
            if (res.ok) {
                fetchCustomers();
                setOpenDialog(false);
            }
        })
        .catch(err => console.log(err));
    };

    const customerColumnDefs = [
        { headerName: 'First Name', field: 'firstname', sortable: true, filter: true },
        { headerName: 'Last Name', field: 'lastname', sortable: true, filter: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true },
        { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
        { headerName: 'Street Address', field: 'streetaddress', sortable: true, filter: true },
        { headerName: 'Postcode', field: 'postcode', sortable: true, filter: true },
        { headerName: 'City', field: 'city', sortable: true, filter: true },
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
    ];

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
    }, []);

    return (
    <Container
        maxWidth={false}
        style={{ maxWidth: '100%' }}
    >
        <Typography variant="h4" gutterBottom>
            Customers
        </Typography>
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
        <div className="ag-theme-material" style={{ width: '100%', height: 800 }}>
            <AgGridReact
                ref={gridRef}
                onGridReady={params => gridRef.current = params.api}
                rowData={customers}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={20}
                columnDefs={customerColumnDefs}
                rowSelection="single"
            />
        </div>
    </Container>
    );
}