export class Display {
    constructor($element) {
        this.$element = document.getElementById($element)
        this.reset()
    }
    setValue(value) {
        this.$element.value = value
    }
    getValue() {
        return this.$element.value
    }
    reset() {
        this.$element.value = ''
    }
}