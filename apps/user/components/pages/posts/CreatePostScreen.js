import React, { Component } from 'react'
import { Image, BackHandler } from 'react-native'
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { Container, Header, Icon, Left, Button, Right, Text, Form, Item, Label, Input, Content, Grid, Col, Textarea, FooterTab, Footer, Picker } from 'native-base';
import Styles, { mainColor, textColor } from '../../../../global/components/assets/Styles';
import { defaultAvatar } from '../../../../global/components/assets/Pictures';
import { showAlert, showToastAlert } from '../../../../global/components/assets/Alerts';
import ValidationComponent from 'react-native-form-validator';
import CustomModal from '../../../../global/components/layouts/CustomModal';
import { connect } from 'react-redux'
import { userCreatePost, setPostAlertDefault, getPosts } from '../../../../store/actions/users/posts/userPostActions';
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { setUser } from '../../../../store/actions/users/auth/userAuthActions';
import { Avatar } from 'react-native-elements';
import { url } from '../../../../global/config/api';

class CreatePostScreen extends ValidationComponent {

    initialState = {
        image: '',
        title: '',
        titleErrors: [],
        description: '',
        descriptionErrors: [],
        visible: 'yes',
        sending: false
    }

    imageOptions = {
        title: 'Select Lead Image',
        noData: true,
        mediaType: 'photo',
        rotation: 360,
        allowsEditing: true
    };

    backHandler

    state = this.initialState

    componentWillMount = async () => {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        try {
            var post = await AsyncStorage.getItem('post')
            if (post) {
                post = JSON.parse(post)
                this.setState(post)
                await AsyncStorage.removeItem('post')
            }
        } catch (e) {
            alert(e.message)
        }
    }

    handleSavePost = async () => {
        try {
            await AsyncStorage.setItem('post', JSON.stringify(this.state))
        } catch (e) {
            alert(e.message)
        }
        showToastAlert('Post saved successfully', 1000)
        this.props.navigation.navigate('Dashboard')
    }

    componentWillUnmount = () => {
        this.backHandler.remove()
    }

    handleBackPress = () => {
        if (this.state.title.length > 0 || this.state.description.length > 0 || this.state.image) {
            Alert.alert(
                '',
                'Save draft?',
                [
                    { text: 'Continue' },
                    {
                        text: 'Discard',
                        onPress: () => this.props.navigation.navigate('Dashboard'),
                        style: 'cancel',
                    },
                    { text: 'Save', onPress: this.handleSavePost },
                ],
                { cancelable: false },
            );
            return true
        }
        else {
            return this.props.navigation.navigate('Dashboard')
        }
    }

    componentWillReceiveProps = (newProps) => {
        if (this.state.sending) {
            this.setState({
                sending: false
            }, () => {
                if (newProps.success) {
                    showToastAlert(newProps.success)
                    this.setState(this.initialState)
                    this.props.getPosts(1)
                    this.props.setUser()
                    this.props.navigation.navigate('Home')
                }
                if (newProps.error) {
                    showAlert('Error', newProps.error)
                }
                this.props.postAlertDefault()
            })
        }
    }

    handleChange = (target, value) => {
        this.setState({
            [target]: value,
            [target + 'Errors']: []
        })
    }

    handlePhotoPicker = () => {
        ImagePicker.launchImageLibrary(this.imageOptions, (response) => {
            if (response.uri) {
                this.handelResizeImage(response.uri, response.type)
            }
        });
    }

    handleCameraTaker = () => {

        ImagePicker.launchCamera(this.imageOptions, (response) => {
            if (response.uri) {
                this.handelResizeImage(response.uri, response.type)
            }
        });
    }

    handelResizeImage = (uri, type) => {

        ImageResizer.createResizedImage(uri, 1280, 720, 'PNG', 100, 0, null).then((response) => {
            response['type'] = type
            this.setState({
                image: response
            })
        }).catch((err) => {
            showAlert('Error', err.message)
        });
    }

