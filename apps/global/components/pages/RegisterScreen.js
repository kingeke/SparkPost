import React from 'react'
import { Container, Content, Form, Item, Label, Input, Icon, Button, Text } from 'native-base';
import { View } from 'react-native'
import Styles, { mainColor, textColor } from '../assets/Styles';
import CustomModal from '../layouts/CustomModal';
import { connect } from 'react-redux'
import { registerAction, userAuthDefault } from '../../../store/actions/users/auth/userAuthActions';
import ValidationComponent from 'react-native-form-validator';
import { showAlert } from '../../../global/components/assets/Alerts'
import DeviceInfo from 'react-native-device-info';

class RegisterScreen extends ValidationComponent {

    static navigationOptions = {
        headerStyle: {
            backgroundColor: 'transparent'
        }
    };

    state = {
        fullname: '',
        fullnameErrors: [],
        username: '',
        usernameErrors: [],
        email: '',
        emailErrors: [],
        password: '',
        passwordErrors: [],
        secureTextEntry: true,
        sending: false,
        deviceID: DeviceInfo.getUniqueID()
    }

    componentWillReceiveProps = (newProps) => {
        this.setState({
            sending: false
        }, () => {
            if (newProps.userAuthError) {
                showAlert('Error', newProps.userAuthError)
            }
            if (newProps.userAuthSuccess) {
                this.props.navigation.navigate('User')
            }
            newProps.userAuthDefault()
        })
    }

    handleChange = (target, value) => {
        this.setState({
            [target]: value,
            [target + 'Errors']: []
        })
    }

    handleSubmit = () => {

        this.validate({
            fullname: { required: true, minlength: 3, },
            username: { required: true },
            email: { required: true, email: true, },
            password: { required: true, minlength: 6 }
        });

        this.setState({
            fullnameErrors: this.getErrorsInField('fullname'),
            usernameErrors: this.getErrorsInField('username'),
            emailErrors: this.getErrorsInField('email'),
            passwordErrors: this.getErrorsInField('password'),
        }, () => {
            if (this.isFormValid()) {
                this.setState({
                    sending: true
                }, () => {
                    this.props.registerAction(this.state)
                })
            }
        })
    }

    render() {
        return (
            <Container>
                <Content scrollEnabled={true} contentContainerStyle={{ minHeight: '100%' }}>
                    <View style={[{ flex: 1 }, Styles.margin(10, 'top'), Styles.margin(50, 'bottom')]}>

                        <CustomModal visible={this.state.sending ? true : false} />

                        <View style={[Styles.padding(30), { borderRadius: 35, backgroundColor: 'white', width: '90%', alignSelf: 'center', shadowColor: mainColor, shadowOffset: { width: 10, height: 13 }, shadowOpacity: 0.58, shadowRadius: 46, elevation: 20 }]} >

                            <View style={[Styles.margin(20, 'top'), Styles.margin(10, 'left')]}>
                                <Text style={[{ fontSize: 30, color: mainColor }]}>Create Account, </Text>
                                <Text style={[Styles.margin(10, 'top'), { color: textColor }]}>Please fill out the details to continue</Text>
                            </View>

                            <Form>

                                <Item floatingLabel error={this.state.fullnameErrors.length > 0 ? true : false}>
                                    <Label style={Styles.color(mainColor)}>Fullname</Label>

                                    <Input onChangeText={(text) => this.handleChange('fullname', text)} disabled={this.state.sending ? true : false} style={Styles.margin(10, 'top', { color: textColor })} value={this.state.fullname} />
                                    {
                                        this.state.fullnameErrors.length > 0 ? <Icon name='close-circle' /> : null
                                    }
                                </Item>
                                {
                                    this.state.fullnameErrors.length > 0 ? <Text style={[Styles.margin(15, 'left'), Styles.color('red'), { fontSize: 13 }]}>{this.state.fullnameErrors[0]}</Text> : null
                                }

                                <Item floatingLabel error={this.state.usernameErrors.length > 0 ? true : false}>
                                    <Label style={Styles.color(mainColor)}>Username</Label>

                                    <Input onChangeText={(text) => this.handleChange('username', text)} disabled={this.state.sending ? true : false} style={Styles.margin(10, 'top', { color: textColor })} value={this.state.username} />
                                    {
                                        this.state.usernameErrors.length > 0 ? <Icon name='close-circle' /> : null
                                    }
                                </Item>
                                {
                                    this.state.usernameErrors.length > 0 ? <Text style={[Styles.margin(15, 'left'), Styles.color('red'), { fontSize: 13 }]}>{this.state.usernameErrors[0]}</Text> : null
                                }

                                <Item floatingLabel error={this.state.emailErrors.length > 0 ? true : false}>
                                    <Label style={Styles.color(mainColor)}>Email</Label>

                                    <Input onChangeText={(text) => this.handleChange('email', text)} disabled={this.state.sending ? true : false} style={Styles.margin(10, 'top', { color: textColor })} value={this.state.email} keyboardType="email-address" autoCapitalize="none" />
                                    {
                                        this.state.emailErrors.length > 0 ? <Icon name='close-circle' /> : null
                                    }
                                </Item>
                                {
                                    this.state.emailErrors.length > 0 ? <Text style={[Styles.margin(15, 'left'), Styles.color('red'), { fontSize: 13 }]}>{this.state.emailErrors[0]}</Text> : null
                                }

                                <Item floatingLabel error={this.state.passwordErrors.length > 0 ? true : false}>
                                    <Label style={[Styles.color(mainColor)]}>Password</Label>

                                    <Input onChangeText={(text) => this.handleChange('password', text)} secureTextEntry={this.state.secureTextEntry} disabled={this.state.sending ? true : false} style={[Styles.margin(10, 'top'), { color: textColor }]} value={this.state.password} autoCapitalize="none" />

                                    <Icon type='FontAwesome5' style={{ color: this.state.passwordErrors.length > 0 ? 'red' : mainColor }} name={this.state.secureTextEntry ? 'eye-slash' : 'eye'} onPress={() => this.setState({ secureTextEntry: !this.state.secureTextEntry })} />
                                </Item>
                                {
                                    this.state.passwordErrors.length > 0 ? <Text style={[Styles.margin(15, 'left'), Styles.color('red'), { fontSize: 13 }]}>{this.state.passwordErrors[0]}</Text> : null
                                }

                                <Button iconLeft block rounded style={[Styles.margin(30, 'top'), Styles.margin(10), { backgroundColor: mainColor }]} onPress={this.handleSubmit}>
                                    <Icon type='FontAwesome5' name='user-plus' />
                                    <Text uppercase={false}>Create Account</Text>
                                </Button>

                            </Form>
                        </View>
                    </View>
                </Content>
            </Container>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        registerAction: (data) => dispatch(registerAction(data)),
        userAuthDefault: () => dispatch(userAuthDefault())
    }
}

const mapStateToProps = (state) => {
    const userAuth = state.users.userAuth
    const { userAuthError, userAuthSuccess } = userAuth
    return {
        userAuthError,
        userAuthSuccess
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)