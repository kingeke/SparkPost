import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Header, Container, Left, Button, Icon, Body, Right, Content, Text, Card, CardItem, Grid, Row, Col } from 'native-base';
import Styles, { mainColor } from '../../../../global/components/assets/Styles';
import { formatDate, subString } from '../../../../global/components/assets/Parsers';
import { url } from '../../../../global/config/api';
import { Image, Alert } from 'react-native'
import { defaultAvatar } from '../../../../global/components/assets/Pictures';
import { userDeletePost, getUserPosts, setPostAlertDefault, getPosts } from '../../../../store/actions/users/posts/userPostActions';
import CustomModal from '../../../../global/components/layouts/CustomModal';
import { showAlert, showToastAlert } from '../../../../global/components/assets/Alerts';
import { setUser } from '../../../../store/actions/users/auth/userAuthActions';
import { Avatar } from 'react-native-elements';

class ViewPostScreen extends Component {

    state = {
        sending: false
    }

    page = this.props.navigation.getParam('page')

    componentWillReceiveProps = (newProps) => {
        if (this.state.sending) {
            this.setState({
                sending: false
            }, () => {
                if (newProps.success) {
                    this.props.setUser()
                    this.props.getUserPosts()
                    this.props.getPosts()
                    showToastAlert(newProps.success)
                    this.props.navigation.navigate(this.page == 'home' ? 'Home' : 'UserPosts')
                }
                if (newProps.error) {
                    showAlert('Error', newProps.error)
                }
                this.props.postAlertDefault()
            })
        }
    }

    handleDeletePost = (slug) => {
        Alert.alert(
            '',
            'Are you sure you want to delete this post?',
            [
                { text: 'No' },
                {
                    text: 'Yes', onPress: () => {
                        this.setState({
                            sending: true
                        }, () => {
                            this.props.deletePost(slug)
                        })
                    }
                }
            ]
        );
    }

    render() {
        const { post, user } = this.props
        const page = this.props.navigation.getParam('page')
        return (
            <Container>
                <Header style={{ backgroundColor: 'white' }} androidStatusBarColor="#eee" iosBarStyle="dark-content">
                    <Left style={{ maxWidth: '12%' }}>
                        <Button transparent onPress={() => this.props.navigation.navigate(page == 'home' ? 'Home' : 'UserPosts')}>
                            <Icon name='arrow-back' style={{ color: mainColor }} />
                        </Button>
                    </Left>
                    <Body style={{ maxWidth: '100%' }}>
                        <Text>{subString(post.title, 80)}</Text>
                    </Body>
                    <Right style={{ maxWidth: 10 }} />
                </Header>
                <Content>
                    <CustomModal visible={this.state.sending} />
                    <Card style={[Styles.margin(20, 'bottom'), { borderColor: 'white' }]} noShadow>
                        {
                            post.title.length > 80 ?
                                <CardItem>
                                    <Text>{post.title}</Text>
                                </CardItem>
                                : null
                        }

                        <CardItem>
                            <Left>
                                <Avatar size='medium' rounded source={{ uri: post.user.avatar ? `${url}/users/avatars/${post.user.avatar}` : defaultAvatar }} title={post.user.fullname[0]} />
                                <Body>
                                    <Text>{post.user.fullname}</Text>
                                    <Text note>{formatDate(post.created_at, true, true)}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        {
                            post.image ?
                                <CardItem cardBody style={Styles.margin(10, 'bottom')}>
                                    <Image source={{ uri: `${url}/uploads/${post.image}` }} style={{ height: 300, width: null, flex: 1 }} />
                                </CardItem>
                                : null
                        }

                        <CardItem cardBody style={[Styles.padding(20)]}>
                            <Grid>
                                <Row>
                                    <Text>{post.description}</Text>
                                </Row>
                            </Grid>
                        </CardItem>

                        <CardItem>
                            {
                                user.email == post.user.email ?
                                    <Grid>
                                        <Col>
                                            <Button transparent style={{ alignSelf: 'center' }} onPress={() => this.props.navigation.navigate('EditPost', { post, page: this.page })}>
                                                <Icon active name="create" style={{ color: mainColor }} />
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button transparent style={{ alignSelf: 'center' }} onPress={() => this.handleDeletePost(post.slug)}>
                                                <Icon active name="trash" style={{ color: mainColor }} />
                                            </Button>
                                        </Col>
                                    </Grid>

                                    : null
                            }
                        </CardItem>
                    </Card >
                </Content>
            </Container>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        deletePost: (slug) => dispatch(userDeletePost(slug)),
        getUserPosts: () => dispatch(getUserPosts()),
        getPosts: () => dispatch(getPosts()),
        setUser: () => dispatch(setUser()),
        postAlertDefault: () => dispatch(setPostAlertDefault())

    }
}

const mapStateToProps = (state) => {
    return {
        error: state.users.userPosts.postError,
        success: state.users.userPosts.postSuccess,
        post: state.users.userPosts.post,
        user: state.users.userAuth.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewPostScreen)
