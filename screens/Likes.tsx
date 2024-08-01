import { ISeePhotoLikesData, ISeePhotoLikesUser, ISeePhotoLikesVars, SharedStackNavParamList } from "../types";
import { FlatList, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import ScreenLayout from "../components/ScreenLayout";
import UserRow from "../components/UserRow";

const SEE_PHOTO_LIKES_QUERY = gql`
    query seePhotoLikes($photoId:Int!, $offset:Int!) {
        seePhotoLikes(photoId:$photoId, offset:$offset) {
            id
            username
            avatar
            isFollowing
            isMe
        }
    }
`

interface IRenderItemProps {
    item: ISeePhotoLikesUser
}

type Props =  NativeStackScreenProps<SharedStackNavParamList, 'Likes'>;

export default function Likes( { route: { params }, navigation } : Props ) {

    const { photoId } = params;
    const [ refreshing, setRefreshing ] = useState(false);

    // console.log("photoId", photoId);

    
    const { data, loading, error, refetch, fetchMore } = useQuery<ISeePhotoLikesData, ISeePhotoLikesVars>(SEE_PHOTO_LIKES_QUERY, {
        variables: {
            photoId:photoId,
            offset:0
        },
        skip: !photoId,
        // photoId가 존재하지 않으면 쿼리를 스킵함.
        // fetchPolicy: 'network-only'
    });

    // console.log(data)

    const refreshFn = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }

    const renderItemFn = ({ item }:IRenderItemProps) => {
        return <UserRow {...item} />;
        }

    useEffect(() => {
        refetch();
    }, []);
    // 좋아요 누르고 (캐시 반영) 바로 Likes로 들어오면 (캐시만 반영되므로) 매 번 fetch 해줌.
    // toggleLike에서 매 번 cache.modify 해줘도 괜찮겠지만, 이건 그럴 필요 없을 듯. 어차피 Infinite scroll적용 중이니.

    return (
        <ScreenLayout loading={loading}>
            {/* <Text style={{color:"white", padding:10}}>좋아요</Text> */}
            <FlatList 
                data={data?.seePhotoLikes}
                // 가져오는 데이터를 정의
                renderItem={renderItemFn}
                // 데이터를 가져와 렌더링하는 함수를 정의.
                keyExtractor={item => item.id.toString()}
                // react 에서 .map 을 할 때 key 가 필요했던 것처럼, ISeeFeeData의 각각의 Photo에서 ID를 추출하고 있음.
                
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={refreshFn}
                // 위에서 아래로 당겼을 때 새로고침 효과. infinite Scroll 할 때 myCursor를 주는 듯.
                style={{width:"100%"}}
                ItemSeparatorComponent={() => <View style={{width:"100%", height:0.5, backgroundColor:"rgba(255,255,255,0.2)"}}></View>}
                // 맨 위, 맨 아래 컴포넌트에는 적용되지 않음.
                onEndReached={() => fetchMore({
                    variables: {
                        photoId:photoId,
                        offset: data?.seePhotoLikes.length || 0
                        // 다음은 백엔드에서 처음 take 한 만큼을 offset으로 설정하여 skip하고 받아볼 수 있게 되므로 3개 생략 3개 로드 3개 생략 3개 로드 반복 가능
                    },
                })}
                onEndReachedThreshold={0.01}
                // 스크롤바가 리스트의 끝이라고 인식하는 곳이 어디쯤인 지 설정할 수 있음. 마지막 데이터의 끝 기준.

            />
        </ScreenLayout>
    )
}