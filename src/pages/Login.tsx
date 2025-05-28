import { Stack } from '@fluentui/react';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IUser } from '../Types';
import axios from 'axios';
import { Uri } from '../Uri';
import imgLogin from "../../public/img-login.webp"
import stockWise from "../../public/stockwise.webp"
interface ILogin {
    authentication: Function,
}
const Login: React.FC<ILogin> = (props: ILogin) => {
    // const { openNotification, contextHolder } = useNotification();
    const history = useHistory();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async (e: any) => {
        e.preventDefault();
        if (!!!username || !!!password) {
            message.warning("Please fill username and password!");
            return;
        }
        try {
            const requestUrl = `${Uri.rootUri}:${Uri.serverPort}${Uri.login}`;
            const body = {
                username: username,
                password: password
            }
            const res = await axios.post(requestUrl, body);
            const user: IUser = res.data.data;
            if (user) {
                localStorage.setItem("accessToken", user.accessToken!);
                setUsername("");
                setPassword("");
                history.push('Index/Landing');
                message.success("Login successfully");
            } else {
                message.error("Incorrect username or password!");
            }
        } catch (error) {
            console.log(error);
        }

    };
    useEffect(() => {
        props.authentication();
    }, []);

    return (
        <div>
            {/* {contextHolder} */}
            <div className="login-container">
                <div className="left-section">
                    <div className="illustration">
                        {/* Replace with actual image when available */}
                        <img src={imgLogin} alt="Stockwise" className="illustration-image" />
                        <h2>TURN INVENTORY INTO INSIGHT</h2>
                        <p>Smarter stock means smarter decisions!</p>
                    </div>
                </div>
                <div className="right-section">
                    <div className="login-box">
                        <img src={stockWise} />
                        <h2>Login</h2>
                        <p>Optimize your inventory. Let's begin!</p>
                        <form onSubmit={handleLogin}>
                            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value || "")} />
                            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value || "")} />
                            <Stack horizontalAlign="center">
                                <button type="submit">Sign in</button>
                            </Stack>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
