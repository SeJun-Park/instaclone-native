
import { ISeeFeedData, ISeeFeedPhoto, ISeeFeedVars, SharedStackNavParamList } from "../types";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { logUserOut } from "../apollo";
import { gql, useQuery } from "@apollo/client";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";
import ScreenLayout from "../components/ScreenLayout";
import PhotoContainer from "../components/PhotoContainer";
import { useState } from "react";

const FEED_QUERY = gql`
query seeFeed($offset:Int!) {
    seeFeed(offset:$offset) {
        ...PhotoFragment
        user {
            id
            username
            avatar
        }
        caption
        comments {
            ...CommentFragment
        }
        createdAt
        isMine
    }
}
    ${PHOTO_FRAGMENT}
    ${COMMENT_FRAGMENT}
`

interface IRenderItemProps {
    item: ISeeFeedPhoto;
  }

type Props =  NativeStackScreenProps<SharedStackNavParamList, 'Feed'>;

export default function Feed( { navigation } : Props ) {

    const [ refreshing, setRefreshing ] = useState(false);

    const { data, loading, error, refetch, fetchMore } = useQuery<ISeeFeedData, ISeeFeedVars>(FEED_QUERY, {
        variables: {
            offset:0
        }
    });
    // console.log(data);


    const refreshFn = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }

    const renderItemFn = ({ item }:IRenderItemProps) => {
    return <PhotoContainer {...item} />;
    }

    return (
        <ScreenLayout loading={loading}>
            <FlatList 
                data={data?.seeFeed}
                // 가져오는 데이터를 정의
                renderItem={renderItemFn}
                // 데이터를 가져와 렌더링하는 함수를 정의.
                keyExtractor={item => item.id.toString()}
                // react 에서 .map 을 할 때 key 가 필요했던 것처럼, ISeeFeeData의 각각의 Photo에서 ID를 추출하고 있음.
                
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={refreshFn}
                // 위에서 아래로 당겼을 때 새로고침 효과. infinite Scroll 할 때 myCursor를 주는 듯.

                onEndReached={() => fetchMore({
                    variables: {
                        offset: data?.seeFeed.length || 0
                        // 다음은 백엔드에서 처음 take 한 만큼을 offset으로 설정하여 skip하고 받아볼 수 있게 되므로 3개 생략 3개 로드 3개 생략 3개 로드 반복 가능
                    },
                })}
                onEndReachedThreshold={0.01}
                // 스크롤바가 리스트의 끝이라고 인식하는 곳이 어디쯤인 지 설정할 수 있음. 마지막 데이터의 끝 기준.

            />
        </ScreenLayout>
    )
}