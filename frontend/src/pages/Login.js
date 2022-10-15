import { Box, Card, TextField, Button, Typography, Alert, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, error, isLoading } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await login(email, password)
    }

    const routeChange = () => {
        const path = '/register'
        navigate(path)
    }

    return (
        <Box sx={{padding: `${theme.spacing(10)}`}}>
            <Card sx={{
                width: '33%',
                margin: 'auto',
                padding: `${theme.spacing(3)}`
            }}
                elevation = {3}
            >
                <Typography variant="h4" sx={{margin: 'auto', textAlign: 'center', marginBottom: `${theme.spacing(2)}`}}>Login</Typography>
                <img src="cpe.png" alt="cpe logo" className="loginLogo"></img>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Enter email" 
                        variant="standard"
                        type="email"
                        fullWidth
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <TextField
                        label="Enter password" 
                        variant="standard"
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
                            width: '100%'
                        }}
                        type="submit"
                        variant="contained">
                        Login
                    </Button>

                    <Link 
                        sx={{
                        marginTop: '10px'
                    }} 
                        href="#" 
                        onClick={routeChange} 
                        color='#000000'
                        variant='body2'
                        >
                        No account? Register Here!
                    </Link>

                    { error && <Alert severity="error">{error}</Alert>}

                </form>
        
                

            </Card>
        </Box>
    );
}
 
export default Login;