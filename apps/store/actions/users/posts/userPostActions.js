import axios from "axios";
import { UserAuthService } from "../../../../global/services/AuthService";
import { url } from "../../../../global/config/api";
import { showAlert } from "../../../../global/components/assets/Alerts";

export const setPostsDefault = () => {
    return {
        type: 'setPostsDefault'
    }
}

export const setPostAlertDefault = () => {
    return {
        type: 'setPostAlertDefault'
    }
}

export const userCreatePost = (post) => {
    return async (dispatch) => {
        axios.post(`${url}/post`, post, await UserAuthService.getHeaders()).then(
            response => {
                let data = response.data
                if (data.status == 'success') {
                    dispatch({
                        type: 'setPostSuccess',
                        message: data.data.message
                    })
                }
                else {
                    dispatch({
                        type: 'setPostError',
                        message: data.data.message
                    })
                }
            }
        ).catch(
            err => {
                dispatch({
                    type: 'setPostError',
                    message: err.message
                })
            }
        )
    }
}

export const userEditPost = (slug, post) => {
    return async (dispatch) => {
        axios.post(`${url}/post/${slug}/edit`, post, await UserAuthService.getHeaders()).then(
            response => {
                let data = response.data
                if (data.status == 'success') {
                    dispatch({
                        type: 'setPostSuccess',
                        message: data.data.message
                    })
                }
                else {
                    dispatch({
                        type: 'setPostError',
                        message: data.data.message
                    })
                }
            }
        ).catch(
            err => {
                dispatch({
                    type: 'setPostError',
                    message: err.message
                })
            }
        )
    }
}

export const getUserPosts = (page = 1) => {
    return async (dispatch) => {
        axios.get(`${url}/user/posts/${page}`, await UserAuthService.getHeaders()).then(
            response => {
                let data = response.data
                if (data.status == 'success') {
                    dispatch({
                        type: 'setUserPosts',
                        posts: data.data.posts
                    })
                }
            }
        ).catch(
            err => {
                showAlert('Error', err.message)
            }
        )
    }
}

export const setPost = (post) => {
    return {
        type: 'setPost',
        post
    }
}

export const userDeletePost = (slug) => {
    return async (dispatch) => {
        axios.delete(`${url}/post/${slug}`, await UserAuthService.getHeaders()).then(
            response => {
                let data = response.data
                if (data.status == 'success') {
                    dispatch({
                        type: 'setPostSuccess',
                        message: data.data.message
                    })
                }
                else {
                    dispatch({
                        type: 'setPostError',
                        message: data.data.message
                    })
                }
            }
        ).catch(
            err => {
                dispatch({
                    type: 'setPostError',
                    message: err.message
                })
            }
        )
    }
}

export const getPosts = (page = 1) => {
    return (dispatch) => {
        axios.get(`${url}/posts/${page}`).then(
            response => {
                let data = response.data
                if (data.status == 'success') {
                    dispatch({
                        type: 'setPosts',
                        posts: data.data.posts
                    })
                }
            }
        ).catch(
            err => {
                showAlert('Error', err.message)
            }
        )
    }
}