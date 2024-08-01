import { SharedStackNavParamList } from "../types";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@apollo/client";
import useMe from "../hooks/useMe";
import { useEffect } from "react";
import Profile from "./Profile";

type Props =  NativeStackScreenProps<SharedStackNavParamList, 'Me'>;

export default function Me( { navigation } : Props ) {

    const { data, loading } = useMe();

    useEffect(() => {
        if(data) {
            navigation.setOptions({
                // 이런 식으로 스크린 옵션을 변경해줄 수도 있음.
                title: data.me.username
            })
        }
    }, []);

    return (
        <View
            style={{
            backgroundColor: "black",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        }}
        >
            <Text style={{ color: "white" }}>Me</Text>
        </View>
    )
}