import axios from 'axios'
import { url } from '../../../../global/config/api';
import { UserAuthService } from '../../../../global/services/AuthService';
import { showAlert } from '../../../../global/components/assets/Alerts';

export const userAuthDefault = () => {
    return {
        type: 'userAuthDefault'
    }
}

export const registerAction = (data) => {
    return (dispatch) => {
        axios.post(`${url}/sign-up`, data).then(
            response => {
                let data = response.data
                if (data.status == 'error') {
                    dispatch({
                        type: 'userAuthError',
                        message: data.data.message
                    })
                }
                if (data.status == 'success') {

                    const user = data.data.user

                    UserAuthService.authenticate(user).then(
                        () => {
                            dispatch({
                                type: 'setUser',
                                user
                            })
                        }
                    ).catch(
                        err => {
                            dispatch({
                                type: 'userAuthError',
                                message: err.message
                            })
                        }
                    )
                }
            }
        ).catch(
            err => {
                dispatch({
                    type: 'userAuthError',
                    message: err.message
                })
            }
        )
    }
}

export const loginAction = (data) => {
    return (dispatch) => {
        axios.post(`${url}/login`, data).then(
            response => {
                let data = response.data
                if (data.status == 'error') {
                    dispatch({
                        type: 'userAuthError',
                        message: data.data.message
                    })
                }
                if (data.status == 'success') {

                    const user = data.data.user

                    UserAuthService.authenticate(user).then(
                        () => {
                            dispatch({
                                type: 'setUser',
                                user
                            })
                        }
                    ).catch(
                        err => {
                            dispatch({
                                type: 'userAuthError',
                                message: err.message
                            })
                        }
                    )
                }
            }
        ).catch(
            err => {
                dispatch({
                    type: 'userAuthError',
                    message: err.message
                })
            }
        )
    }
}

export const loginWithFingerprintAction = (data) => {
    return (dispatch) => {
        axios.post(`${url}/login-fingerprint`, data).then(
            response => {
                let data = response.data
                if (data.status == 'error') {
                    dispatch({
                        type: 'userAuthError',
                        message: data.data.message
                    })
                }
                if (data.status == 'success') {

                    const user = data.data.user

                    UserAuthService.authenticate(user).then(
                        () => {
                            dispatch({
                                type: 'setUser',
                                user
                            })
                        }
                    ).catch(
                        err => {
                            dispatch({
                                type: 'userAuthError',
                                message: err.message
                            })
                        }
                    )
                }
            }
        ).catch(
            err => {
                dispatch({
                    type: 'userAuthError',
                    message: err.message
                })
            }
        )
    }
}

export const setUser = () => {
    return async (dispatch) => {
        var user = await UserAuthService.getClient()
        if (user) {
            axios.get(`${url}/user`, await UserAuthService.getHeaders()).then(
                response => {
                    let data = response.data
                    if (data.status == 'success') {
                        dispatch({
                            type: 'setUser',
                            user: data.data.user
                        })
                    }
                }
            ).catch(
                err => {
                    UserAuthService.signOut().then(
                        () => {
                            dispatch({
                                type: 'setUser',
                                user: null
                            })
                        }
                    )
                }
            )
        }
        else {
            dispatch({
                type: 'setUser',
                user: null
            })
        }
    }
}