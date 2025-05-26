import { Stack } from '@fluentui/react';
import useNotification from 'antd/es/notification/useNotification';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';
// import { getAll, userStore } from '../utils/IndexedDB';
// import { IUser } from '../Types';
// import { hashPassword } from '../utils/helper';
// import { useNotification } from '../hooks/useNotification';
interface ILogin {
    authentication: Function,
    // setUser: Function
}
const Login: React.FC<ILogin> = (props: ILogin) => {
    // const { openNotification, contextHolder } = useNotification();
    const history = useHistory();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // const handleLogin = async (e) => {
    //     e.preventDefault();
    //     if (!!!username || !!!password) {
    //         openNotification({
    //             message: "Warning",
    //             description: "Please fill username and password!",
    //             showProgress: true,
    //             pauseOnHover: false,
    //             notificationType: "warning"
    //         });
    //         return;
    //     }
    //     try {
    //         const userData: IUser[] = await getAll(userStore);
    //         const user = userData?.find((item: IUser) => item.username === username && item.password === hashPassword(password));
    //         if (user) {
    //             localStorage.setItem("user", JSON.stringify(user));
    //             // props.setUser(user)
    //             setUsername("");
    //             setPassword("");
    //             history.push('Index/Landing');
    //         } else {
    //             openNotification({
    //                 message: "Error",
    //                 description: "Incorrect username or password!",
    //                 showProgress: true,
    //                 pauseOnHover: false,
    //                 notificationType: "error"
    //             });
    //         }
    //     } catch (error) {
    //         // displayError(String(error))
    //     }

    // };
    // useEffect(() => {
    //     props.authentication();
    // }, []);

    return (
        <div>
            {/* {contextHolder} */}
            <div className="login-container">
                <div className="left-section">
                    <div className="illustration">
                        {/* Replace with actual image when available */}
                        <img src="/images/social_friends.png" alt="People expanding social circle" className="illustration-image" />
                        <h2>TURN INVENTORY INTO INSIGHT</h2>
                        <p>Smarter stock means smarter decisions!</p>
                    </div>
                </div>
                <div className="right-section">
                    <div className="login-box">
                        <img src="/images/Logo.webp" />
                        <h2>Login</h2>
                        <p>Optimize your inventory. Let's begin!</p>
                        {/* <form onSubmit={handleLogin}> */}
                        <form onSubmit={() => { }}>
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
