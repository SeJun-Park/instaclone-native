import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import Ionicons from '@expo/vector-icons/Ionicons';
import LoggedOutNav from './navigators/LoggedOutNav';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native'
import { Appearance, useColorScheme } from 'react-native'
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { client, isLoggedInVar, tokenVar, cache } from './apollo';
import LoggedInNav from './navigators/LoggedInNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageWrapper, persistCache } from 'apollo3-cache-persist';


export default function App() {
  const [loading, setloading] = useState(true);
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  // const colorScheme = useColorScheme();
  // const [currentColorScheme, setCurrentColorScheme] = useState(colorScheme);

  const preload = async () => {
  // 내용 작성 필요.

  const fontAssets = [Ionicons.font]
  // 글꼴 로드 --> 이건 아이콘 글꼴 = 아이콘을 로드하고 있는 것.
  // 텍스트 글꼴은 따로 있는 듯. 뒷부분에 추가 가능 [Ionicons.font, ...]
  const fontAssetsLoadPromise = fontAssets.map((font) => Font.loadAsync(font));
    // 사용자 정의 글꼴 로드
    // 'Roboto': require('./assets/fonts/Roboto.ttf'),
    // 추가 글꼴이 있다면 여기에 추가

    const imageAssets = [require('./assets/instablacklogo.png'), 'https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram.png', ]
    // 경로를 지정해도 되고, 주소를 지정해줘도 됨.
    const imageAssetsLoadPromise = imageAssets.map((image) => Asset.loadAsync(image))


  await Promise.all([...fontAssetsLoadPromise, ...imageAssetsLoadPromise]);
  // await Promise.all(fontAssetsLoadPromise);ㄴ
  // await Promise.all([...a, ...b, ...fontAssetsLoad]); 이런 식으로 사용 가능
  // 배열을 리턴해야함. [...fontAssetsLoadPromise, ...imageAssetsLoadPromise] 이건 두 배열의 요소를 꺼내다가 새로운 배열을 만들고 있는 것.
}

const prepare = async () => {

  try {

    // 스플래시 화면을 유지합니다.
    await SplashScreen.preventAutoHideAsync();

    // 리소스 로딩 작업 (예: 이미지, 글꼴 등)
    await preload();
    // await new Promise(resolve => setTimeout(resolve, 5000)); // 예제: 2초 대기

    const token = await AsyncStorage.getItem("token");

    if(token) {
      isLoggedInVar(true);
      tokenVar(token);
    }

    // await persistCache({
    //   cache,
    //   storage: new AsyncStorageWrapper(AsyncStorage),

    // })
    //Apollo Client의 캐시를 브라우저의 스토리지에 지속적으로 저장하여 페이지를 새로 고침하거나 애플리케이션을 다시 시작해도 캐시된 데이터를 유지할 수 있게 해줌.


  } catch (error) {
    console.warn(error);

  } finally {

    // 리소스 로딩이 완료되면 스플래시 화면을 숨깁니다.
    setloading(false);
    await SplashScreen.hideAsync();

  }
}


useEffect(() => {

  prepare();

  // const subscription = Appearance.addChangeListener(({ colorScheme }) => {
  //     setCurrentColorScheme(colorScheme);
  // });

  // console.log(colorScheme);

  // return () => subscription.remove();

}, []);


if (loading) {
  return null; // 스플래시 화면이 숨겨지기 전까지 아무것도 렌더링하지 않음 --> 스플래시 + 로딩 인데케이터 화면 로드
}

return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
      </NavigationContainer>
    </ApolloProvider>
);
}
