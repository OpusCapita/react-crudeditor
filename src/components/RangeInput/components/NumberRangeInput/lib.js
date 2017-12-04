// https://github.com/s-yadav/react-number-format/blob/master/src/utils.js
// set the caret positon in an input field
export function setCaretPosition(el, caretPos) { // eslint-disable-line consistent-return
  el.value = el.value; // eslint-disable-line no-param-reassign
  // ^ this is used to not only get "focus", but
  // to make sure we don't have everything selected
  // (it causes an issue in chrome, and having it doesn't hurt any other browser)
  if (el !== null) {
    if (el.createTextRange) {
      const range = el.createTextRange();
      range.move('character', caretPos);
      range.select();
      return true;
    }
    // (el.selectionStart === 0 added for Firefox bug)
    if (el.selectionStart || el.selectionStart === 0) {
      el.focus();
      el.setSelectionRange(caretPos, caretPos);
      return true;
    }

    // fail city, fortunately this never happens (as far as I've tested) :)
    el.focus();
    return false;
  }
}
