import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../screens/Welcome";
import LogIn from "../screens/LogIn";
import CreateAccount from "../screens/CreateAccount";
import { LoggedOutStackNavParamList } from "../types";


const Stack = createNativeStackNavigator<LoggedOutStackNavParamList>();

const screenOptions: NativeStackNavigationOptions = {
    // headerStyle: { backgroundColor: 'inherit' },
    // presentation: "card",
    // headerTintColor: 'black',
    // headerTitleStyle: { fontWeight: 'bold' },
    headerTitle:() => false,
    headerTransparent:true,
    headerTintColor: "white",
    headerBackTitleVisible:false,
    // headerShown:false,
    // headerBackButtonMenuEnabled:true
  };

export default function LoggedOutNav() {
    return (
        <Stack.Navigator initialRouteName="Welcome" screenOptions={screenOptions} >
            {/* mode="modal" --> 아래에서 화면이 튀어나오게 할 수 있음 */}
        {/* <Stack.Navigator initialRouteName="Welcome" screenOptions={screenOptions}></Stack.Navigator> */}
            {/* 밑에 있는 애들이 Children 같은 개념? */}
            {/* <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown:false }}/> */}
            <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown:false }} />
            <Stack.Screen name="LogIn" component={LogIn} />
            <Stack.Screen name="CreateAccount" component={CreateAccount} />
        </Stack.Navigator>
    )
}