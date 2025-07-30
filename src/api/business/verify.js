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