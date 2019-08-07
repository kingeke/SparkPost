import { Body, Card, CardItem, Col, Grid, Icon, Left, Row, Spinner, Text } from 'native-base';
import React, { Component } from 'react';
import { FlatList, RefreshControl, TouchableHighlight, View } from 'react-native';
import { Avatar, Image as NativeImage } from 'react-native-elements';
import { connect } from 'react-redux';
import { url } from '../../config/api';
import { formatDate, subString } from '../assets/Parsers';
import { defaultAvatar } from '../assets/Pictures';
import Styles, { mainColor } from '../assets/Styles';
import CustomModal from './CustomModal';

class PostsComponent extends Component {

    state = {
        uri: '',
        visible: false,
        underlayShowing: false
    }

    handleShowImage = (type, image, background = '#000') => {
        this.setState({
            uri: `${url}/${type == 'post' ? 'uploads' : 'users/avatars'}/${image}`
        }, () => {
            this.props.navigation.navigate('ImageViewer', {
                uri: this.state.uri,
                background,
                screen: this.props.screen
            })
        })
    }

    shouldComponentUpdate = () => {
        const { lastPage, currentPage } = this.props
        if (currentPage <= lastPage) {
            return true
        }
        return false
    }

    onShowUnderlay = () => {
        this.setState({
            underlayShowing: true
        })
    }

    onHideUnderlay = () => {
        this.setState({
            underlayShowing: false
        })
    }

    itemSeparator = () => {
        return (
            <View style={{ height: 1, width: '100%', backgroundColor: '#eee' }} />
        )
    }

    renderFooterComponent = (currentPage, lastPage) => {
        if (currentPage <= lastPage) {
            return (
                <Spinner color={mainColor} />
            )
        }
        else {
            return (
                <View style={{ borderTopColor: '#eee', borderTopWidth: 1, justifyContent: 'center', height: 100 }}>
                    <Text transparent style={{ alignSelf: 'center', fontSize: this.props.posts.length == 0 ? 20 : 30, fontWeight: 'bold', color: mainColor }}>{this.props.posts.length == 0 ? 'No Posts Yet' : '.'}</Text>
                </View>
            )
        }
    }

    renderItem = ({ item, index }) => {
        const { user, showPublic = false, handleViewPost, handleEditPost, handleDeletePost, humanizedTime = false, showUser = false } = this.props

        const post = item
        return (
            <TouchableHighlight underlayColor='white' onPress={() => handleViewPost(post)}>
                <Card key={index} style={[Styles.margin(20, 'bottom'), { borderColor: 'white' }]} noShadow>
                    <CardItem header>
                        <Left>
                            <Avatar onPress={() => this.handleShowImage('user', post.user.avatar ? post.user.avatar : 'default.png')} size='medium' rounded source={{ uri: post.user.avatar ? `${url}/users/avatars/${post.user.avatar}` : defaultAvatar }} title={post.user.fullname[0]} />
                            <Body>
                                <Text>{subString(post.title, 35)}</Text>
                                <Grid>
                                    {
                                        showUser ?
                                            <Col>
                                                <Text note>{`@${post.user.username}`}</Text>
                                            </Col>
                                            : null
                                    }
                                    <Col>
                                        <Text note style={{ textAlign: showUser ? 'right' : 'left', fontSize: 13, paddingRight: 0, marginRight: 0 }}>{formatDate(post.created_at, true, humanizedTime)}</Text>
                                    </Col>
                                </Grid>
                            </Body>
                        </Left>
                    </CardItem>
                    {
                        post.image ?
                            <CardItem cardBody style={[Styles.margin(10, 'bottom'), { alignSelf: 'center' }]}>
                                <TouchableHighlight onPress={() => this.handleShowImage('post', post.image, post.background)} activeOpacity={0.8} underlayColor='#eee' onShowUnderlay={this.onShowUnderlay} onHideUnderlay={this.onHideUnderlay}>
                                    <NativeImage source={{ uri: `${url}/uploads/${post.image}` }} style={{ width: 500, height: 200, flex: 1 }} PlaceholderContent={<View style={{ flex: 1, width: '100%', backgroundColor: post.background || mainColor }}></View>} />
                                </TouchableHighlight>
                            </CardItem>
                            : null
                    }

                    <CardItem cardBody style={[Styles.padding(20)]}>
                        <Grid>
                            <Row>
                                <Text>{subString(post.description, 200)}</Text>
                            </Row>
                            {
                                showPublic ?
                                    <Row>
                                        <Text note>Public: {post.visible ? 'Yes' : 'No'}</Text>
                                    </Row>
                                    : null
                            }

                        </Grid>
                    </CardItem>
                    {
                        user.email == post.user.email ?
                            <CardItem footer style={{ paddingBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}>

                                <Grid style={{ paddingTop: 20, paddingBottom: 0, marginTop: 0, marginBottom: 0 }}>
                                    <Col>
                                        <TouchableHighlight style={{ alignSelf: 'center', width: '100%', alignItems: 'center' }} underlayColor='white' onPress={() => handleEditPost(post)}>
                                            <Icon active name="create" style={{ color: mainColor }} />
                                        </TouchableHighlight>
                                    </Col>
                                    <Col>
                                        <TouchableHighlight style={{ alignSelf: 'center', width: '100%', alignItems: 'center' }} underlayColor='white' onPress={() => handleDeletePost(post.slug)}>
                                            <Icon active name="trash" style={{ color: mainColor }} />
                                        </TouchableHighlight>
                                    </Col>
                                </Grid>
                            </CardItem>
                            : null
                    }
                </Card>
            </TouchableHighlight>
        )
    }

    render() {
        const { posts, refreshing, onRefresh, handleLoadMore, lastPage, currentPage } = this.props
        return (
            <>
                <View style={{ flex: 1 }}>
                    <FlatList
                        ref={(FlatList) => this.props.getRef ? this.props.getRef(FlatList) : null}
                        data={posts}
                        keyExtractor={(item, index) => { return index.toString() }}
                        ItemSeparatorComponent={this.itemSeparator}
                        removeClippedSubviews={true}
                        initialNumToRender={10}
                        ListFooterComponent={() => this.renderFooterComponent(currentPage, lastPage)}
                        refreshControl={<RefreshControl colors={[mainColor]} progressBackgroundColor='white' refreshing={refreshing} onRefresh={onRefresh} />}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={2.5}
                        renderItem={this.renderItem}
                    />
                </View>
                <CustomModal visible={this.state.visible} />
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.users.userAuth.user
    }
}

export default connect(mapStateToProps)(PostsComponent)
