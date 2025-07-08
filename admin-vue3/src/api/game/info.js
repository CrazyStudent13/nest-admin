// 游戏信息模块API
import request from '@/utils/request'

// 查询游戏信息列表
export function listGameInfo(query) {
  return request({
    url: '/game/info/list',
    method: 'get',
    params: query
  })
}

// 查询游戏信息详细
export function getGameInfo(gameId) {
  return request({
    url: '/game/info/' + gameId,
    method: 'get'
  })
}

// 新增游戏信息
export function addGameInfo(data) {
  return request({
    url: '/game/info',
    method: 'post',
    data: data
  })
}

// 修改游戏信息
export function updateGameInfo(data) {
  return request({
    url: '/game/info',
    method: 'put',
    data: data
  })
}

// 删除游戏信息
export function delGameInfo(gameId) {
  return request({
    url: '/game/info/' + gameId,
    method: 'delete'
  })
}
