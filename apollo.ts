import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, makeVar } from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

export const logUserIn = async (token:string) => {
    await AsyncStorage.setItem("token", token);
    // await AsyncStorage.setItem("token", JSON.stringify(token));
    // await AsyncStorage.multiSet([["token", JSON.stringify(token)], ["loggedIn", JSON.stringify("yes")]])
    // 여러 개의 값을 저장하는 법.
    isLoggedInVar(true);
    tokenVar(token);
}

export const logUserOut = async () => {
    await AsyncStorage.removeItem("token");
    isLoggedInVar(false);
    tokenVar(undefined);
}




// HttpLink 설정: GraphQL 서버 URI 지정
const httpLink = new HttpLink({ uri: 'http://localhost:4001/graphql' });

// AuthLink 설정: 요청(request)에 인증 헤더 추가
const authLink = new ApolloLink((operation, forward) => {
  // operation.setContext를 사용하여 컨텍스트 설정 --> 이름은 CONTExt지만 context가 아닌 req에 추가해주는 과정인 듯.
  operation.setContext(({ headers = {} }) => {
    // {headers} 라고 작성해도 됨, = {} 는 기본값을 설정해주는 것임.
    // const token = localStorage.getItem(TOKEN);
    return {
      headers: {
        ...headers,
        // token: token ? `Bearer ${token}` : "",
        // token : localStorage.getItem(TOKEN)
        // 웹에선 위와 같이 했음.
        token: tokenVar()
      }
    };
    // return 을 통해 기존 request.headers에 token을 추가해주고 있음.
  });

  // 다음 링크로 요청 전달
  return forward(operation);
});


export const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          searchUsers: {
            keyArgs: ['keyword'],
            merge(existing = [], incoming = []) {
                  return [...existing, ...incoming]
            }
          },
          searchPhotos: {
            keyArgs: ['keyword'],
            merge(existing = [], incoming = []) {
                  return [...existing, ...incoming]
            }
          },
          seePhotoLikes: {
            keyArgs: ['photoId'],
            merge(existing = [], incoming = []) {
                  return [...existing, ...incoming]
            }
          },
          // seeFeed는 매 번 OFfset만 달라지므로 다 같은 쿼리로 인식하여 오류가 나므로 아래와 같이 함.
          // seePhotoLikes는 매 쿼리마다 PhotoId가 달라질 수 있고 argument에 따라 특히 PHOTOId에 따라 구별할 필요가 있으니 이렇게 수동으로 설정해줘야 함.
          // seePhotoLikes:offsetLimitPagination() 이렇게 해바리면 argument가 무시되어 사진에 따라 구별도 못함. Comment에서도 이렇게 해야할 것. 
          seeFeed: offsetLimitPagination()
          // 이 한줄이 아래와 같은 역할을 함.

          // {
          //   keyArgs:false,
          //   // apollo가 query들을 argument에 따라 구별시키는 걸 막아주는 조치.
          //   // 이로써 seeFeed를 할 때 fetchmore가 작동할 수 있음.
          //   merge(existing = [], incoming = []) {
          //     return [...existing, ...incoming]
          //     // seeFeed 에서 offset을 바꿔가며 FETCHMore를 할 때 이전 데이터와 이후 데이터를 합쳐주고 있음. 
          //   }
          // }
        }
      }
    }
});

export const client = new ApolloClient({
    // uri: "https://forty-pots-shake.loca.lt/graphql",
    // 할 때마다 발급받아야 하는 듯.
    // uri: "http://localhost:4001/graphql",
    cache: cache,
    connectToDevTools: true,
    link: ApolloLink.from([authLink, httpLink]),
    // apollo client 가 데이터 소스와 소통하는 방식
    // uri 도 link 방식으로 연결해줄 수 있음.
    // ApolloLink.from을 사용하여 authLink와 httpLink를 결합합니다.
})