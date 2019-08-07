import { Body, Container, Fab, Header, Icon, Spinner, Title, View } from 'native-base';
import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { showAlert, showToastAlert } from '../../../global/components/assets/Alerts';
import Styles, { mainColor } from '../../../global/components/assets/Styles';
import CustomModal from '../../../global/components/layouts/CustomModal';
import PostsComponent from '../../../global/components/layouts/PostsComponent';
import { setUser } from '../../../store/actions/users/auth/userAuthActions';
import { getPosts, setPost, setPostAlertDefault, userDeletePost } from '../../../store/actions/users/posts/userPostActions';

class HomeScreen extends Component {

    static navigationOptions = {
        tabBarOnPress: (scene) => {
            if (!scene.navigation.isFocused()) {
                scene.navigation.navigate(scene.navigation.state.routeName)
            }
            else {
                scene.navigation.state.params.scrollToTop()
            }
        },
        tabBarOnLongPress: (scene) => {
            if (!scene.navigation.isFocused()) {
                scene.navigation.navigate(scene.navigation.state.routeName)
            }
            else {
                scene.navigation.state.params.scrollToTop()
            }
        }
    }

    state = {
        loading: true,
        posts: [],
        page: 1,
        sending: false,
        refreshing: false
    }

    flatList

    componentWillMount = () => {
        this.handleGetPost()
        this.props.navigation.setParams({
            scrollToTop: this._scrollToTop,
        });
    }

    _scrollToTop = () => {
        if (this.flatList) {
            this.flatList.scrollToOffset({ x: 0, y: 0, animated: true })
        }
    }

    componentWillReceiveProps = (newProps) => {
        if (newProps.posts) {
            this.setState({
                loading: false,
                refreshing: false,
                page: newProps.posts.page,
                posts: newProps.posts.page == 1 ? newProps.posts.data : [...this.state.posts, ...newProps.posts.data]
            })
        }
        if (this.state.sending) {
            this.setState({
                sending: false
            }, () => {
                if (newProps.success) {
                    this.props.setUser()
                    this.props.getPosts()
                    showToastAlert(newProps.success)
                }
                if (newProps.error) {
                    showAlert('Error', newProps.error)
                }
                this.props.postAlertDefault()
            })
        }
        if (this.state.refreshing) {
            this.setState({
                refreshing: false
            })
        }
    }

    _onRefresh = () => {
        this.setState({
            refreshing: true,
            page: 1
        }, () => {
            this.props.getPosts(this.state.page)
        });
    }

    handleGetPost = () => {
        this.setState({
            loading: true
        }, () => {
            this.props.getPosts(this.state.page)
        })
    }

    handleViewPost = (post) => {
        this.props.setPost(post)
        this.props.navigation.navigate('ViewPost', {
            page: 'home'
        })
    }

    handleEditPost = (post) => {
        this.props.navigation.navigate('EditPost', {
            post,
            page: 'home'
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
                            this.props.deletePost(slug)
                        })
                    }
                }
            ]
        );
    }

    getRef = (ref) => {
        this.flatList = ref
    }

    handleLoadMore = () => {
        this.setState({
            page: this.state.page + 1
        }, () => {
            this.state.page <= this.props.posts.lastPage ? this.props.getPosts(this.state.page) : null
        })
    }

    render() {

        const { posts } = this.state

        return (
            <Container>
                <Header style={{ backgroundColor: 'white' }} androidStatusBarColor="#eee" iosBarStyle="dark-content" noLeft={true}>
                    <Body>
                        <Title style={Styles.headerTitle}>Home</Title>
                    </Body>
                </Header>
                <CustomModal visible={this.state.sending} />
                <View style={{ flex: 1 }}>
                    {
                        this.state.loading ?

                            <Spinner color={mainColor} />

                            :

                            <PostsComponent posts={posts} showPublic={false} handleDeletePost={this.handleDeletePost} handleViewPost={this.handleViewPost} handleEditPost={this.handleEditPost} humanizedTime={true} showUser={true} refreshing={this.state.refreshing} onRefresh={this._onRefresh} handleLoadMore={this.handleLoadMore} lastPage={this.props.posts.lastPage} currentPage={this.state.page} getRef={this.getRef} navigation={this.props.navigation} screen={'Home'} />
                    }
                    <Fab direction="left" style={{ backgroundColor: mainColor }} position="bottomRight" onPress={() => this.props.navigation.navigate('CreatePost')} >
                        <Icon type="FontAwesome5" name="pencil-alt" />
                    </Fab>
                </View>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.users.userAuth.user,
        posts: state.users.userPosts.posts,
        error: state.users.userPosts.postError,
        success: state.users.userPosts.postSuccess,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        deletePost: (slug) => dispatch(userDeletePost(slug)),
        postAlertDefault: () => dispatch(setPostAlertDefault()),
        setPost: (post) => dispatch(setPost(post)),
        getPosts: (page) => dispatch(getPosts(page)),
        setUser: () => dispatch(setUser())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)