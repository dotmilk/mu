/**
 * Inject a style sheet, if you feel so inclined
 * @param {String} style - some string of css
 * @param {String} id - optional id for the style node you are about to inject
 * @example
 * muCss('.someClass {background-color: red}')
 */
export function muCss(style,id) {
    let sheet = document.createElement('style')
    if (id) {
        sheet.id = id
    }
    sheet.innerHTML = style
    document.body.appendChild(sheet)
}

export const MU_CSS = `
#mu-overlay > :not(:last-child) {
  display: none !important;
}
#mu-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: fixed;
  background: #666;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 9010;
  transition: opacity .3s;
  visibility: hidden;
}
.mu-overlay-show {
  opacity: 1 !important;
  visibility: visible !important;
}
.mu-select-overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  background: #666;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  z-index: 9010;
  transition: opacity .3s;
}
.mu-select-show {
  opacity: 1;
  visibility: visible;
}
.muModal {
  color: #888;
  transform: translateX(-50%) scale(0.8, 0.8);
  left: 50%;
  top: 10px;
  border-radius: 6px;
  position: fixed;
  width: 280px;
  z-index: 9015;
  transition: all .3s;
  visibility: hidden;
  background: #f2f2f2;
  opacity: 0;
}
.muModal header {
  text-align: center;
  letter-spacing: 1px;
  font-weight: 700;
  padding: 20px 10px;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #afafaf;
}
.muModal .muOption[selected="true"] {
  background-color: #c2c2c2;
}
.muModal .muOption[selected="true"] .muCircle {
  background-color: #888;
}
.muModal .muCircle {
  border: 1px solid #afafaf;
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 2px;
  right: 12px;
}
.muModal .muOption {
  text-transform: capitalize;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 1.2px;
  cursor: pointer;
  padding: 14px 10px;
  border-bottom: 1px solid #afafaf;
  position: relative;
}
.muModal .muNoResults {
  text-transform: capitalize;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 1.2px;
  cursor: pointer;
  padding: 14px 10px;
  border-bottom: 1px solid #afafaf;
  position: relative;
  cursor: initial;
}
.muModal footer :first-child {
  border-right: 1px solid #afafaf;
}
.muModal footer {
  display: flex;
}
.muModal footer button {
  background: 0 0;
  border: none;
  width: 100%;
  margin-top: 10px;
  padding-top: 16px;
  padding-bottom: 18px;
  cursor: pointer;
  letter-spacing: 1px;
  font-weight: 700;
  border-radius: 0 0 3px 3px;
  outline: none;
  border-top: 1px solid #afafaf;
}
.mu-modal-show {
  transform: translateX(-50%) scale(1, 1);
  visibility: visible;
  opacity: 1;
  box-shadow: 0 30px 10px -20px #777;
}
.muModalMain {
  overflow-y: auto;
  max-height: 60vh;
}
.muSearch {
  margin-top: 15px;
}
.muSearch > input {
  width: calc(92%);
  padding: 8px 4px;
  margin: 6px;
  border: 1px solid #ddd;
}
.muLogic {
  display: flex;
}
.muLogic .muOption {
  flex-grow: 1;
  border-right: 1px solid #afafaf;
}
.muLogic .muOption:last-child {
  border-right: none;
}
.muTable {
  background-color: #F3F3F3;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  max-width: max-content;
}
.muTable .muTableControls {
  display: flex;
  font-size: 1.4rem;
  height: 2rem;
  line-height: 2rem;
  padding: 1.2rem 1.2rem;
  text-align: center;
  text-decoration: none;
  user-select: none;
  vertical-align: middle;
}
.muTable .muTableControls input {
  width: 4ch;
  padding: 0.5rem;
  border-radius: 0.2rem;
}
.muTable .muTableControls input[type=number]::-webkit-inner-spin-button,
.muTable .muTableControls input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.muTable .muTableControls button {
  height: 2rem;
  border-radius: 0.2rem;
  border: 0;
}
.muTable .muTableControls button:focus {
  outline: none;
}
.muTable .muTableControls :not(:first-child) {
  margin-left: 0.5rem;
}
.muTable table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
.muTable table thead {
  background-color: #c8c8c8;
}
.muTable table thead th {
  text-align: left;
  padding: 0.5rem;
}
.muTable table tbody tr.selected:hover {
  background-color: #7C8AA5;
}
.muTable table tbody tr.selected {
  background-color: #7C8AA5;
}
.muTable table tbody tr:hover {
  background-color: #DADADA;
}
.muTable table tbody tr td {
  padding: 0.5rem;
  text-align: left;
}
`