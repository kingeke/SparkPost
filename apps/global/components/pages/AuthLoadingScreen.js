import React, { Component } from 'react'
import { ActivityIndicator, View, Image } from 'react-native';
import { logo } from '../assets/Pictures';
import Styles, { mainColor } from '../assets/Styles';
import { connect } from 'react-redux'
import { setUser } from '../../../store/actions/users/auth/userAuthActions';

class AuthLoadingScreen extends Component {

    componentDidMount = () => {
        this.props.setUser()
    }

    componentWillReceiveProps = (newProps) => {
        if (newProps.user) {
            this.props.navigation.navigate('User');
        }
        else {
            this.props.navigation.navigate('Auth');
        }
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={logo} style={[Styles.width('55%'), Styles.height('20%')]} resizeMode='contain' />
                <ActivityIndicator size={50} color={mainColor} />
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: () => dispatch(setUser())
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.users.userAuth.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen)