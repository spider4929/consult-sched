import { Box, Drawer, Typography, List, ListItem, ListItemIcon, 
    ListItemText, AppBar, Toolbar, Button, Badge } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { format } from 'date-fns'

// icon imports
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

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
    date: {
        flexGrow: 1
    },
    sidebarLogo: {
        width: '100%'
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
            icon: <SearchOutlinedIcon />,
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


    return ( 
        <Box sx={classes.root}>
            {/* app bar */}
            <AppBar 
                sx={classes.appbar}
                elevation={0}
            >
                <Toolbar>
                    <Typography sx={classes.date}>
                        This is a top app bar. Today is the { format(new Date(), 'do MMMM Y') }
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
                <List>
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
                            <Badge badgeContent={4} color="primary">
                                <EmailOutlinedIcon />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary="Inbox"></ListItemText>
                    </ListItem>
                </List>
                            
                {/* TODO: Flush button to the bottom */}
                <Button 
                    variant="text"
                    size="large"

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
 
export default Layout;