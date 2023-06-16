export const isNumber = char => !isNaN(char)
export const isPoint = char => char === '.'
export const isOperator = char => isNaN(char) && char !== '.'
const parse = (n) => !!n ? n.value : 0
export const OPERATIONS = {
    '+': (a, b) => parse(a) + parse(b),
    '-': (a, b) => parse(a) - parse(b),
    '*': (a, b) => a.value * b.value,
    '/': (a, b) => a.value / b.value,
    '.': (a, b) => Number(parse(a) + '.' + parse(b))
}
export const buttons = [
    7, 8, 9, '/',
    4, 5, 6, '*',
    1, 2, 3, '-',
    0, '+',
]
export const isSum = char => char === '+'
export const isSub = char => char === '-'
export const isDiv = char => char === '/'
export const isMul = char => char === '*'