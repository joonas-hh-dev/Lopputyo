import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';

export default function AddTraining(props) {
    const [open, setOpen] = useState(false);
    const [training, setTraining] = useState({
        date: '',
        duration: '',
        activity: '',
        customer: ''
    });
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers');
                const data = await response.json();
                console.log("Fetched customers:", data);
                
                if (data._embedded && Array.isArray(data._embedded.customers)) {
                    setCustomers(data._embedded.customers);
                } else {
                    console.error("Expected an array of customers but got:", data);
                    setCustomers([]);
                }
            } catch (error) {
                console.error('Error fetching customers:', error);
                setCustomers([]);
            }
        };

        fetchCustomers();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setTraining(prevTraining => ({
            ...prevTraining,
            [name]: value
        }));
    };

    const handleCustomerChange = (event) => {
        setTraining(prevTraining => ({
            ...prevTraining,
            customer: event.target.value
        }));
    };

    const addTraining = () => {
        const formattedTraining = {
            ...training,
            date: new Date(training.date).toISOString(),
        };

        console.log("Training data to save:", formattedTraining);
        props.saveTraining(formattedTraining);
        handleClose();
    };

    return (
        <div>
            <Button style={{ margin: 10, marginLeft: 0 }} variant="outlined" color="primary" onClick={handleClickOpen}>
                Add training
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Training</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="date"
                        type="datetime-local"
                        value={training.date}
                        onChange={handleInputChange}
                        //label="Date"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        name="duration"
                        value={training.duration}
                        onChange={handleInputChange}
                        label="Duration"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        name="activity"
                        value={training.activity}
                        onChange={handleInputChange}
                        label="Activity"
                        fullWidth
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="customer-select-label">Customer</InputLabel>
                        <Select
                            labelId="customer-select-label"
                            value={training.customer}
                            onChange={handleCustomerChange}
                        >
                            {Array.isArray(customers) && customers.length > 0 ? (
                                customers.map(customer => (
                                    <MenuItem key={customer._links.self.href} value={customer._links.self.href}>
                                        {customer.firstname} {customer.lastname}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No customers available</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={addTraining} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}