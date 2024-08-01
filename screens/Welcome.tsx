import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TouchableOpacity, Text, View } from "react-native";
import styled from "styled-components/native"
import { LoggedOutStackNavParamList } from "../types";
import { colors } from "../colors";
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";

interface ICreateAccountProps {
    disabled:boolean;
}

const CreateAccount = styled.TouchableOpacity`
    background-color: ${colors.blue};
    padding: 12px 10px;
    margin-top: 20px;
    border-radius: 3px;
    width: 100%;
    opacity: ${(props) => props.disabled ? "0.4" : "1"};
`;
const CreateAccountText = styled.Text`
    color: white;
    font-weight: 600;
    text-align: center;
`;

const LoginLink = styled.Text`
    color: ${colors.blue};
    font-weight: 600;
    margin-top: 20px;
    text-align: center;
`;


type Props = NativeStackScreenProps<LoggedOutStackNavParamList, 'Welcome'>;

export default function Welcome({ navigation } : Props) {

    const goToCreateAccount = () => navigation.navigate('CreateAccount');
    const goToLogIn = () => navigation.navigate('LogIn', {
        username:"",
        password:""
    });

    return (
            <AuthLayout>
                <AuthButton onPress={goToCreateAccount} disabled={false} loading={false} text={"Create Account"} />
                <TouchableOpacity onPress={goToLogIn}>
                    <LoginLink>
                        LogIn
                    </LoginLink>
                </TouchableOpacity>
            </AuthLayout>
        )
}