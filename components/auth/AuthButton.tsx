import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import styled from "styled-components/native"
import { colors } from "../../colors";

const Button = styled.TouchableOpacity`
    background-color: ${colors.blue};
    padding: 15px 10px;
    margin-top: 20px;
    border-radius: 3px;
    width: 100%;
    opacity: ${(props) => props.disabled ? "0.4" : "1"};
`;
const ButtonText = styled.Text`
    color: white;
    font-weight: 600;
    text-align: center;
`;

interface IAuthButtonProps {
    onPress: () => void;
    disabled: boolean;
    loading: boolean;
    text: string;
}

export default function AuthButton( props : IAuthButtonProps ) {
    return (
        <Button onPress={props.onPress} disabled={props.disabled}>
            {props.loading ? <ActivityIndicator color="white" /> : <ButtonText>{props.text}</ButtonText>}
        </Button>
    )
}