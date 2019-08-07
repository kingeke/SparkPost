import moment from 'moment-timezone'
import { substr, length } from 'stringz'

export const formatDate = (date, withTime = false, humanized = false) => {
    if (humanized) {
        return (
            moment(date).fromNow()
        )
    }
    else {
        return (
            // moment.utc(date).tz('Africa/Lagos').format(`${withTime ? 'Do MMM, YYYY - LT' : 'Do MMM, YYYY'}`)
            moment(date).format(`${withTime ? 'Do MMM, YYYY - LT' : 'Do MMM, YYYY'}`)
        )
    }
}

export const formatNumber = (number, withNaira = false) => {
    let naira = "\u20A6"
    let formatedNumber = parseFloat(number).toLocaleString(undefined, { minimumFractionDigits: withNaira ? 2 : 0, maximumFractionDigits: withNaira ? 2 : 0 })
    let result = withNaira ? naira + formatedNumber : formatedNumber
    return (
        result
    )
}

export const subString = (content, count) => {
    return (
        substr(content, 0, count) + (length(content) > count ? '...' : '')
    )
}