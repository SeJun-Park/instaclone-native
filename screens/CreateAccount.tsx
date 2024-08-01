import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TextInput } from "react-native";
import { ICreateAccountData, ICreateAccountVar, LoggedOutStackNavParamList } from "../types";
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";
import { RefObject, useRef } from "react";
import { AuthTextInput } from "../components/auth/Authshared";
import { Controller, useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";


const CREATE_ACCOUNT_MUTATION = gql`
    mutation createAccount(
        $firstName: String!
        $lastName: String
        $username: String!
        $email: String!
        $password: String!
    ) {
        createAccount(
            firstName:$firstName
            lastName:$lastName             
            username:$username 
            email:$email 
            password:$password 
        ) {
            ok
            error
        }
    }
`

interface ICreateAccountFormData {
    firstName:string;
    lastName:string;
    username:string;
    email:string;
    password:string;
}
  
type Props = NativeStackScreenProps<LoggedOutStackNavParamList, 'CreateAccount'>;
  
export default function CreateAccount({ navigation } : Props) {

    const { control, handleSubmit, formState: { errors, isValid }, setError, getValues } = useForm<ICreateAccountFormData>({
        mode: "onChange"
    });

    const [ createAccount, { loading, data, error } ] = useMutation<ICreateAccountData, ICreateAccountVar>(CREATE_ACCOUNT_MUTATION, {
        onCompleted: (data) => {
            console.log('Mutation completed successfully:', data);
            // 추가적인 로직 실행 가능
            const { createAccount : { ok, error } } = data;
            const { username, password } = getValues();
        
            if(!ok) {
                setError("password", {
                    message: error
                    // password 칸 밑에 에러메시지를 띄우기 위함.
                })
            }

            navigation.navigate("LogIn", {
                username:username,
                password:password
            });

            // navigate("/", {
            //     state: {
            //         message: "Account created. Please Login",
            //         username:username,
            //         password:password
            //     }
            // })
          },
        onError: (error) => {
            console.log('Mutation failed!', error);
            // 에러 핸들링 로직 실행 가능
          }
    });

    const firstNameRef = useRef<TextInput>(null);
    const lastNameRef = useRef<TextInput>(null);
    const usernameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    const onNext = ( nextRef:RefObject<TextInput> ) => {
        if(nextRef.current) {
            nextRef.current.focus();
        }
    }

    const onSubmit = ( { firstName, lastName, username, email, password }:ICreateAccountFormData ) => {

        if(loading) {
            return;
        }

        createAccount({
            variables: {
                email:email,
                firstName:firstName, 
                lastName:lastName, 
                username:username, 
                password:password
            }
        })
    }

    return (
       <AuthLayout>
            <Controller
                control={control}
                name="firstName"
                rules={{ required: 'FirstName is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <AuthTextInput 
                        ref={firstNameRef}
                        placeholder="First Name" 
                        placeholderTextColor="rgba(255, 255, 255, 0.8)"
                        returnKeyType="next" 
                        onSubmitEditing={() => onNext(lastNameRef)}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            <Controller
                control={control}
                name="lastName"
                rules={{ required: 'LastName is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <AuthTextInput 
                        ref={lastNameRef}
                        placeholder="Last Name" 
                        placeholderTextColor="rgba(255, 255, 255, 0.8)"
                        returnKeyType="next" 
                        onSubmitEditing={() => onNext(usernameRef)}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            <Controller
                control={control}
                name="username"
                rules={{ required: 'username is required', minLength: { value:5, message:"username should be longer than 5" } }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <AuthTextInput 
                        ref={usernameRef}
                        placeholder="username" 
                        placeholderTextColor="rgba(255, 255, 255, 0.8)"
                        returnKeyType="next" 
                        autoCapitalize="none"
                        onSubmitEditing={() => onNext(emailRef)}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            <Controller
                control={control}
                name="email"
                rules={{ required: 'email is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <AuthTextInput 
                        ref={emailRef}
                        placeholder="email" 
                        placeholderTextColor="rgba(255, 255, 255, 0.8)"
                        returnKeyType="next" 
                        autoCapitalize="none"
                        onSubmitEditing={() => onNext(passwordRef)}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            <Controller
                control={control}
                name="password"
                rules={{ required: 'password is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <AuthTextInput 
                        ref={passwordRef}
                        placeholder="password" 
                        placeholderTextColor="rgba(255, 255, 255, 0.8)"
                        returnKeyType="done"
                        secureTextEntry
                        onSubmitEditing={handleSubmit(onSubmit)}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            <AuthButton onPress={handleSubmit(onSubmit)} disabled={!isValid} loading={!isValid} text="Sign Up" />
       </AuthLayout>
    )
}