import { isDef } from '../../../lib';

// https://github.com/s-yadav/react-number-format/blob/master/src/utils.js
// set the caret positon in an input field
const setCaretPosition = (el, caretPos) => { // eslint-disable-line consistent-return
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

export const setPatchedCaretPosition = (el, caretPos, currentValue) => {
  /* setting caret position within timeout of 0ms is required for mobile chrome,
  otherwise browser resets the caret position after we set it
  We are also setting it without timeout so that in normal browser we don't see the flickering */
  setCaretPosition(el, caretPos);
  setTimeout(_ => {
    if (el.value === currentValue) {
      setCaretPosition(el, caretPos)
    }
  });
}

export const handleKeydown = ({
  e,
  type,
  initialNumber,
  initialString,
  decimalSeparator,
  callback,
  parse,
  format
}) => {
  const el = e.target;
  const { selectionStart, selectionEnd } = el;
  const currentCaretPosition = Math.max(selectionStart, selectionEnd);

  const key = e.key === 'Backspace' ? 8 :
    e.key === 'Delete' ? 46 :
      null || e.keyCode || e.charCode;

  const decimalPointIndex = initialString.indexOf(decimalSeparator);

  let nextCaretPosition = currentCaretPosition,
    patchedString = initialString;

  let signChanged = false;

  // BACKSPACE key
  if (key === 8) {
    e.preventDefault();

    if (!initialNumber || (selectionEnd - selectionStart) === initialString.length) {
      patchedString = ''
    } else if (selectionStart !== selectionEnd) {
      patchedString = initialString.slice(0, selectionStart) + '' +
        initialString.slice(
          type === 'decimal' && decimalPointIndex > -1 && selectionEnd > decimalPointIndex ?
            decimalPointIndex :
            selectionEnd
        );
      nextCaretPosition = selectionStart
    } else if (currentCaretPosition === 1 && initialString.indexOf('-') === 0) {
      signChanged = true
    } else {
      nextCaretPosition = /\D/.test(el.value[currentCaretPosition - 1]) ?
        currentCaretPosition - 2 :
        currentCaretPosition - 1;

      if (type === 'decimal' && decimalPointIndex < currentCaretPosition) {
        patchedString = [
          ...initialString.split('').slice(0, nextCaretPosition),
          0,
          ...initialString.split('').slice(nextCaretPosition + 1)
        ].join('')
      } else {
        patchedString = initialString.split('').filter((c, i) => i !== nextCaretPosition).join('');
      }
    }
  // DEL key
  } else if (key === 46) {
    e.preventDefault();

    if (!initialNumber || (selectionEnd - selectionStart) === initialString.length) {
      patchedString = ''
    } else if (selectionStart !== selectionEnd) {
      patchedString = initialString.slice(0, selectionStart) + '' +
        initialString.slice(
          type === 'decimal' && decimalPointIndex > -1 && selectionEnd > decimalPointIndex ?
            decimalPointIndex :
            selectionEnd
        );
      nextCaretPosition = selectionStart
    } else if (currentCaretPosition === 0 && initialString.indexOf('-') === 0) {
      signChanged = true
    } else {
      nextCaretPosition = /\D/.test(el.value[currentCaretPosition]) ?
        currentCaretPosition + 1 :
        currentCaretPosition;

      if (type === 'decimal' && decimalPointIndex <= currentCaretPosition) {
        patchedString = [
          ...initialString.split('').slice(0, nextCaretPosition),
          0,
          ...initialString.split('').slice(nextCaretPosition + 1)
        ].join('');
        nextCaretPosition++;
      } else {
        patchedString = initialString.split('').filter((c, i) => i !== nextCaretPosition).join('');
      }
    }
  // 0-9 keys
  } else if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
    e.preventDefault();

    if (selectionStart !== selectionEnd) {
      patchedString = initialString.slice(0, selectionStart) + '' +
        String.fromCharCode(key) +
        initialString.slice(selectionEnd);

      nextCaretPosition = selectionStart + 1;
    } else {
      nextCaretPosition = currentCaretPosition + 1;

      patchedString = [
        ...initialString.split('').slice(0, currentCaretPosition === initialString.length && type === 'decimal' ?
          currentCaretPosition - 1 :
          currentCaretPosition),
        String.fromCharCode(key),
        ...initialString.split('').slice(
          currentCaretPosition +
          (
            type === 'decimal' && decimalPointIndex < currentCaretPosition ?
              1 : 0 // either patch one char or splice a new one into the string
          )
        )
      ].join('');
    }
  // Minus key
  } else if (key === 189) {
    e.preventDefault();

    if (currentCaretPosition === 0) {
      signChanged = true
    }
  // block non-numeric non-control keys
  } else if (
    (
      /[a-zA-Z_ ]/.test(String.fromCharCode(key)) ||
      [192, 187].indexOf(key) > -1
    ) && !(e.ctrlKey || e.metaKey)
  ) {
    e.preventDefault();
  } else {
    return; // pass all not intercepted keydowns to standard handlers
  }

  if (patchedString !== initialString || signChanged) {
    if (patchedString.indexOf(decimalSeparator) === 0) {
      patchedString = '0' + patchedString;
    }

    if (/^-/.test(patchedString) && patchedString.indexOf(decimalSeparator) === 1) {
      patchedString = '-0' + patchedString.slice(1);
    }

    const newNumber = parse(patchedString);
    const newString = format(newNumber) || '';

    if (newString.length > patchedString.length) {
      nextCaretPosition++
    }

    if (newString.length < patchedString.length) {
      nextCaretPosition--
    }

    if (
      type === 'decimal' &&
      newString.slice(newString.indexOf(decimalSeparator) + 1).length <
      patchedString.slice(patchedString.indexOf(decimalSeparator) + 1).length
    ) {
      nextCaretPosition = newString.length - 1
    }

    if (nextCaretPosition === 0 && newString.indexOf('0' + decimalSeparator) === 0) {
      nextCaretPosition = 1;
    }

    if (newString.indexOf(decimalSeparator) > -1 && nextCaretPosition > newString.indexOf(decimalSeparator) + 2) {
      nextCaretPosition = newString.indexOf(decimalSeparator) + 2;
    }

    if (type === 'decimal' && decimalPointIndex === -1) {
      nextCaretPosition = 1
    }

    callback({
      newNumber: isDef(newNumber) ?
        (signChanged ? -1 : 1) * newNumber :
        newNumber,
      newString,
      nextCaretPosition
    })
  } else {
    setPatchedCaretPosition(el, nextCaretPosition, el.value)
  }
}

export const handlePaste = ({
  e,
  initialString,
  callback,
  parse,
  format
}) => {
  const el = e.target;
  const { selectionStart, selectionEnd } = el;

  const clipText = e.clipboardData.getData('text');

  const patchedString = initialString.slice(0, selectionStart) + '' +
    clipText +
    initialString.slice(selectionEnd);

  try {
    const newNumber = parse(patchedString);
    const newString = format(newNumber) || '';

    const nextCaretPosition = selectionStart + clipText.length;

    callback({ newNumber, newString, nextCaretPosition })
  } catch (e) {
    // num num parse errors (inserting decimal after decimal, etc.)
  }
}
