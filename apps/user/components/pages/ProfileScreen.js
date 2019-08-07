import React, { Component } from 'react'
import { Container, View, Header, Icon, Fab, Body, Title, Content, Text, List, ListItem, Separator, Left, Right, Button, Spinner } from 'native-base';
import Styles, { mainColor } from '../../../global/components/assets/Styles';
import { connect } from 'react-redux'
import { defaultAvatar } from '../../../global/components/assets/Pictures';
import { formatDate, formatNumber } from '../../../global/components/assets/Parsers';
import { Avatar } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import CustomModal from '../../../global/components/layouts/CustomModal';
import axios from 'axios';
import { url } from '../../../global/config/api';
import { UserAuthService } from '../../../global/services/AuthService';
import { setUser } from '../../../store/actions/users/auth/userAuthActions';
import { showToastAlert, showAlert } from '../../../global/components/assets/Alerts';
import { getPosts } from '../../../store/actions/users/posts/userPostActions';

class ProfileScreen extends Component {

    state = {
        loading: true,
        sending: false,
        avatar: '',
        removeAvatar: false
    }

    imageOptions = {
        noData: true,
        mediaType: 'photo',
        rotation: 360,
        allowsEditing: true
    };

    componentWillMount = () => {
        if (this.props.user) {
            this.setState({
                loading: false
            })
        }
    }

    componentWillReceiveProps = (newProps) => {
        if (newProps.user) {
            this.setState({
                loading: false
            })
        }
    }

    handleAvatarChange = () => {
        ImagePicker.showImagePicker(this.imageOptions, (response) => {
            if (response.uri) {
                this.handelResizeImage(response.uri, response.type)
            }
        });
    }

    handelResizeImage = (uri, type) => {
        ImageResizer.createResizedImage(uri, 1280, 720, 'PNG', 100, 0, null).then((response) => {
            response['type'] = type
            this.setState({
                avatar: response
            }, () => {
                this.handleUploadAvatar()
            })
        }).catch((err) => {
            showAlert('Error', err.message)
        });
    }

    handleRemoveAvatar = () => {
        this.setState({
            removeAvatar: true
        }, () => {
            this.handleUploadAvatar()
        })
    }

    handleUploadAvatar = () => {
        this.setState({
            sending: true
        }, async () => {

            let data = new FormData

            if (this.state.removeAvatar) {
                data.append('removeAvatar', true)
            }
            if (this.state.avatar) {
                data.append('avatar', this.state.avatar)
            }

            axios.post(`${url}/avatar`, data, await UserAuthService.getHeaders()).then(
                response => {
                    let data = response.data
                    this.setState({
                        sending: false,
                        removeAvatar: false,
                        avatar: ''
                    }, () => {
                        if (data.status == 'success') {
                            this.props.setUser()
                            this.props.getPosts()
                            showToastAlert(data.data.message)
                        }
                        else {
                            showAlert('Error', data.data.message)
                        }
                    })
                }
            ).catch(
                err => {
                    this.setState({
                        sending: false
                    }, () => {
                        showAlert('Error', err.message)
                    })
                }
            )
        })
    }

    render() {
        const { user } = this.props

        const userProfile = (
            <View style={{ flex: 1 }}>
                <View style={{ height: 220, justifyContent: 'center', alignItems: 'center' }}>
                    <Avatar size='xlarge' rounded source={{ uri: user.avatar ? `${url}/users/avatars/${user.avatar}` : defaultAvatar }} title={user.fullname[0]} onPress={this.handleAvatarChange} />
                    {
                        user.avatar ?
                            <Button small bordered style={{ alignSelf: 'center', marginTop: 10, borderColor: mainColor }} onPress={this.handleRemoveAvatar}>
                                <Text style={{ color: mainColor }}>Remove</Text>
                            </Button>
                            : null
                    }
                </View>
                <Content style={Styles.margin(10, 'top')}>
                    <CustomModal visible={this.state.sending} />
                    <Separator bordered>
                        <Text style={{ fontSize: 15 }} uppercase={true}>Account Information</Text>
                    </Separator>
                    <List>
                        <ListItem>
                            <Text>Fullname: {user.fullname}</Text>
                        </ListItem>
                        <ListItem>
                            <Text>Username: {user.username}</Text>
                        </ListItem>
                        <ListItem>
                            <Text>Email: {user.email}</Text>
                        </ListItem>
                        <ListItem>
                            <Text>Joined On: {formatDate(user.created_at, true)}</Text>
                        </ListItem>
                        <ListItem icon>
                            {
                                user.posts_count > 0 ?
                                    <Left>
                                        <Button transparent onPress={() => this.props.navigation.navigate('UserPosts')}>
                                            <Icon type="FontAwesome5" name="eye" style={{ color: mainColor }} />
                                        </Button>
                                    </Left>
                                    : null
                            }
                            <Body>
                                <Text>Posts: {formatNumber(user.posts_count)}</Text>
                            </Body>
                        </ListItem>
                    </List>
                </Content>
                <Fab direction="left" style={{ backgroundColor: mainColor }} position="bottomRight" onPress={() => this.props.navigation.navigate('CreatePost')} >
                    <Icon type="FontAwesome5" name="pencil-alt" />
                </Fab>
            </View>
        )

        return (
            <Container>
                <Header style={{ backgroundColor: 'white' }} androidStatusBarColor="#eee" iosBarStyle="dark-content" noLeft={true}>
                    <Body>
                        <Title style={Styles.headerTitle}>Profile</Title>
                    </Body>
                </Header>
                {
                    this.state.loading ? <Spinner color={mainColor} /> : userProfile
                }
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.users.userAuth.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: () => dispatch(setUser()),
        getPosts: () => dispatch(getPosts())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)