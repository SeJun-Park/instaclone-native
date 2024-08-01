import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SharedStackNavParamList } from "../types";
import Feed from "../screens/Feed";
import Search from "../screens/Search";
import Me from "../screens/Me";
import Notifications from "../screens/Notifications";
import Profile from "../screens/Profile";
import Photo from "../screens/Photo";
import { Image } from "react-native";
import Likes from "../screens/Likes";
import Comments from "../screens/Comments";

const Stack = createNativeStackNavigator<SharedStackNavParamList>();

interface SharedStackNavProps {
    screenName: keyof SharedStackNavParamList;
  };

export default function SharedStackNav( { screenName } : SharedStackNavProps ) {
    return (
        <Stack.Navigator 
            screenOptions={{
            // presentation: "card",
            headerTintColor: "white",
            headerBackTitleVisible:false,
            headerShadowVisible:false,
            // headerTitle: () => false,
            headerStyle: {
                backgroundColor: "black",
            }
        }}>

            {screenName === "Feed" && (<Stack.Screen name="Feed" component={Feed} options={{
                headerTitle: () => <Image source={require("../assets/instawhitelogo.png")} resizeMode="contain" style={{maxHeight:45, maxWidth:135}} />
            }} />)}
            {screenName === "Search" && (<Stack.Screen name="Search" component={Search} />)}
            {screenName === "Notifications" && (<Stack.Screen name="Notifications" component={Notifications} />)}
            {screenName === "Me" && (<Stack.Screen name="Me" component={Me} />)}

            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Photo" component={Photo} />
            <Stack.Screen name="Likes" component={Likes} options={{}} />
            <Stack.Screen name="Comments" component={Comments} />

        </Stack.Navigator>
    )
}