import { ISearchPhotosData, ISearchPhotosPhoto, ISearchPhotosVars, ISearchUsersData, ISearchUsersUser, ISearchUsersVars, SharedStackNavParamList } from "../types";
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { useEffect, useState } from "react";
import DismissKeyboard from "../components/DismissKeyboard";
import { Controller, useForm } from "react-hook-form";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import UserRow from "../components/UserRow";
import ScreenLayout from "../components/ScreenLayout";

const SEARCH_USERS = gql`
    query searchUsers($keyword:String!, $offset:Int!) {
        searchUsers(keyword:$keyword, offset:$offset) {
            id
            username
            avatar
            isFollowing
            isMe
        }
    }
`

const SEARCH_PHOTOS = gql`
    query searchPhotos($keyword:String!, $offset:Int!) {
        searchPhotos(keyword:$keyword, offset:$offset) {
            id
            file
        }
    }
`

interface IInputProps {
    width:number;
}

const Input = styled.TextInput<IInputProps>`
    background-color: rgba(255, 255, 255, 1);
    width: ${(props) => props.width / 1.5}px;
    color: black;
    padding: 5px 10px;
    border-radius: 10px;
    
`

const SearchingContainer = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;
`;
const SearchingText = styled.Text`
    margin-top: 15px;
    color: white;
    font-weight: 600;
`;

const CategoryText = styled.Text`
    color:white;
    padding: 10px 10px;
    margin-top: 20px;
