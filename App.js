import React, { Component } from 'react'
import { Root } from 'native-base'
import MainApp from './MainApp';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './apps/store/reducers/rootReducer';
import { StatusBar } from 'react-native'
import SplashScreen from 'react-native-splash-screen'

export default class App extends Component {

  componentDidMount() {
    SplashScreen.hide()
  }

  render() {

    const store = createStore(rootReducer, applyMiddleware(thunk))

    return (
      <Root>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <Provider store={store}>
          <MainApp />
        </Provider>
      </Root>
    )
  }
}
