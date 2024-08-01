import { SharedStackNavParamList } from "../types";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props =  NativeStackScreenProps<SharedStackNavParamList, 'Comments'>;

export default function Comments( { navigation } : Props ) {
    return (
        <View
            style={{
            backgroundColor: "black",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        }}
        >
            <Text style={{ color: "white" }}>Comments</Text>
        </View>
    )
}