import React from 'react'
import { Container, Content, Form, Item, Label, Input, Icon, Button, Text, Grid, Row, Col } from 'native-base';
import { Image, View, Modal, StatusBar } from 'react-native'
import Styles, { mainColor, textColor } from '../assets/Styles';
import CustomModal from '../layouts/CustomModal';
import { logo } from '../assets/Pictures';
import ValidationComponent from 'react-native-form-validator';
import { connect } from 'react-redux'
import { userAuthDefault, loginAction, loginWithFingerprintAction } from '../../../store/actions/users/auth/userAuthActions';
import { showAlert, showToastAlert } from '../assets/Alerts';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import DeviceInfo from 'react-native-device-info';

class LoginScreen extends ValidationComponent {

    static navigationOptions = {
        header: null
    };

    state = {
        email: '',
        emailErrors: [],
        password: '',
        passwordErrors: [],
        deviceID: DeviceInfo.getUniqueID(),
        secureTextEntry: true,
        sending: false,
        fingerprintSupported: false,
        fingerprintModalVisible: false,
        fingerprintError: '',
        fingerprintSuccess: false,
    }

    componentWillMount = () => {
        FingerprintScanner.isSensorAvailable().then(
            res => {
                if (res == 'Fingerprint') {
                    this.setState({
                        fingerprintSupported: true
                    })
                }
            }
        ).catch(
            err => {

            }
        )
    }

    componentWillReceiveProps = (newProps) => {
        this.setState({
            sending: false
        }, () => {
            if (newProps.userAuthError) {
                showAlert('Error', newProps.userAuthError)
                newProps.userAuthDefault()
            }
            if (newProps.user) {
                this.props.navigation.navigate('User')
            }
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
            email: { required: true, email: true, },
            password: { required: true, minlength: 6 }
        });
        this.setState({
            emailErrors: this.getErrorsInField('email'),
            passwordErrors: this.getErrorsInField('password'),
        }, () => {
            if (this.isFormValid()) {
                this.setState({
                    sending: true
                }, () => {
                    this.props.loginAction(this.state)
                })
            }
        })
    }

    handleFingerprintLogin = () => {
        this.setState({
            fingerprintModalVisible: true
        }, () => {
            FingerprintScanner.authenticate({ onAttempt: this.handleAuthenticationAttempted }).then(
                res => {
                    if (res == true) {
                        this.setState({
                            fingerprintError: '',
                            fingerprintSuccess: true
                        }, () => {
                            setTimeout(() => {
                                this.handleCloseFingerprintModal()
                                this.setState({
                                    sending: true
                                }, () => {
                                    this.props.loginWithFingerprint(this.state)
                                })
                            }, 1000);

                        })
                    }
                }
            ).catch(
                err => {
                    if (err.name == 'AuthenticationFailed') {
                        this.handleCloseFingerprintModal()
                        showAlert('Error', 'Fingerprint disabled, please login with password')
                    }
                    else {
                        this.setState({
                            fingerprintError: err.message
                        })
                    }
                }
            );
        })

    }

    handleAuthenticationAttempted = (err) => {
        if (err) {
            this.setState({
                fingerprintError: err.message
            })
        }
    };

    handleCloseFingerprintModal = () => {
        this.setState({
            fingerprintModalVisible: false,
            fingerprintError: '',
            fingerprintSuccess: false
        }, () => {
            FingerprintScanner.release();
        })
    }

    componentWillUnmount() {
        FingerprintScanner.release();
    }

