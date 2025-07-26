import request from '@/utils/request'

export const url = '/business'

export function saveMongo(data) {
    return request({
        url: url + '/api/v1/mongo/save',
        method: 'post',
        data: data
    })
}

export function getMovies(movieParams) {
    return request({
        url: url + '/api/v1/mongo/getMovies',
        method: 'get',
        params: movieParams
    })
}

export function syncMovies() {
    return request({
        url: url + '/api/v1/mongo/syncMovies',
        method: 'get'
    })
}