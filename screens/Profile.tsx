import { ISeeProfileData, ISeeProfilePhoto, ISeeProfileVars, SharedStackNavParamList } from "../types";
import { FlatList, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { PHOTO_FRAGMENT } from "../fragments";
import ScreenLayout from "../components/ScreenLayout";

const SEE_PROFILE_QUERY = gql`
    query seeProfile($username:String!, $offset:Int!) {
        seeProfile(username:$username) {
            id
            username
            firstName
            lastName
            avatar
            bio
            totalFollowers
            totalFollowings
            photos(offset:$offset) {
                ...PhotoFragment
            }
            isMe
            isFollowing
        }
    }
    ${PHOTO_FRAGMENT}
`

interface IRenderItemProps {
    item: ISeeProfilePhoto
}

type Props =  NativeStackScreenProps<SharedStackNavParamList, 'Profile'>;

export default function Profile( { route:{ params }, navigation } : Props ) {

    const { username } = params;
    const [ refreshing, setRefreshing ] = useState(false);

    useEffect(() => {
        if(username) {
            navigation.setOptions({
                // 이런 식으로 스크린 옵션을 변경해줄 수도 있음.
                title: username
            })
        }
    }, []);

    const { data , loading, error, refetch, fetchMore } = useQuery<ISeeProfileData, ISeeProfileVars>(SEE_PROFILE_QUERY, {
        variables: {
            username: username,
            offset:0
        },
    });

    const refreshFn = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }

    const renderItemFn = ({ item }:IRenderItemProps) => {
    return <View><Text style={{color:"white"}}>{item.id}</Text></View>
    }


    return (
        <ScreenLayout loading={loading}>
            <FlatList 
                data={data?.seeProfile.photos}
                // 가져오는 데이터를 정의
                renderItem={renderItemFn}
                // 데이터를 가져와 렌더링하는 함수를 정의.
                keyExtractor={item => item.id.toString()}
                // react 에서 .map 을 할 때 key 가 필요했던 것처럼, IseeProfile.photosata의 각각의 Photo에서 ID를 추출하고 있음.
                
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={refreshFn}
                // 위에서 아래로 당겼을 때 새로고침 효과. infinite Scroll 할 때 myCursor를 주는 듯.

                onEndReached={() => fetchMore({
                    variables: {
                        offset: data?.seeProfile.photos.length || 0
                        // 다음은 백엔드에서 처음 take 한 만큼을 offset으로 설정하여 skip하고 받아볼 수 있게 되므로 3개 생략 3개 로드 3개 생략 3개 로드 반복 가능
                    },
                })}
                onEndReachedThreshold={0.01}
                // 스크롤바가 리스트의 끝이라고 인식하는 곳이 어디쯤인 지 설정할 수 있음. 마지막 데이터의 끝 기준.

            />
        </ScreenLayout>
    )
}