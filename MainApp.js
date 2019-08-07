import React, { Component } from 'react'
import { createBottomTabNavigator, createAppContainer, createSwitchNavigator, createStackNavigator } from "react-navigation";
import { Icon } from 'native-base';
import { fromRight, fromBottom, fromLeft } from 'react-navigation-transitions';
import HomeScreen from "./apps/user/components/pages/HomeScreen";
import ProfileScreen from "./apps/user/components/pages/ProfileScreen";
import LoginScreen from './apps/global/components/pages/LoginScreen';
import AuthLoadingScreen from './apps/global/components/pages/AuthLoadingScreen';
import RegisterScreen from './apps/global/components/pages/RegisterScreen';
import { mainColor } from './apps/global/components/assets/Styles';
import { UserAuthService } from './apps/global/services/AuthService';
import CreatePostScreen from './apps/user/components/pages/posts/CreatePostScreen';
import UserPostScreen from './apps/user/components/pages/posts/UserPostScreen';
import ViewPostScreen from './apps/user/components/pages/posts/ViewPostScreen';
import EditPostScreen from './apps/user/components/pages/posts/EditPostScreen';
import CustomImageViewer from './apps/global/components/layouts/CustomImageViewer';

class LogOutScreen extends Component {

    componentWillMount = () => {
        UserAuthService.signOut().then(
            () => {
                this.props.navigation.navigate('Auth')
            }
        )
    }

    render() {
        return null
    }
}

const AuthStack = createStackNavigator(
    {
        Login: LoginScreen,
        Register: RegisterScreen
    },
    {
        initialRouteName: 'Login',
        transitionConfig: () => fromRight(),
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: 'white',
            },
            headerTintColor: mainColor
        },
    }
);

const UserDashboardStack = createBottomTabNavigator(
    {
        Home: { screen: HomeScreen, params: { icon: 'home', type: 'MaterialIcons' } },
        Profile: { screen: ProfileScreen, params: { icon: 'person', type: 'MaterialIcons' } },
        Exit: { screen: LogOutScreen, params: { icon: 'log-out', type: 'Ionicons' } }
    }, {
        initialRouteName: 'Home',
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ tintColor }) => {
                const { params } = navigation.state;
                return <Icon type={params.type} name={params.icon} style={{ color: tintColor, fontSize: 25, marginTop: 5 }} />
            }
        }),
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray'
        },
    }
);

const UserPageStack = createStackNavigator(
    {
        CreatePost: CreatePostScreen,
        EditPost: EditPostScreen,
        UserPosts: UserPostScreen,
        ViewPost: ViewPostScreen,
        ImageViewer: CustomImageViewer
    },
    {
        // initialRouteName: 'UserPosts',
        headerMode: 'none',
        transitionConfig: () => fromBottom(),
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: 'white',
            },
            headerTintColor: mainColor
        },
    }
)

export default MainApp = createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        User: createStackNavigator(
            {
                Dashboard: UserDashboardStack,
                Pages: UserPageStack
            }, {
                initialRouteName: 'Dashboard',
                headerMode: 'none',
                transitionConfig: () => fromBottom(),
            }
        ),
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading'
    }
));