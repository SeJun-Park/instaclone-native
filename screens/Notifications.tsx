import { SharedStackNavParamList } from "../types";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props =  NativeStackScreenProps<SharedStackNavParamList, 'Notifications'>;

export default function Notifications( { navigation } : Props ) {
    return (
        <View
            style={{
            backgroundColor: "black",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        }}
        >
            <Text style={{ color: "white" }}>Notifications</Text>
        </View>
    )
}