import AsyncStorage from '@react-native-community/async-storage';

export const UserAuthService = {
    isAuthenticated: false,
    async authenticate(user) {
        this.isAuthenticated = true
        try {
            await AsyncStorage.setItem('user', JSON.stringify(user))
        } catch (e) {
            alert(e.message)
        }
    },
    async signOut() {
        AsyncStorage.removeItem('user')
        this.isAuthenticated = false
    },
    async getClient() {
        try {
            let user = await AsyncStorage.getItem('user')
            if (user) {
                return JSON.parse(user)
            }
            return false
        } catch (e) {
            alert(e.message)
        }

    },
    async getHeaders() {
        try {
            var user = await AsyncStorage.getItem('user')
            if (user) {
                user = JSON.parse(user)
                return {
                    'headers': {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'Application/json',
                        'Accept': 'Application/json',
                    }
                }
            }
            return false
        }
        catch (e) {
            alert(e.message)
        }
    }
}