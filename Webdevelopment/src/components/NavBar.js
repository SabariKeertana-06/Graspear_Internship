import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../services/Auth';
import { Drawer, Button, List, ListItem, ListItemText, Divider, Collapse, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { UserDetailsApi } from '../services/Api';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import HelpIcon from '@mui/icons-material/Help';
import './NavBar.css';

export default function NavBar(props) {
    const [open, setOpen] = useState(false);
    const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await UserDetailsApi();
                if (response.data.users.length > 0) {
                    const userEmail = response.data.users[0].email;
                    setIsAdmin(userEmail.endsWith('@admin.com'));
                } else {
                    console.error("No user details found.");
                }
            } 
            catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        if (isAuthenticated()) {
            fetchUserDetails();
        }
    }, []);

    const toggleDrawer = (isOpen) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(isOpen);
    };

    const handleAccountSettingsClick = (event) => {
        event.stopPropagation();
        setAccountSettingsOpen(!accountSettingsOpen);
    };

    const DrawerList = () => (
        <div
            className="drawer-list"
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)} >
            <List>
                <ListItem>
                    <MenuIcon /> &nbsp; &nbsp;
                    <ListItemText primary="Menu" />
                </ListItem>
                <Divider style={{ border: '2px solid hsl(177, 99%, 28%)' }} />
                <ListItem button component={Link} to ="/"><HomeIcon fontSize='small' sx={{color:'black'}}/>&nbsp; &nbsp; &nbsp; &nbsp;
                    <ListItemText primary="Home"/>
                </ListItem>
                {!isAuthenticated() && (
                    <ListItem button component={Link} to="/register"><AppRegistrationIcon fontSize='small' sx={{color:'black'}}/>&nbsp; &nbsp;
                        <ListItemText primary="Register" />
                    </ListItem>
                )}
                {!isAuthenticated() && (
                    <ListItem button component={Link} to="/login"><LoginIcon fontSize='small' sx={{color:'black'}}/>&nbsp; &nbsp;
                        <ListItemText primary="Login" />
                    </ListItem>
                )}
                {isAuthenticated() && isAdmin && (
                    <ListItem button component={Link} to="/admin-dashboard">
                        <ListItemIcon><AdminPanelSettingsIcon fontSize='small' sx={{ color: 'black' }} /></ListItemIcon>
                        <ListItemText primary="Admin Panel" />
                    </ListItem>
                )}
                {isAuthenticated() && (
                    <ListItem button component={Link} to="/dashboard">
                        <ListItemIcon><DashboardIcon fontSize='small' sx={{ color: 'black' }} /></ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                )}
                {isAuthenticated() && (
                    <>
                        <ListItem button onClick={handleAccountSettingsClick}>
                            <ListItemIcon><ManageAccountsIcon fontSize='small' sx={{ color: 'black' }} /></ListItemIcon>
                            <ListItemText primary="Account Settings" />
                            {accountSettingsOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={accountSettingsOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button component={Link} to="/reset-password" style={{ paddingLeft: 32 }}>
                                    <ListItemText primary="Reset Password" /><EditIcon fontSize='small' />
                                </ListItem>
                                <ListItem button component={Link} to="/delete" style={{ paddingLeft: 32 }}>
                                    <ListItemText primary="Delete Account" /><DeleteIcon fontSize='small' />
                                </ListItem>
                                <ListItem button component={Link} to="/update-profile" style={{ paddingLeft: 32 }}>
                                    <ListItemText primary="Update Profile Name" /><AccountCircleIcon fontSize='small' />
                                </ListItem>
                            </List>
                        </Collapse>
                    </>
                )}
                {isAuthenticated()&&(
                    <ListItem button component={Link} to="/how-to-use">
                        <ListItemIcon><HelpIcon fontSize='small' sx={{color:'black'}}/></ListItemIcon>
                        <ListItemText primary='Guide to Use'/>
                    </ListItem>
                )}
                {isAuthenticated() && (
                    <ListItem button onClick={props.logoutUser}>
                        <ListItemIcon><LogoutIcon fontSize='small' sx={{ color: 'black' }} /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                )}
            </List>
        </div>
    );

    return (
        <div className='mynavbar'>
            <Button className="drawer-button" onClick={toggleDrawer(true)}><MenuIcon  sx={{color:'black'}}/></Button>
            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                {DrawerList()}
            </Drawer>
        </div>
    );
}
