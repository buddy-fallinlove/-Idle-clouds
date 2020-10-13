
export interface ResItem {
  desc: string
  url: string
}

export interface Res {
  total: number,
  data: ResItem[]
}

export interface User {
  created_at: number
  defaultAvatar: string
  email: any
  id: number
  nickname: string
  role: number
  starPosts: any
  updated_at: number
  username: string
}