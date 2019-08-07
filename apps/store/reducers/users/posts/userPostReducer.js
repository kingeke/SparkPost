const initialState = {
    posts: false,
    userPosts: false,
    post: false,
    postSuccess: false,
    postError: false
}

const userPostReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'setPostsDefault':
            return setPostsDefault(state)
        case 'setPostAlertDefault':
            return setPostAlertDefault(state)
        case 'setPosts':
            return setPosts(state, action)
        case 'setUserPosts':
            return setUserPosts(state, action)
        case 'setPost':
            return setPost(state, action)
        case 'setPostSuccess':
            return setPostSuccess(state, action)
        case 'setPostError':
            return setPostError(state, action)

        default:
            return state
    }
}

const setPostAlertDefault = (state) => {
    return {
        ...state,
        postSuccess: false,
        postError: false
    }
}

const setPostsDefault = (state) => {
    return {
        ...state,
        posts: false,
        post: false,
        postSuccess: false,
        postError: false
    }
}

const setPostError = (state, action) => {
    return {
        ...state,
        postError: action.message,
        postSuccess: false
    }
}

const setPostSuccess = (state, action) => {
    return {
        ...state,
        postSuccess: action.message,
        postError: false
    }
}

const setUserPosts = (state, action) => {
    return {
        ...state,
        userPosts: action.posts,
        postSuccess: false,
        postError: false
    }
}

const setPosts = (state, action) => {
    return {
        ...state,
        posts: action.posts,
        postSuccess: false,
        postError: false
    }
}

const setPost = (state, action) => {
    return {
        ...state,
        post: action.post,
        postSuccess: false,
        postError: false
    }
}

export default userPostReducer