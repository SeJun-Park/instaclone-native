import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LoggedInTabNavParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { Image, View } from "react-native";
import SharedStackNav from "./SharedStackNav";
import useMe from "../hooks/useMe";

const Tab = createBottomTabNavigator<LoggedInTabNavParamList>();

export default function LoggedInNav() {

    const { data } = useMe();

    return (
            <Tab.Navigator 
                screenOptions={{ 
                    headerShown:false, 
                    tabBarShowLabel:false, 
                    tabBarActiveTintColor:"white", 
                    tabBarStyle: {
                        borderTopColor: "rgba(255, 255, 255, 0.3)",
                        backgroundColor: "black",
                    } 
                }} 
                >
                <Tab.Screen 
                    name="FeedTab" 
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
                        ),
                    }}
                    >
                        {() => <SharedStackNav screenName="Feed" />}
                    </Tab.Screen>
                <Tab.Screen 
                    name="SearchTab"
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name="search" size={22} color={color} />
                        ),
                    }}
                    >
                        {() => <SharedStackNav screenName="Search" />}
                    </Tab.Screen>
                <Tab.Screen 
                name="CameraTab" component={View}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? "camera" : "camera-outline"} size={26} color={color} />
                    ),
                }}
                />
                <Tab.Screen 
                    name="NotificationsTab" 
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? "heart" : "heart-outline"} size={22} color={color} />
                        ),
                    }}
                    >
                        {() => <SharedStackNav screenName="Notifications" />}
                    </Tab.Screen>
                <Tab.Screen 
                    name="MeTab" 
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                        data && data.me.avatar ? <Image style={{width:20, height:20, borderRadius:10, ...(focused && {borderColor:"white", borderWidth:2})}} resizeMode="cover" source={{ uri:data.me.avatar }} /> : <Ionicons name={"person-outline"} size={22} color={color} />
                        ),
                    }}
                    >
                        {() => <SharedStackNav screenName="Me" />}
                    </Tab.Screen>
            </Tab.Navigator>
    )
} 