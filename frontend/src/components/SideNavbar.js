import { Drawer, List, ListItem, ListItemIcon, ListItemText, Button, Badge, } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext';

// icon imports
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
const drawerWidth = 260

const classes = {
    drawer: {
        width: drawerWidth,
        ".MuiDrawer-paper": {
            width: drawerWidth,
        },
    },
    root: {
        display: 'flex'
    },
    page: {
        background: '#f9f9f9',
        width:'100%',
    },
    active: {
        background: '#f4f4f4'
    },
    appbar: {
        width: `calc(100% - ${drawerWidth}px)`,
        background: 'white',
        color: 'black'
    },
    sidebarLogo: {
        width: '25%'
    }
}

const SideNavbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { logout } = useLogout()
    const { user } = useAuthContext()

    let menuItems = [
        {
            text: 'Profile',
            icon: <AccountCircleOutlinedIcon />,
            path: '/profile'
        },
        {
            text: 'Dashboard',
            icon: <GridViewOutlinedIcon />,
            path: '/'
        },
        {
            text: 'View Your Consultations',
            icon: <SearchOutlinedIcon />,
            path: '/view-consultations'
        }
    ]

    if (user.role === 1) {
        menuItems.push(
            {
                text: 'Create a Consultation',
                icon: <AddCircleOutlineOutlinedIcon />,
                path: '/create-consultation-student'
            }
        )
    }

    if (user.role === 2) {
        menuItems.push(
            {
                text: 'Approve Consultations',
                icon: <AddCircleOutlineOutlinedIcon />,
                path: '/create-consultation-professor'
            }
        )
    }

    

    const handleClick = () => {
        logout()
    }

    return (
        <Drawer 
            sx={classes.drawer}
            variant="permanent"
            anchor="left"
        >
            
            <img src="cpe.png" alt="cpe logo" className={classes.sidebarLogo}></img>

            {/* list of links */}
            <List sx={{flexGrow: 1}}>
                {menuItems.map(item => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => navigate(item.path)}
                        sx={location.pathname === item.path ? classes.active : null}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text}></ListItemText>
                    </ListItem>
                ))}

                {/* TODO: remove this if you cannot make the number work */}
                <ListItem
                    button
                    onClick={() => navigate('/inbox')}
                    sx={location.pathname === '/inbox' ? classes.active : null}
                >
                    <ListItemIcon>
                        {/* TODO: make value dynamic */}
                        <Badge badgeContent={10} color="primary">
                            <EmailOutlinedIcon />
                        </Badge>
                    </ListItemIcon>
                    <ListItemText primary="Inbox"></ListItemText>
                </ListItem>
            </List>
                        
            <Button
                onClick={handleClick}
                variant="contained"
                size="large"
                sx={{margin: '10px'}}
            >
                Logout
            </Button>

        </Drawer>
    );
}
 
export default SideNavbar;