import { View } from "react-native";
import styled from "styled-components/native";
import { colors } from "../colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { UserRowNavParamList } from "../types";

const Column = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
`;
const Avatar = styled.Image`
    width: 40px;
    height: 40px;
    border-radius: 25px;
    margin-right: 10px;
`;
const Username = styled.Text`
    font-weight: 600;
    color: white;
`;

const Wrapper = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding: 5px 10px;
`;
const FollowBtn = styled.TouchableOpacity`
    border: none;
    background-color: ${colors.blue};
    border-radius: 4px;
    padding: 5px 10px;
    justify-content: center;
    align-items: center;
`;
const FollowBtnText = styled.Text`
    color: white;
    text-align: center;
    font-weight: 600;
`;

interface IUserRowProps {
    id:number;
    avatar?:string;
    username:string;
    isFollowing:boolean;
    isMe:boolean;
}

type UserRowNavigationProp = NavigationProp<UserRowNavParamList, 'UserRow'>;

export default function UserRow( props : IUserRowProps ) {

    const navigation = useNavigation<UserRowNavigationProp>();

    const goToProfile = () => {
        navigation.navigate("Profile", { id:props.id, username:props.username })
    }

return (
    <Wrapper>
        <Column onPress={() => goToProfile()}>
                <Avatar source={{ uri: props.avatar }} />
                <Username>{props.username}</Username>
        </Column>
            {!props.isMe ? (
                    <FollowBtn>
                        <FollowBtnText>{props.isFollowing ? "Unfollow" : "Follow"}</FollowBtnText>
                    </FollowBtn>
                ) : null}
    </Wrapper>
);
}