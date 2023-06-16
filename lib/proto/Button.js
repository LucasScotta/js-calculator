import { Token } from './Token.js'
import { isOperator } from './util.js'

export class Button extends Token {
    constructor(value, $element, calc) {
        super(value)
        this.$element = $element
        this.initHandler(calc)
    }
    initHandler(calc) {
        const { isClear, isEqual, isBackSpace } = this

        if (isClear) return this.onClick = () => calc.reset()
        if (isEqual) return this.onClick = () => this.handleEqual(calc)
        if (isBackSpace) return this.onClick = () => this.handleBackSpace(calc)
        return this.onClick = () => this.handleWrite(calc)
    }
    handleEqual(calc) {

        const { input, output } = calc
        const chain = input.getValue()
        const result = calc.exec(chain)
        calc.stuck = true

        if (result instanceof Error) {
            output.setValue(result.message)
            input.reset()
            return
        }
        output.setValue(result)
    }
    handleWrite(calc) {

        const { input, output } = calc
        if (calc.stuck) {
            if (!isOperator(this.value)) {
                calc.reset()
            }
            else {
                const chain = input.getValue()
                if (chain.length > 1) {
                    input.setValue(output.getValue())
                }
                else return
            }
        }
        if (this.isOperator && calc.stuck && input.getValue().length > 0) {
            input.setValue(output.getValue())
        }
        calc.stuck = false
        input.setValue(input.getValue() + this.value)
    }
    handleBackSpace(calc) {
        const { input } = calc
        if (input.getValue() === '') return
        if (calc.stuck) return calc.reset()
        const chain = input.getValue().slice(0, -1)
        if (chain.length === 0) {
            input.reset()
            return
        }
        input.setValue(chain)
    }

}
