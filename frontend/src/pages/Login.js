import { Box, Card, TextField, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

const Login = () => {
    const theme = useTheme()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log(email, password)
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
                </form>
            </Card>
        </Box>
    );
}
 
export default Login;