    render() {
        return (
            <Container >
                <Content scrollEnabled={true} contentContainerStyle={{ minHeight: '100%' }}>
                    <View style={{ flex: 1 }}>

                        <View style={[{ width: '100%', height: 150, alignItems: 'center' }]}>
                            <Image source={logo} style={[Styles.width('55%'), Styles.height('100%')]} resizeMode='contain' />
                        </View>

                        <View style={[{ flex: 1 }]}>
                            <CustomModal visible={this.state.sending ? true : false} />
                            <View style={[Styles.padding(30), { borderRadius: 35, backgroundColor: 'white', width: '90%', alignSelf: 'center', shadowColor: mainColor, shadowOffset: { width: 10, height: 12 }, shadowOpacity: 0.58, shadowRadius: 16, elevation: 20 }]} >

                                <View style={[Styles.margin(20, 'top'), Styles.margin(10, 'left')]}>
                                    <Text style={[{ fontSize: 30, color: mainColor }]}>Welcome back, </Text>
                                    <Text style={[Styles.margin(10, 'top'), { color: textColor }]}>Sign in to continue</Text>
                                </View>

                                <Form>

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


                                    <Button iconLeft block rounded style={[Styles.margin(10), Styles.margin(30, 'top'), { backgroundColor: mainColor }]} onPress={this.handleSubmit}>
                                        <Icon type='FontAwesome5' name='sign-in-alt' />
                                        <Text>Login</Text>
                                    </Button>

                                    <Grid>
                                        <Col>
                                            {
                                                this.state.fingerprintSupported ?
                                                    <Button transparent onPress={this.handleFingerprintLogin} iconLeft style={{ marginLeft: 0, paddingLeft: 0 }}>
                                                        <Icon type="FontAwesome5" name='fingerprint' style={{ color: mainColor }} />
                                                        <Text uppercase={false} style={{ fontSize: 13, color: mainColor }}>Fingerprint</Text>
                                                    </Button>

                                                    : null
                                            }
                                        </Col>
                                        <Col>
                                            <Button transparent style={{ alignSelf: 'flex-end' }}>
                                                <Text style={[{ color: mainColor, fontSize: 13 }]} uppercase={false} onPress={() => this.props.navigation.navigate('Register')}>Create Account</Text>
                                            </Button>
                                        </Col>
                                    </Grid>

                                </Form>
                            </View>
                            <Modal animationType="slide" transparent={true} visible={this.state.fingerprintModalVisible} onRequestClose={this.handleCloseFingerprintModal}>
                                <StatusBar hidden={true} />
                                <View style={{
                                    flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center', flexWrap: 'wrap', backgroundColor: 'rgba(0,0,0,0.5)'
                                }}>
                                    <View style={{ height: 220, backgroundColor: 'white', width: '80%', alignItems: 'center', borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.58, shadowRadius: 16, elevation: 24 }}>

                                        <Text style={[Styles.color('black'), Styles.padding(20, 'top'), { fontSize: 18 }]}>Fingerprint Authentication</Text>

                                        <Text note style={[Styles.color(textColor), Styles.padding(5, 'top'), { fontSize: 15 }]}>Confirm fingerprint to continue</Text>

                                        <View style={{ flex: 1, flexDirection: 'row', height: '100%', width: '100%', padding: 30, justifyContent: 'center' }}>
                                            <Button rounded style={{ backgroundColor: this.state.fingerprintError ? 'red' : (this.state.fingerprintSuccess ? 'green' : mainColor) }} disabled>
                                                <Icon type="FontAwesome5" name={this.state.fingerprintError ? 'exclamation' : (this.state.fingerprintSuccess ? 'check' : 'fingerprint')} style={{ color: 'white' }} />
                                            </Button>

                                            <Text note style={[Styles.margin(10), Styles.margin(20, 'left'), { height: '100%', color: this.state.fingerprintSuccess ? 'green' : 'silver' }]}>{this.state.fingerprintError ? this.state.fingerprintError : (this.state.fingerprintSuccess ? 'Success' : 'Touch Sensor')}</Text>
                                        </View>

                                        <Button transparent style={{ alignSelf: 'flex-end', margin: 5, marginTop: 20 }} onPress={this.handleCloseFingerprintModal} disabled={this.state.fingerprintSuccess ? true : false}>
                                            <Text style={{ color: mainColor }}>Cancel</Text>
                                        </Button>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </View>
                </Content>
            </Container >
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        userAuthDefault: () => dispatch(userAuthDefault()),
        loginAction: (data) => dispatch(loginAction(data)),
        loginWithFingerprint: (data) => dispatch(loginWithFingerprintAction(data))
    }
}

const mapStateToProps = (state) => {
    const userAuth = state.users.userAuth
    const { userAuthError, user } = userAuth
    return {
        userAuthError,
        user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)