import React from 'react'
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, useThemeProps } from '@mui/material';


export default function AddCustomer(props) {
    const [open, setOpen] = React.useState(false);
    const [customer, setCustomer] = React.useState({
        firstname: '', lastname: '', streetaddress: '', postcode: '', city: '', email: '', phone: '', 
    })

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handelInputChange = (event) => {
        setCustomer({...customer, [event.target.name]: event.target.value})
    }

    const addCustomer = () => {
        props.saveCustomer(customer);
        handleClose();
    }

    return (
        <div>
            <Button style={{margin: 10, marginLeft: 0}} variant="outlined" color="primary" onClick={handleClickOpen}>
                Add customer
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                    <TextField
                    autoFocus
                    margin="dense"
                    name="firstname"
                    value={customer.firstname}
                    onChange={e => handelInputChange(e)}
                    label="First Name"
                    fullWidth
                    />
                    <TextField
                    margin="dense"
                    name="lastname"
                    value={customer.lastname}
                    onChange={e => handelInputChange(e)}
                    label="Last Name"
                    fullWidth
                    />
                    <TextField
                    margin="dense"
                    name="streetaddress"
                    value={customer.streetaddress}
                    onChange={e => handelInputChange(e)}
                    label="Street Address"
                    fullWidth
                    />
                    <TextField
                    margin="dense"
                    name="postcode"
                    value={customer.postcode}
                    onChange={e => handelInputChange(e)}
                    label="Post Code"
                    fullWidth
                    />
                    <TextField
                    margin="dense"
                    name="city"
                    value={customer.city}
                    onChange={e => handelInputChange(e)}
                    label="City"
                    fullWidth
                    />
                    <TextField
                    margin="dense"
                    name="email"
                    value={customer.email}
                    onChange={e => handelInputChange(e)}
                    label="Email"
                    fullWidth
                    />
                    <TextField
                    margin="dense"
                    name="phone"
                    value={customer.phone}
                    onChange={e => handelInputChange(e)}
                    label="Phone"
                    fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={addCustomer} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}