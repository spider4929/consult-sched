import { Box, Card, TextField, Button, Typography } from "@mui/material";
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
                        type="submit"
                        variant="contained">
                        Login
                    </Button>

                    <Button
                        onClick={routeChange}
                        variant="contained">
                        Register
                    </Button>

                    { error && <Card sx={{padding: `${theme.spacing(2)}`, color: 'white', backgroundColor: '#ff4569'}}>{error}</Card>}

                </form>
        
                

            </Card>
        </Box>
    );
}
 
export default Login;