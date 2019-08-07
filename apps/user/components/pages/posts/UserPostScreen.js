import React, { Component } from 'react'
import { Container, Header, Left, Button, Icon, Right, Text, Body, Content, Spinner, View } from 'native-base';
import { Alert } from 'react-native';
import { mainColor } from '../../../../global/components/assets/Styles';
import { connect } from 'react-redux'
import { getUserPosts, setPost, userDeletePost, setPostAlertDefault } from '../../../../store/actions/users/posts/userPostActions';
import PostsComponent from '../../../../global/components/layouts/PostsComponent';
import CustomModal from '../../../../global/components/layouts/CustomModal';
import { showToastAlert, showAlert } from '../../../../global/components/assets/Alerts';
import { setUser } from '../../../../store/actions/users/auth/userAuthActions';

class UserPostScreen extends Component {

    initialState = {
        loading: true,
        posts: [],
        sending: false,
        page: 1,
        refreshing: false
    }

    state = this.initialState

    componentWillMount = () => {
        this.props.getUserPosts(this.state.page)
    }

    componentWillReceiveProps = (newProps) => {
        if (newProps.posts) {
            this.setState({
                loading: false,
                refreshing: false,
                posts: this.state.page == 1 ? [...newProps.posts.data] : [...this.state.posts, ...newProps.posts.data]
            })
        }
        if (this.state.sending) {
            this.setState({
                sending: false,
                page: 1
            }, () => {
                if (newProps.success) {
                    this.props.setUser()
                    this.props.getUserPosts(this.state.page)
                    showToastAlert(newProps.success)
                }
                if (newProps.error) {
                    showAlert('Error', newProps.error)
                }
                this.props.postAlertDefault()
            })
        }
    }

    _onRefresh = () => {
        this.setState({
            refreshing: true,
            page: 1
        }, () => {
            this.props.getUserPosts(this.state.page)
        });
    }

    handleViewPost = (post) => {
        this.props.setPost(post)
        this.props.navigation.navigate('ViewPost', {
            page: 'user'
        })
    }

    handleEditPost = (post) => {
        this.props.navigation.navigate('EditPost', {
            post,
            page: 'user'
        })
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
                            setTimeout(() => {
                                this.setState({
                                    sending: false
                                })
                            }, 3000);
                            // this.props.deletePost(slug)
                        })
                    }
                }
            ]
        );
    }

    handleLoadMore = () => {
        this.setState({
            page: this.state.page + 1
        }, () => {
            this.state.page <= this.props.posts.lastPage ? this.props.getUserPosts(this.state.page) : null
        })
    }

    render() {

        const { posts } = this.state

        return (
            <Container>
                <Header style={{ backgroundColor: 'white' }} androidStatusBarColor="#eee" iosBarStyle="dark-content">
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate('Profile')}>
                            <Icon name='arrow-back' style={{ color: mainColor }} />
                        </Button>
                    </Left>
                    <Body>
                        <Text>Your Posts</Text>
                    </Body>
                    <Right />
                </Header>
                <CustomModal visible={this.state.sending} />
                <View style={{ flex: 1 }}>
                    {
                        this.state.loading ?

                            <Spinner color={mainColor} />
                            :
                            <PostsComponent posts={posts} showPublic={true} handleDeletePost={this.handleDeletePost} handleViewPost={this.handleViewPost} handleEditPost={this.handleEditPost} humanizedTime={true} refreshing={this.state.refreshing} onRefresh={this._onRefresh} handleLoadMore={this.handleLoadMore} lastPage={this.props.posts.lastPage} currentPage={this.state.page} navigation={this.props.navigation} screen={'UserPosts'} />
                    }
                </View>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        posts: state.users.userPosts.userPosts,
        error: state.users.userPosts.postError,
        success: state.users.userPosts.postSuccess,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUserPosts: (page) => dispatch(getUserPosts(page)),
        deletePost: (slug) => dispatch(userDeletePost(slug)),
        postAlertDefault: () => dispatch(setPostAlertDefault()),
        setPost: (post) => dispatch(setPost(post)),
        setUser: () => dispatch(setUser())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPostScreen)
