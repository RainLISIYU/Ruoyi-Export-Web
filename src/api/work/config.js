import request from '@/utils/request.js'

export function getWorkflow(query) {
    return request({
        url: '/system/workflow/query',
        method: 'get',
        params: query
    })
}

export function saveWorkFlow(data) {
    return request({
        url: '/system/workflow/save',
        method: 'post',
        data: data
    })
}

export function deleteWorkFlow(data) {
    return request({
        url: '/system/workflow/delete?ids=' + data.join(","),
        method: 'delete',
    })
}