/**
 * Inject a style sheet, if you feel so inclined
 * @param {String} style - some string of css
 * @param {String} id - optional id for the style node you are about to inject
 * @example
 * muCss('.someClass {background-color: red}')
 */
function muCss(style,id) {
    let sheet = document.createElement('style')
    if (id) {
        sheet.id = id
    }
    sheet.innerHTML = style
    document.body.appendChild(sheet)
}

export { muCss }
