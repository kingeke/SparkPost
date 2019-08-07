import { combineReducers } from 'redux'
import userAuthReducer from './users/auth/userAuthReducer';
import userPostReducer from './users/posts/userPostReducer';

const rootReducer = combineReducers({
    users: combineReducers({
        userAuth: userAuthReducer,
        userPosts: userPostReducer
    })
})

export default rootReducer