const initialState = {
    userAuthError: false,
    userAuthSuccess: false,
    user: false
}

const userAuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'userAuthDefault':
            return userAuthDefault(state)
        case 'setUser':
            return setUser(state, action)
        case 'userAuthError':
            return userAuthError(state, action)
        case 'userAuthSuccess':
            return userAuthSuccess(state, action)
        default:
            return state
    }
}

const userAuthError = (state, action) => {
    return {
        ...state,
        user: false,
        userAuthSuccess: false,
        userAuthError: action.message
    }
}

const userAuthSuccess = (state, action) => {
    return {
        ...state,
        userAuthError: false,
        user: action.user || false,
        userAuthSuccess: action.message
    }
}

const setUser = (state, action) => {
    return {
        ...state,
        user: action.user,
        userAuthError: false,
        userAuthSuccess: false
    }
}
const userAuthDefault = (state) => {
    return {
        ...state,
        userAuthError: false,
        userAuthSuccess: false,
        user: initialState.user || false
    }
}

export default userAuthReducer