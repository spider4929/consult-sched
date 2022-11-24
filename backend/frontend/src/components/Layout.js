import { Box, Typography, AppBar, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { format } from 'date-fns'
import { useAuthContext } from "../hooks/useAuthContext";
import SideNavbar from './SideNavbar'

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
    const theme = useTheme()
    const { user } = useAuthContext()

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
                        <Typography sx={{flexGrow: 1}}>Computer Engineering Consultation App</Typography>
                        <Typography>
                            {/* Day, MM/DD/YYYY */}
                            { format(new Date(), 'iiii, LLLL dd, RRRR') }
                        </Typography>
                    </Toolbar>
                </AppBar>
    
    
                {/* side drawer */}
                <SideNavbar />
    
                {/* content body */}
        
                <Box sx={{ 
                    background: '#f9f9f9',
                    width:'100%',
                    height:'100vh'
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
            <Box sx={{ padding: `${theme.spacing(1)}`}}>
                {children}
            </Box>
        )
    }
    
}
 
export default Layout;