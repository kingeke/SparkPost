import { Container, Grid, Icon, Row, Spinner } from 'native-base';
import React, { Component } from 'react';
import { TouchableHighlight } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { fromRight } from 'react-navigation-transitions';
import { mainColor } from '../assets/Styles';

export default class CustomImageViewer extends Component {

    static navigationOptions = {
        cardStack: {
            transition: () => fromRight(500),
        }
    }

    handleSwipeDown = () => {
        this.props.navigation.navigate(this.screen)
    }

    loadingRender = () => {
        return (
            <View style={{ flex: 1, width: '100%', backgroundColor: 'pink' }}></View>
        )
    }

    uri = this.props.navigation.getParam('uri')
    screen = this.props.navigation.getParam('screen')
    background = this.props.navigation.getParam('background')

    render() {
        return (
            <Container style={{ backgroundColor: this.background }}>
                <Grid>
                    <Row size={10}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate(this.screen)} style={{ backgroundColor: 'transparent', width: '100%', justifyContent: 'center', paddingLeft: 15 }}>
                            <Icon name="arrow-back" style={{ color: 'white' }} />
                        </TouchableHighlight>
                    </Row>
                    <Row size={90}>
                        <ImageViewer imageUrls={[{ url: this.uri, width: '100%' }]} style={{ flex: 1 }} enableImageZoom onSwipeDown={this.handleSwipeDown} enableSwipeDown backgroundColor={this.background} loadingRender={() => { return (<Spinner color='white' />) }} enablePreload renderIndicator={() => { return (<Spinner color={mainColor} />) }} maxOverflow={0} swipeDownThreshold={1} />
                    </Row>
                </Grid>
            </Container>
        )
    }
}