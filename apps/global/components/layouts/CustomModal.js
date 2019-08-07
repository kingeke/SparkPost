import React from 'react'
import { View, Text, Modal, StatusBar } from 'react-native'
import { Spinner } from 'native-base'
import Styles, { mainColor } from '../assets/Styles';

const CustomModal = ({ visible }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}>
            <StatusBar backgroundColor={mainColor} barStyle='light-content' />
            <View style={{
                flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center', flexWrap: 'wrap', backgroundColor: 'rgba(0,0,0,0.5)'
            }}>
                <View style={{ height: 90, backgroundColor: 'white', width: 200, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.58, shadowRadius: 16, elevation: 24 }}>
                    <Spinner color={mainColor} />
                    <Text style={[Styles.margin(20, 'left'), Styles.color('black')]}>Please Wait...</Text>
                </View>
            </View>
        </Modal>
    )
}

export default CustomModal
