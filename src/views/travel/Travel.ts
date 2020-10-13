export interface Child {
  city: string,
  desc: string,
}

export interface ResItem {
  type: string,
  children: Child[],
}

export interface Res {
  data: ResItem[]
}
