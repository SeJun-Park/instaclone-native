import { ActivityIndicator, View } from "react-native";

interface IScreenLayoutProps {
    loading: boolean;
    children: React.ReactNode;
}

export default function ScreenLayout( { loading, children } : IScreenLayoutProps ) {
    return (
        <View
            style={{
            backgroundColor: "black",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        }}
        >
            {loading ? <ActivityIndicator color={"white"} /> : children}
        </View>
    )
}