import { Button } from './Button.js'
import { Display } from './Display.js'
import { Token } from './Token.js'
import { isNumber, isSum, isSub, isPoint, isDiv, isMul, isOperator } from './util.js'

export class Calculator {
    constructor() {
        this.input = new Display('display-in')
        this.output = new Display('display-out')
        this.reset()
        this.createButtons()
    }
    exec(str) {
        if (typeof str !== 'string') return new Error(`Error initializing calculation; Expected string, recieved ${typeof string}`)
        str = str.replaceAll(' ', '')
        if (!str || str.length === 0) return new Error('Syntax Error')

        const test = this.scan(str)
        if (test instanceof Error) return test

        const stack = this.parse(test)
        const tokens = this.tokenizer(stack)
        const termines = this.separateEquationTerms(tokens)
        const result = this.calculate(termines)
        return result.value
    }
    isValid(chain) {
        const first = chain.slice(0, 1).pop()
        const last = chain.slice(-1).pop()
        return chain.length === 1
            ? !isOperator(first)
            : !isDiv(first) && !isMul(first) && !isDiv(last) && !isMul(last)
    }

    scan(chain) {
        chain = chain.split('')
        if (!this.isValid(chain)) return new Error('Syntax Error')
        let validated = ''

        let lastIsNumber = false
        let lastHasPoint = false
        let lastIsPoint = false
        while (chain.length > 0) {
            const char = chain.shift()
            if (isNumber(char)) {
                if (lastIsPoint) lastIsPoint = false
                lastIsNumber = true
            }
            else if (isPoint(char)) {
                if (lastHasPoint || lastIsPoint || chain.length === 0 && !lastIsNumber) return new Error('Syntax Error')
                lastHasPoint = true
                lastIsPoint = true
            }
            else {
                if (validated.length === 0 && isMul(char) && isDiv(char)) return new Error('Syntax Error')
                const last = validated.slice(-1)[0]
                if (isOperator(last) && (isSum(char) || isSub(char)) && (isSum(last) || isSub(last))) return new Error('Syntax Error')
                lastIsNumber = false
                lastHasPoint = false
                lastIsPoint = false
            }
            validated += char
        }
        return validated
    }

    parse(operation) {
        const stack = []
        let number = ''
        for (const char of operation) {
            if (isNumber(char) || isPoint(char)) {
                number += char
                continue
            }
            if (number.length !== 0) {
                stack.push(Number(number))
                number = ''
            }
            stack.push(char)
        }

        if (!!number.length) stack.push(Number(number))
        return stack
    }
    tokenizer(stack) {
        return stack.map(value => new Token(value))
    }
    separateEquationTerms(tokens) {
        const calculation = []
        const term = []

        for (const token of tokens) {
            // Si es un numero, directo a term
            if (token.isNumber) {
                term.push(token)
                continue
            }
            // Si es + o -
            if (isSum(token) || isSub(token)) {
                // Si en term tengo solo 1 numero,
                // lo saco y lo pongo en calculation junto con el simbolo + o -
                if (term.length === 1) {
                    calculation.push(...term.slice(), token)
                    term.length = 0
                    continue
                }
                if (term.length > 1) {
                    calculation.push(term.slice(), token)
                    term.length = 0
                    continue
                }
            }
            if (term.length === 0) {
                const last = calculation.pop()
                term.push(last, token)
                continue
            }
            term.push(token)

        }

        if (term.length === 1) calculation.push(...term)
        if (term.length > 1) calculation.push(term)
        return calculation
    }
    calculate(computation) {
        const result = []

        for (const comp of computation) {
            if (comp.value) {
                result.push(comp)
                continue
            }
            const resolved = this.resolveTerm(comp)
            result.push(resolved)
        }

        return this.resolveTerm(result)
    }
    resolveTerm(term) {
        if (term.length === 1) return term[0]
        const number1 = term.shift()
        const operator = term.shift()
        const number2 = term.shift()
        const result = operator.operate(number1, number2)
        term.unshift(new Token(result))
        return this.resolveTerm(term)
    }
    createButtons() {
        const $keys = document.getElementsByClassName('key')
        for (const $key of $keys) {
            const char = $key.innerText
            const key = new Button(char, $key, this)
            key.$element.onclick = key.onClick
        }
    }
    reset() {
        this.stuck = false
        this.input.setValue('')
        this.output.setValue('')
    }
}
