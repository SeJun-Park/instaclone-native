import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ILoginData, ILoginVar, LoggedOutStackNavParamList } from "../types";
import AuthLayout from "../components/auth/AuthLayout";
import { KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { RefObject, useEffect, useRef } from "react";
import { AuthTextInput } from "../components/auth/Authshared";
import AuthButton from "../components/auth/AuthButton";
import { useForm, Controller } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { isLoggedInVar, logUserIn } from "../apollo";

const LOGIN_MUTATION = gql`
    mutation login($username:String!, $password:String!) {
        login(username:$username, password:$password) {
            ok
            token
            error
        }
    }
` 

interface ILogInFormData {
    username:string;
    password:string;
}

type Props = NativeStackScreenProps<LoggedOutStackNavParamList, 'LogIn'>;
  

export default function LogIn({ route: { params }, navigation } : Props) {

    const { control, handleSubmit, watch, formState: {errors, isValid}, setError } = useForm<ILogInFormData>({
        mode: "onChange",
        defaultValues: {
            username:params?.username || "",
            password:params?.password || ""
        }
    })

    const passwordRef = useRef<TextInput>(null);

    const [ login, { loading, data, error }] = useMutation<ILoginData, ILoginVar>(LOGIN_MUTATION, {
        onCompleted: async (data) => {
            console.log('Mutation completed successfully:', data);
            // 추가적인 로직 실행 가능
            const { login : { ok, token, error } } = data;
            if(!ok) {
                setError("password", {
                    message: error
                    // password 칸 밑에 에러메시지를 띄우기 위함.
                })
            }

            if(token) {
                // isLoggedInVar(true);
                await logUserIn(token);
            }

            // navigate("/")
            // window.location.reload();
            // 임시 방편, 쿼리로 하는 방법 있을 듯?
          },
        onError: (error) => {
            console.log('Mutation failed:', error);
            // 에러 핸들링 로직 실행 가능
          }
    });

    const onNext = ( nextRef:RefObject<TextInput> ) => {
        if(nextRef.current) {
            nextRef.current.focus();
        }
    }

    const onSubmit = ({ username, password } : ILogInFormData) => {
        console.log("Submit Completed!");

        if(loading) {
            return;
        }

        login({
            variables: {
                username:username,
                password:password
            }
        })
    }

    return (
        <AuthLayout>
            <Controller
                // 이 컴포넌트 자체가 register 같은 개념인듯
                control={control}
                name="username"
                rules={{ required: 'Username is required', minLength: { value:5, message:"username should be longer than 5" }}}
                render={({ field: { onChange, onBlur, value } }) => (
                <AuthTextInput
                    placeholder="username"
                    placeholderTextColor="rgba(255, 255, 255, 0.8)"
                    returnKeyType="next"
                    autoCapitalize="none"
                    onSubmitEditing={() => onNext(passwordRef)}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    // onChangeText는 방금 바뀐 TEXT를 Argument로 주는 FUNCTION
                    value={value}
                />
                )}
            />
            <Controller
                control={control}
                name="password"
                rules={{ required: 'Password is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                <AuthTextInput
                    ref={passwordRef}
                    placeholder="password"
                    placeholderTextColor="rgba(255, 255, 255, 0.8)"
                    returnKeyType="done"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    onSubmitEditing={handleSubmit(onSubmit)}
                />
                )}
            />
            <AuthButton onPress={handleSubmit(onSubmit)} disabled={!watch("username") || !watch("password")} loading={loading} text="Log In" />
        </AuthLayout>
    )
}