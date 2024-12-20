import request from '@/utils/request.js'

export function getWorkflow(query) {
    return request({
        url: '/system/workflow/query',
        method: 'get',
        params: query
    })
}