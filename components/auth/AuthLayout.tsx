import { KeyboardAvoidingView, Platform } from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../DismissKeyboard";

const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: black;
    padding: 0px 40px;
`;

const Logo = styled.Image`
    max-width: 50%;
    width: 100%;
    height: 100px;
    /* margin-bottom: 20px; */
    margin: 0 auto;
`;

interface IAuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }:IAuthLayoutProps) {


    return (
        <DismissKeyboard>
            <Container>
                <KeyboardAvoidingView 
                    style={{
                        // flex: 1,
                        width: "100%"
                    }}
                    behavior="padding" 
                    keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} 
                >
                    <Logo resizeMode="contain" source={require("../../assets/instawhitelogo.png")} />
                    { children }
                </KeyboardAvoidingView>
            </Container>
        </DismissKeyboard>
    )
}