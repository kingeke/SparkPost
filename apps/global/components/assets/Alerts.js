import { Toast } from "native-base";
import { Alert } from 'react-native'

export const showAlert = (title, message) => {
    Alert.alert(
        title,
        message,
        [
            { text: 'OK' },
        ]
    );
}

export const showToastAlert = (message, duration = 3000) => {
    Toast.show({
        text: message,
        duration
    })
}
