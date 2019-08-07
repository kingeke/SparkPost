import { StyleSheet } from 'react-native'

export const mainColor = '#F2632A'
export const textColor = '#56565A'
export const bgColor = '#b84518'
export default StyleSheet.create({
    mainBG: {
        backgroundColor: mainColor,

    },
    headerTitle: {
        color: mainColor,
        fontWeight: 'bold'
    },
    parent: {
        flex: 1,
        justifyContent: 'center'
    },
    alignSelf: (position) => {
        return {
            alignSelf: position
        }
    },
    shadow: () => {
        return {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 12
            },
            shadowOpacity: 0.58,
            shadowRadius: 16,
            elevation: 24
        }
    },
    alignItem: (position) => {
        return {
            alignItems: position
        }
    },
    color: (color) => {
        return {
            color
        }
    },
    width: (size) => {
        return {
            width: size
        }
    },
    height: (size) => {
        return {
            height: size
        }
    },
    margin: (size, type = null) => {
        switch (type) {
            case 'top':
                return {
                    marginTop: size,
                }
            case 'left':
                return {
                    marginLeft: size
                }
            case 'right':
                return {
                    marginRight: size
                }
            case 'bottom':
                return {
                    marginBottom: size
                }
            default:
                return {
                    margin: size
                }
        }
    },
    padding: (size, type = null) => {
        switch (type) {
            case 'top':
                return {
                    paddingTop: size
                }
            case 'left':
                return {
                    paddingLeft: size
                }
            case 'right':
                return {
                    paddingRight: size
                }
            case 'bottom':
                return {
                    paddingBottom: size
                }
            default:
                return {
                    padding: size
                }
        }
    }
})