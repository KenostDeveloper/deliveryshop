export const getChangePasswordPattern = (link: string) => {
    return `<!DOCTYPE html>
            <html>
                <head>
                    <title>Восстановление пароля</title>
                    <style>
                        .pattern {
                            background-color: white;
                            border-radius: 25px;
                        
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            gap: 25px;
                        
                            margin-top: 50px;
                            padding: 50px;
                        }
                        
                        .logo {
                            color: #5D576B;
                            font-size: 50px;
                            font-style: normal;
                            font-weight: 800;
                            line-height: normal;
                            animation: loading 2s linear infinite;
                        }
                        
                        .logo span {
                            color: #FFF500;
                            font-size: inherit;
                            font-style: normal;
                            font-weight: 800;
                            line-height: normal;
                        }
                        
                        .title {
                            font-size: 40px;
                            font-weight: 700;
                        }
                        
                        .button {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        
                            border-radius: 8px;
                            padding: 0 40px;
                            height: 50px;
                        
                            white-space: nowrap;
                        
                            background-color: #FFF500;
                            margin-left: 20px;
                            font-weight: bold;
                        }
                    
                    </style>
                </head>
                <body>
                    <section class="pattern">
                        <a href="${process.env.NEXTAUTH_BASIC_URL}" style="text-decoration:none">
                            <div class="logo" style="
                                text-align: center;
                                color: #5D576B;
                                font-size: 50px;
                                font-style: normal;
                                font-weight: 800;
                                line-height: normal;
                                animation: loading 2s linear infinite;
                                margin-bottom: 50px;
                            ">
                                quick<span style="
                                    color: #FFF500;
                                    font-size: inherit;
                                    font-style: normal;
                                    font-weight: 800;
                                    line-height: normal;
                                ">shop</span>
                            </div>
                        </a>
                        <h1 class="title" style="
                            text-align: center;
                            font-size: 40px;
                            font-weight: 700;
                        ">Восстановление пароля</h1>
                        <p class="text" style="
                            text-align: center;    
                        ">
                            Нажмите на кнопку, чтобы восстановить пароль
                        </p>
                        <div style="
                            text-align: center;
                        ">
                            <a class="button" href="${link}" style="
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                border-radius: 8px;
                                padding: 0 40px;
                                height: 50px;
                                white-space: nowrap;
                                background-color: #FFF500;
                                margin-left: 20px;
                                font-weight: bold;
                                color: black;
                            ">
                                Сменить пароль
                            </a>
                        </div>
                    </section>
                </body>
            </html>
            `;
};
