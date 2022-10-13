import { Box, Drawer, Typography, List, ListItem, ListItemIcon, 
    ListItemText, AppBar, Toolbar, Button, Badge, Card, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { format } from 'date-fns'

// icon imports
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// custom CSS for page
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


const Layout = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const theme = useTheme()
    const menuItems = [
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
            text: 'View Consultations',
            icon: <Badge badgeContent={10} color="primary"><SearchOutlinedIcon /></Badge>,
            path: '/view-consultations'
        },
        {
            text: 'Create a Consultation',
            icon: <AddCircleOutlineOutlinedIcon />,
            path: '/create-consultation-student'
        },
        {
            text: 'Create Consultations',
            icon: <AddCircleOutlineOutlinedIcon />,
            path: '/create-consultation-professor'
        }
        // {
        //     text: 'Inbox',
        //     icon: <EmailOutlinedIcon />,
        //     path: '/inbox'
        // }
        
    ]

    // simulates a logged in user
    const user = true;

    // this will display if user is logged in
    if (user) {
        return ( 
            <Box sx={classes.root}>
                {/* app bar */}
                <AppBar 
                    sx={classes.appbar}
                    elevation={0}
                >
                    <Toolbar>
                        {/* TODO: display here the current page */}
                        <Typography sx={{flexGrow: 1}}>Welcome, Ferdinand "Bongbong" Romualdez Marcos Jr., the God-King Emperor of Mankind.</Typography>
                        <Typography>
                            {/* Day, MM/DD/YYYY */}
                            { format(new Date(), 'iiii, LLLL dd, RRRR') }
                        </Typography>
                    </Toolbar>
                </AppBar>
    
    
                {/* side drawer */}
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
                        variant="contained"
                        size="large"
                        sx={{margin: '10px'}}
                    >
                        Logout
                    </Button>
    
                </Drawer>
    
                {/* content body */}
        
                <Box sx={{ 
                    padding: `${theme.spacing(2)}`, 
                    background: '#f9f9f9',
                    width:'100%'
                }}>
                    <Box sx={theme.mixins.toolbar}></Box>
                    {children}
                </Box>
            </Box>
        );
    }

    // this will display if user is not logged in
    else {
        return (
            <Box sx={{ padding: `${theme.spacing(2)}`}}>
                {children}
            </Box>
        )
    }
    
}
 
export default Layout;