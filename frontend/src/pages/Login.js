import { Box, TextField, Button, Typography, Alert, Link, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, error } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await login(email, password)
    }

    const routeChange = () => {
        const path = '/register'
        navigate(path)
    }

    return <>
      <Box
        height="100vh"
        sx={{
          display: 'flex',
          flex: '1 1 auto',

        }}
      >
        <Grid
          container
          sx={{ flex: '1 1 auto' }}
        >
          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              backgroundColor: 'neutral.50',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
                <Box
                sx={{
                    flex: '1 1 auto',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center'
                }}
                >
                <Box
                    sx={{
                    maxWidth: 500,
                    px: 3,
                    py: '100px',
                    width: '100%'
                    }}
                >
                    <Typography variant="h4">
                        Sign in
                    </Typography>
                    <Typography variant="body2" sx={{pb: 3}}>
                        Sign in to our consultation platform
                    </Typography>
                    <form onSubmit={handleSubmit}>
                            <TextField
                                label="Enter email" 
                                variant="outlined"
                                type="email"
                                fullWidth
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                sx={{pb: 2}}
                            />
                            <TextField
                                label="Enter password" 
                                variant="outlined"
                                id="standard-password-input"
                                type="password"
                                fullWidth
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />

                            <Button 
                                sx={{
                                    marginTop: `${theme.spacing(3)}`, 
                                    width: '100%',
                                    mb: 2
                                }}
                                type="submit"
                                variant="contained">
                                Login
                            </Button>

                            <Link 
                                href="#" 
                                onClick={routeChange} 
                                color='#000000'
                                variant='body2'
                                >
                                No account? Register Here!
                            </Link>

                            { error && <Alert severity="error">{error}</Alert>}
                        </form>
                </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              alignItems: 'center',
              background: 'radial-gradient(50% 50% at 50% 50%, #09590a 0%, #1a3d0f 100%)',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              '& img': {
                maxWidth: '100%'
              }
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography
                align="center"
                color="inherit"
                sx={{
                  fontSize: '24px',
                  lineHeight: '32px',
                  mb: 1
                }}
                variant="h1"
              >
                Computer Engineering Consultation Scheduler
              </Typography>
              <Typography
                align="center"
                sx={{ mb: 3 }}
                variant="subtitle1"
              >
                Create and approve consultations with your instructors
              </Typography>
              <img
                alt=""
                src="cpe.png"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
}
 
export default Login;