`;

interface ISearchFormData {
    keyword:string;
}

interface IRenderItemProps  {
    item: ISearchUsersUser
}

interface IRenderPhotoProps  {
    item: ISearchPhotosPhoto
}

type Props =  NativeStackScreenProps<SharedStackNavParamList, 'Search'>;

export default function Search( { navigation } : Props ) {

    const [ prevKeyword, setPrevKeyword ] = useState("");
    const [ refreshing, setRefreshing ] = useState(false);

    const { width } = useWindowDimensions();

    const { control, handleSubmit, watch, formState: {errors, isValid}, setError } = useForm<ISearchFormData>({
        // mode: "onChange",
    });

    const [ searchUsers, { data, loading, error, refetch, fetchMore, called }] = useLazyQuery<ISearchUsersData, ISearchUsersVars>(SEARCH_USERS, {
        // variables: {
        //     keyword: watch("keyword"),
        //     offset:0
        // },
        // onCompleted: (data) => {
        //     setPrevKeyword(watch("keyword"));
        // }
        // 이렇게 해도 되고ㅡ 아래처럼 onSubmit 써도 됨.
    });


    const [ searchPhotos, { data:photosData, loading:photosLoading, error:photosError, refetch:photosRefetch, fetchMore:photosFetchMore, called:photosCalled }] = useLazyQuery<ISearchPhotosData, ISearchPhotosVars>(SEARCH_PHOTOS);

    // console.log(prevKeyword);

    const onSubmit = ( { keyword } : ISearchFormData ) => {

        searchUsers({
            variables: {
                keyword:keyword,
                offset:0
            },
            onCompleted: (data) => {
                setPrevKeyword(keyword);
            }
        })
        // mutation
        searchPhotos({
            variables: {
                keyword:keyword,
                offset:0
            },
            onCompleted: (data) => {
                setPrevKeyword(keyword);
            }
        })
    }



    const SearchBox = () => (
        <Controller
                control={control}
                name="keyword"
                rules={{ required: true, minLength: {value:2, message:"MinLength is 2"} }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        width={width}
                        style={{ backgroundColor: "white" }}
                        placeholderTextColor="rgba(0, 0, 0, 0.8)"
                        placeholder="Search photos"
                        autoCapitalize="none"
                        // 소문자로.
                        returnKeyLabel="Search" // for android
                        returnKeyType="search" // for iOS
                        autoCorrect={false}
                        // onChangeText={(text) => setValue("keyword", text)}
                        // 아래 3개가 controller를 사용할 때 필수 props
                        onBlur={onBlur}
                        onChangeText={onChange}
                        // onChangeText는 방금 바뀐 TEXT를 Argument로 주는 FUNCTION
                        value={value}
                        // onSubmitEditing={() => searchUsers()}
                        onSubmitEditing={handleSubmit(onSubmit)}
                    />
        )}
        />
    ); 

    const renderItemFn = ({ item }:IRenderItemProps) => {
        return <UserRow {...item} />;
        }

    const renderPhotoFn = ({ item }:IRenderPhotoProps) => {
        return (
        <TouchableOpacity onPress={() => navigation.navigate("Photo", { photoId: item.id})}>
            <Image source={{uri:item.file}} style={{width:width/3, height:width/3}} />
        </TouchableOpacity>);
        }

    const refreshFn = async () => {
        setRefreshing(true);
        await refetch();
        await photosRefetch();
        setRefreshing(false);
    }

    useEffect(() => {
        navigation.setOptions({
            headerTitle: SearchBox
        });
        // setPrevKeyword("");
    }, [])

    return (
        <DismissKeyboard>
            <View style={{ flex:1, backgroundColor:"black"}}>
            { loading || photosLoading ? 
                            <SearchingContainer>
                                <ActivityIndicator size={"large"} />
                                <SearchingText>Searching..</SearchingText>
                            </SearchingContainer>
                            :
                            null
                            }
            {errors.keyword?.message && <Text style={{textAlign:"center", color:"white"}}>{errors.keyword.message}</Text>}
            {!called || !photosCalled ?
                        <SearchingContainer>
                            <SearchingText>Search by keyword</SearchingText>
                        </SearchingContainer> : null}

            {data ? data.searchUsers.length === 0 ?
                        <>
                            {/* <CategoryText>User</CategoryText> */}
                            <SearchingContainer>
                                <CategoryText>User</CategoryText>
                                <SearchingText>Could not find anything</SearchingText>
                            </SearchingContainer> 
                        </>
                        : 
                        <>
                        <CategoryText>User</CategoryText>
                        <FlatList 
                        data={data.searchUsers}
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
                        onEndReached={() => {
                            console.log("prevKeyword:", prevKeyword);
                            fetchMore({
                            variables: {
                                keyword:prevKeyword,
                                offset: data.searchUsers.length || 0
                                // 다음은 백엔드에서 처음 take 한 만큼을 offset으로 설정하여 skip하고 받아볼 수 있게 되므로 3개 생략 3개 로드 3개 생략 3개 로드 반복 가능
                            },
                        })}}
                        onEndReachedThreshold={0.01}
                        // 스크롤바가 리스트의 끝이라고 인식하는 곳이 어디쯤인 지 설정할 수 있음. 마지막 데이터의 끝 기준.

                        />
                        </> 
                        : null}
            {photosData ? photosData.searchPhotos.length === 0 ?
                        <>
                            {/* <CategoryText>User</CategoryText> */}
                            <SearchingContainer>
                                <CategoryText>Photo</CategoryText>
                                <SearchingText>Could not find anything</SearchingText>
                            </SearchingContainer> 
                        </>
                        : 
                        <>
                        <CategoryText>Photo</CategoryText>
                        <FlatList 
                        numColumns={3}
                        // 쉽게 컬럼 값을 줄 수 있음.
                        data={photosData.searchPhotos}
                        // 가져오는 데이터를 정의
                        renderItem={renderPhotoFn}
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
                        onEndReached={() => {
                            console.log("prevKeyword:", prevKeyword);
                            photosFetchMore({
                            variables: {
                                keyword:prevKeyword,
                                offset: photosData.searchPhotos.length || 0
                                // 다음은 백엔드에서 처음 take 한 만큼을 offset으로 설정하여 skip하고 받아볼 수 있게 되므로 3개 생략 3개 로드 3개 생략 3개 로드 반복 가능
                            },
                        })}}
                        onEndReachedThreshold={0.01}
                        // 스크롤바가 리스트의 끝이라고 인식하는 곳이 어디쯤인 지 설정할 수 있음. 마지막 데이터의 끝 기준.

                        />
                        </> 
                        : null}
            </View>
        </DismissKeyboard>
    )
}