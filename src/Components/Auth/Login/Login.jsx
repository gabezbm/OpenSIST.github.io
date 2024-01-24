import React, {useState} from "react";
import {Form, Link} from 'react-router-dom';
import "./Login.css"
import {login} from "../../../Data/UserData";
import {Button, TextField, Typography, Box, FormControl, InputAdornment, Input, InputLabel} from "@mui/material";


export async function action({request}) {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');
    return await login(username, password);
}

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <Form method='post' className="login">
            <Typography variant='h4' sx={{mb: "1rem"}}>用户登录</Typography>
            <FormControl variant="standard" sx={{width: '100%'}}>
                <InputLabel required>上科大邮箱前缀</InputLabel>
                <Input
                    fullWidth
                    variant='standard'
                    id='username'
                    name='username'
                    value={username}
                    endAdornment={<InputAdornment position="end">@shanghaitech.edu.cn</InputAdornment>}
                    onChange={(e) => setUsername(e.target.value.split('@')[0])}
                    required
                />
            </FormControl>
            <TextField
                fullWidth
                variant='standard'
                label='密码'
                type="password"
                id='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <Box sx={{display: 'flex', justifyContent: "space-between", width: "100%"}}>
                <Link to="/register">注册账号</Link>
                <Link to="/reset">忘记密码?</Link>
            </Box>
            <Button fullWidth variant='contained' type='submit'>Login</Button>
        </Form>
    );
}

export default Login;