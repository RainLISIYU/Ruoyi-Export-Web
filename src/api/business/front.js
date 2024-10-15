import request from '@/utils/request'

export const url = '/business/direct/producer'

export function sendMsg(data) {
    return request({
        url: url + '/sendTopicMessageSecond?msg=' + data.msg,
        method: 'get',
    })
}