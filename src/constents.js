export const GRID = 8;
export const ARENA_WIDTH = 10
export const ARENA_HEIGHT = 20

export const background = "#00000033"

const I = [
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 0]
]

const J = [
  [2, 0, 0],
  [2, 2, 2],
  [0, 0, 0]
]

const L = [
  [0, 0, 3],
  [3, 3, 3],
  [0, 0, 0]
]

const O = [
  [4, 4],
  [4, 4],
]

const S = [
  [0, 5, 5],
  [5, 5, 0],
  [0, 0, 0]
]

const T = [
  [0, 6, 0],
  [6, 6, 6],
  [0, 0, 0]
]

const Z = [
  [7, 7, 0],
  [0, 7, 7],
  [0, 0, 0]
]

export const pieces = [I, J, L, O, S, T, Z]
export const prePieces = [
  [
    [1, 1, 1, 1]
  ],

  [
    [2, 2, 2],
    [0, 0, 2]
  ],

  [
    [3, 3, 3],
    [3, 0, 0]
  ],

  [
    [4, 4],
    [4, 4]
  ],

  [
    [0, 5, 5],
    [5, 5, 0]
  ],

  [
    [0, 6, 0],
    [6, 6, 6]
  ],

  [
    [7, 7, 0],
    [0, 7, 7]
  ],
]

export const previewColors = ["#006eff40", "#ff000040", "#00ff0040", "#0000ff40", "#00ffff40", "#ffff0040", "#ff00ff40"]