    handleSubmit = () => {

        this.props.postAlertDefault()

        this.validate({
            title: { required: true, minlength: 3, },
            description: { required: true, minlength: 10 }
        });

        this.setState({
            titleErrors: this.getErrorsInField('title'),
            descriptionErrors: this.getErrorsInField('description'),
        }, () => {
            if (this.isFormValid()) {
                this.setState({
                    sending: true
                }, () => {
                    let data = new FormData
                    data.append('image', this.state.image)
                    data.append('title', this.state.title)
                    data.append('description', this.state.description)
                    data.append('visible', this.state.visible)
                    this.props.createPost(data)
                })
            }
        })
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: 'white' }} androidStatusBarColor="#eee" iosBarStyle="dark-content" noShadow>
                    <Left>
                        <Button transparent onPress={this.handleBackPress}>
                            <Icon name='close' style={{ color: mainColor }} />
                        </Button>
                    </Left>
                    <Right>
                        <Button iconLeft block rounded style={[{ backgroundColor: mainColor }]} small onPress={this.handleSubmit}>
                            <Text uppercase={false}>Create</Text>
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <CustomModal visible={this.state.sending} />
                    <Grid>
                        <Col size={20} style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                            <Avatar size='medium' rounded source={{ uri: this.props.user.avatar ? `${url}/users/avatars/${this.props.user.avatar}` : defaultAvatar }} title={this.props.user.fullname[0]} />
                        </Col>
                        <Col size={80}>
                            <Content style={Styles.margin(20, 'right')}>
                                <Form>
                                    <Item stackedLabel style={[Styles.margin(20, 'bottom'), { borderBottomColor: 'white' }]}>
                                        <Label>Title</Label>
                                        <Input style={{ borderBottomColor: this.state.titleErrors.length > 0 ? 'red' : '#eee', borderBottomWidth: 1 }} onChangeText={(text) => this.handleChange('title', text)} value={this.state.title} />

                                        {
                                            this.state.titleErrors.length > 0 ? <Text style={[Styles.margin(15), Styles.color('red'), { fontSize: 13, borderBottomColor: 'white' }]}>{this.state.titleErrors[0]}</Text> : null
                                        }
                                    </Item>
                                    <Textarea rowSpan={8} bordered placeholder="Enter description" style={[{ borderColor: this.state.descriptionErrors.length > 0 ? 'red' : '#eee', marginLeft: 15 }]} onChangeText={(text) => this.handleChange('description', text)} value={this.state.description} />
                                    {
                                        this.state.descriptionErrors.length > 0 ? <Text style={[Styles.margin(15, 'left'), Styles.color('red'), { fontSize: 13, borderBottomColor: 'white' }]}>{this.state.descriptionErrors[0]}</Text> : null
                                    }

                                    <Item>
                                        <Text style={[Styles.margin(15, 'top'), Styles.margin(20, 'right'), Styles.color(textColor), { borderBottomColor: 'white' }]}>Public ?</Text>

                                        <Picker mode="dropdown" iosIcon={<Icon name="arrow-down" />} placeholder="Select your SIM" placeholderStyle={{ color: "#bfc6ea" }} placeholderIconColor="#007aff" style={[{ width: undefined }, Styles.margin(10, 'top')]} selectedValue={this.state.visible} onValueChange={(value) => this.handleChange('visible', value)}>
                                            <Picker.Item label="Yes" value="yes" />
                                            <Picker.Item label="No" value="no" />
                                        </Picker>
                                    </Item>

                                    <Item bordered={false} underline={false} style={[{ borderBottomColor: 'white' }, Styles.margin(20, 'top')]}>
                                        <Text style={{ color: textColor }}>Lead Image: {!this.state.image ? 'Select the button below to pick or take a picture' : ''}</Text>
                                    </Item>
                                    {
                                        this.state.image ?
                                            <Item style={[{ borderBottomColor: 'white' }, Styles.margin(10, 'top')]}>
                                                <Image source={{ uri: this.state.image.uri }} style={[Styles.width('100%'), Styles.height(200), { padding: 10, borderRadius: 30 }]} resizeMode='contain' resizeMethod='scale' />
                                            </Item>
                                            : null
                                    }

                                </Form>
                            </Content>
                        </Col>
                    </Grid>
                </Content>
                <Footer>
                    <FooterTab style={{ backgroundColor: 'white' }}>
                        <Button onPress={this.handlePhotoPicker}>
                            <Icon name="photos" style={{ color: 'gray' }} />
                        </Button>
                        <Button onPress={this.handleCameraTaker}>
                            <Icon name="camera" style={{ color: 'gray' }} />
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createPost: (post) => dispatch(userCreatePost(post)),
        postAlertDefault: () => dispatch(setPostAlertDefault()),
        setUser: () => dispatch(setUser()),
        getPosts: (page) => dispatch(getPosts(page)),
    }

}

const mapStateToProps = (state) => {
    return {
        success: state.users.userPosts.postSuccess,
        error: state.users.userPosts.postError,
        user: state.users.userAuth.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePostScreen)