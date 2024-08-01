import styled from "styled-components/native";
import { Image, TouchableOpacity, useWindowDimensions } from "react-native";
import { useEffect, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { IToggleLikeData, IToggleLikeVar, PhotoContainerNavParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { gql, useMutation } from "@apollo/client";

const Container = styled.View``;

const Header = styled.TouchableOpacity`
    padding: 10px;
    flex-direction: row;
    align-items: center;
`;

const UserAvatar = styled.Image`
    margin-right: 10px;
    width: 25px;
    height: 25px;
    border-radius: 12.5px;
`;

const Username = styled.Text`
    color: white;
    font-weight: 600;
`;
const File = styled.Image``;

const Actions = styled.View`
    flex-direction: row;
    align-items: center;
`;
const Action = styled.TouchableOpacity`
    margin-right: 10px;
`;
const Caption = styled.View`
    flex-direction: row;
`;
const CaptionText = styled.Text`
    color: white;
    margin-left: 5px;
`;
const Likes = styled.Text`
    color: white;
    margin: 7px 0px;
    font-weight: 600;
`;
const ExtraContainer = styled.View`
    padding: 10px;  
`;

const TOGGLE_LIKE_MUTATION = gql`
    mutation toggleLike($photoId:Int!) {
        toggleLike(photoId:$photoId) {
            ok
            error
        }
    }
`

interface IPhotoContainerUser {
    id:number;
    username: string;
    avatar?: string;
  }

interface IPhotoContainerProps {
    id: number;
    user: IPhotoContainerUser;
    file: string;
    caption?: string;
    // comments: ISeeFeedComment[];
    totalLikes: number;
    // totalComments: number;
    // createdAt: string; // createdAt은 일반적으로 ISO 문자열입니다.
    // isMine: boolean;
    isLiked: boolean;
  }

type PhotoContainerNavigationProp = NavigationProp<PhotoContainerNavParamList, 'PhotoContainer'>;


export default function PhotoContainer( props : IPhotoContainerProps ) {

const { width:windowWidth, height:windowheight } = useWindowDimensions();
// 화면 크기가 변경될 때 너비와 높이 값을 자동으로 업데이트 함. 화면 창의 너비와 높이 값을 얻을 수 있음.
const [ imageHeight, setImageHeight ] = useState(windowheight-500);
const navigation = useNavigation<PhotoContainerNavigationProp>();
// Stack Nav, Tab Nav 가 아니라 컴포넌트에서 특정 화면으로 넘어가고 싶을 때 사용하는 듯.
// 말하자면, RN에는 STACK Nav, Tab Nav, 일반 Nav가 있는 듯.
// 해당 컴포넌트에서 넘어갈 수 있는 화면 이름을 타입으로 정의해야.
// 이런 식으로 --> type PhotoContainerNavigationProp = NavigationProp<PhotoContainerNavParamList, 'PhotoContainer'>;

const [ toggleLike, { data:ToggleLikeData, loading:ToggleLikeLoading, error:ToggleLikeError }] = useMutation<IToggleLikeData, IToggleLikeVar>(TOGGLE_LIKE_MUTATION, {
    variables: {
        photoId:props.id
    },
    onCompleted: (data) => {

    },
    onError: (error) => {
        console.log(error)
    },

    update: (cache, result) => {
        if (result.data && result.data.toggleLike) {
            const { ok } = result.data.toggleLike;
            // Update cache logic
            if(ok) {

                cache.modify({
                    id: `Photo:${props.id}`,
                    fields: {
                        isLiked(prev) {
                            return !prev
                        },
                        totalLikes(prev, { readField }) {
                            const isLiked = readField<boolean>('isLiked');
                            // totalLikes(prev, { readField }) 함수는 readField를 사용하여 isLiked 필드의 현재 값을 읽어옵니다.
                            return isLiked ? prev - 1 : prev + 1;
                        }
                    }
                })
            }
        }
    }
});

useEffect(() => {
    Image.getSize(props.file, (width, height) => {
        setImageHeight(height/3);
    })
}, [props.file]);

// console.log(`${props.id}-totalLikes:${props.totalLikes}`)

const goToProfile = () => {
    navigation.navigate("Profile", { id:props.user.id, username:props.user.username })
}

const goToComments = () => {
    navigation.navigate("Comments", { photoId:props.id })
}

const goToLikes = () => {
    navigation.navigate("Likes", { photoId:props.id })
}

return (
    <Container>
        <Header onPress={() => goToProfile()}>
            <UserAvatar resizeMode="cover" source={{ uri:props.user.avatar }} />
            <Username>{props.user.username}</Username>
        </Header>
        <File
            resizeMode="cover"
            style={{
            width:windowWidth,
            height: imageHeight
            }}
            source={{ uri: props.file }}
            // react native 에서는 웹에서 사진을 불러오기 위해서 width, height 값이 필수임.
        />
        <ExtraContainer>
            <Actions> 
            <Action onPress={() => toggleLike()} >
                <Ionicons
                    name={props.isLiked ? "heart" : "heart-outline"}
                    color={props.isLiked ? "tomato" : "white"}
                    size={22}
                />
                </Action>
                <Action onPress={() => goToComments()}>
                    <Ionicons name="chatbubble-outline" color="white" size={22} />
                </Action>
            </Actions>
            <TouchableOpacity onPress={() => goToLikes()}>
                <Likes>{props.totalLikes === 1 ? "1 like" : `${props.totalLikes} likes`}</Likes>
            </TouchableOpacity>
            <Caption>
                <TouchableOpacity onPress={() => goToProfile()}>
                    <Username>{props.user.username}</Username>
                </TouchableOpacity>
                <CaptionText>{props.caption}</CaptionText>
            </Caption>
        </ExtraContainer>
    </Container>
);
}