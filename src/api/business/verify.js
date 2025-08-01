import request from '@/utils/request'

export const url = '/admin/api/v1/verify'

export const importDataUrl = url + '/importData'

export const uploadTemplateUrl = url + '/uploadTemplate'

export function getPage(query) {
    return request({
        url: url + '/page',
        method: 'get',
        params: query
    })
}

export function delCertificate(ids) {
    return request({
        url: url + '?ids=' + ids,
        method: 'delete',
    })
}

export function getInfo(id) {
    return request({
        url: url + '/' + id,
        method: 'get',
    })
}

export function saveOrUpdate(data) {
    return request({
        url: url,
        method: 'post',
        data: data
    })
}

export function genCertificate(data) {
return request({
        url: url + '/genCertificate?ids=' + data,
        method: 'post',
    })
}