export interface FormItem {
  username: string,
  password: string,
  mobile: string,
  verification: string,
  nickname: string,
  passWords: string,
  checkPass: string,
}

export interface RulesItem {
  required?: boolean,
  message?: string,
  trigger: string,
  min?: number,
  pattern?: any,
  validator?: any,
  validatePass?: any,
}

export interface Rules {
  username?: RulesItem[],
  password?: RulesItem[],
  mobile?: RulesItem[],
  verification?: RulesItem[],
  nickname?: RulesItem[],
  checkPass?: RulesItem[],
  passWords?: RulesItem[],
  cdcared?: RulesItem[],
}

export interface ResItem {
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

export interface Res {
  token: string,
  user: ResItem
}