import { ISeePhotoData, ISeePhotoVars, SharedStackNavParamList } from "../types";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ScreenLayout from "../components/ScreenLayout";
import { gql, useQuery } from "@apollo/client";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";
import { useState } from "react";
import PhotoContainer from "../components/PhotoContainer";

const SEE_PHOTO = gql`
    query seePhoto($photoId:Int!) {
        seePhoto(photoId:$photoId){
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

type Props =  NativeStackScreenProps<SharedStackNavParamList, 'Photo'>;

export default function Photo( { route: {params}, navigation } : Props ) {

    const { photoId } = params;
    const [ refreshing, setRefreshing ] = useState(false);

    const { data, loading, error, refetch } = useQuery<ISeePhotoData, ISeePhotoVars>(SEE_PHOTO, {
        variables: {
            photoId:photoId
        }
    });

    const refreshFn = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }

    return (
        <ScreenLayout loading={loading}>
            <ScrollView
            // ScrollView는 단일 컨텐츠가  화면을 넘어갈 것  같을 때 사용, 
                refreshControl={
                    <RefreshControl onRefresh={refreshFn} refreshing={refreshing} />
                }
                // ScrollView가 Refresh를 가지는 법.
                // style={{ backgroundColor: "black" }}
                contentContainerStyle={{
                    // ScrollView가 스타일을 가지는 법.
                    backgroundColor: "black",

                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {data && <PhotoContainer {...data.seePhoto} />}
            </ScrollView>
        </ScreenLayout>
    )
}