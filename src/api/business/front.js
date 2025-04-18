import request from '@/utils/request'
import * as buffer from "buffer";

export const url = '/business'

export function sendMsg(data) {
    return request({
        url: url + '/direct/producer/sendTopicMessageFirst?msg=' + data.msg,
        method: 'get',
    })
}

export function getInfo() {
    return request({
        url: url + '/dubbo/getInfo',
        method: 'get',
    })
}

export function getUser() {
    return request({
        url: url + '/dubbo/getUser/1',
        method: 'get',
    })
}

export function simpleChat(data) {
    return request({
        url: url + '/aiChat/rag/chat',
        method: 'get',
        params: {
            'input': data
        }
    })
}

export async function  streamChat(data) {
    return request({
        url: url + '/aiChat/stream/chat?input=' +  data,
        method: 'get',
    })
}

export function chatRetrieve(data) {
    return request({
        url: url + '/aiChat/similar',
        method: 'get',
        params: {
            'input': data
        }
    })
}

export function chatForm(data) {
    return request({
        url: url + '/ai/chatForm',
        method: 'get',
        params: {
            'input': data
        }
    })
}