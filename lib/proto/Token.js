import { OPERATIONS, isNumber } from './util.js'

export class Token {
    constructor(value) {
        this.init(value)
    }
    getValue() {
        return 'asd'
    }
    init(value) {
        this.isEqual = value === '='
        this.isPoint = value === '.'
        this.isClear = value === 'AC'
        this.isBackSpace = value === '←'
        this.isNumber = isNumber(value)
        this.value = this.isNumber ? Number(value) : value
        this.setOperation()
    }
    setOperation() {
        const { isNumber, value } = this
        this.operate =
            isNumber
                ? () => value
                : OPERATIONS[value]
    }
}
