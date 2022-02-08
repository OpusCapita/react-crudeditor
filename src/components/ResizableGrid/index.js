import PropTypes from 'prop-types';
import React, { useState, useCallback, useEffect } from 'react';
import './styles.less';

const getAbsoluteLeftOffset = (elem) => { // crossbrowser version
  const box = elem.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;

  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const left = box.left + scrollLeft - clientLeft;

  return Math.round(left);
}

const setStoredChanges = (name, value) => {
  window.localStorage.setItem(`${window.location.host}/${name}`, value);
}

const getStoredChanges = (name) => {
  return window.localStorage.getItem(`${window.location.host}/${name}`);
}

const ResizableGrid = ({
  name,
  persistChanges = false,
  wrapperRef,
  minCellWidth = 100,
  initialColumnSizes
}) => {
  const tableWrapperElement = wrapperRef.current;
  if (!tableWrapperElement) {
    return null;
  }

  const getMinCellWidth = (i) => {
    if (Array.isArray(minCellWidth)) {
      return minCellWidth[i];
    }
    return minCellWidth;
  };

  const tableElement = Array.from(tableWrapperElement.children).find((element) => element.tagName === 'TABLE');
  let tableHeadersContainer = tableElement;
  const theadElement = Array.from(tableElement.children).find((element) => element.tagName === 'THEAD');
  if (theadElement) {
    tableHeadersContainer = theadElement;
  }
  const tableHeaderRowElement = Array.from(tableHeadersContainer.children).filter((element) => element.tagName === 'TR')[0];
  const tableHeaderElements = Array.from(tableHeaderRowElement.children).filter((element) => element.tagName === 'TH' || element.tagName === 'TD');

  const [tableHeight, setTableHeight] = useState(tableElement.offsetHeight);
  const [activeIndex, setActiveIndex] = useState(null);
  const [resizerElements, setResizerElements] = useState([]);

  const savedColumnSizes = persistChanges ? getStoredChanges(name) : undefined;
  const [gridTemplateColumnsValue, setGridTemplateColumnsValue] = useState(
    savedColumnSizes || (initialColumnSizes || tableHeaderElements.map((_) => `${100.0 / tableHeaderElements.length}%`)).join(' ')
  );

  useEffect(() => {
    setTableHeight(tableElement.offsetHeight);

    const resizerDivs = [];

    tableWrapperElement.classList.add('resizable-table-wrapper');
    tableHeaderElements.forEach((element, i) => {
      // wrap table header cell
      const wrapperElement = document.createElement('span');
      const childElements = [...element.children];
      childElements.forEach((child) => {
        wrapperElement.appendChild(child);
      });
      element.appendChild(wrapperElement);

      // create div for resizer
      const resizerElement = document.createElement('div');
      resizerElement.onmousedown = () => mouseDown(i);
      element.appendChild(resizerElement);

      resizerElement.style.height = `${tableHeight}px`;
      resizerElement.className = 'resize-handle idle';
      resizerDivs.push(resizerElement);
    });

    setResizerElements(resizerDivs);

  }, []);

  useEffect(() => {
    resizerElements.forEach((element, i) => {
      if (i === activeIndex) {
        element.className = 'resize-handle active';
      } else {
        element.className = 'resize-handle idle';
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    tableElement.style.gridTemplateColumns = gridTemplateColumnsValue;
    if (persistChanges) {
      setStoredChanges(name, gridTemplateColumnsValue);
    }
  }, [gridTemplateColumnsValue]);

  const mouseDown = (index) => {
    setActiveIndex(index);
  };

  const mouseMove = useCallback((e) => {
    // Return an array of px values
    const gridColumns = tableHeaderElements.map((col, i) => {
      if (i === activeIndex) {
        // Calculate the column width
        const width = e.clientX - col.offsetLeft - getAbsoluteLeftOffset(tableWrapperElement);
        if (width >= getMinCellWidth(i)) {
          return `${width}px`;
        }
      }

      // Otherwise, return the previous width (no changes)
      return `${col.offsetWidth}px`;
    });

    // Assign the px values to the table
    setGridTemplateColumnsValue(`${gridColumns.join(' ')}`);
  }, [activeIndex]);

  const removeListeners = useCallback(() => {
    window.removeEventListener('mousemove', mouseMove);
    window.removeEventListener('mouseup', removeListeners);
  }, [mouseMove]);

  const mouseUp = useCallback(() => {
    setActiveIndex(null);
    removeListeners();
  }, [setActiveIndex, removeListeners]);

  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
    }

    return () => {
      removeListeners();
    }
  }, [activeIndex, mouseMove, mouseUp, removeListeners]);


  return null;
}

ResizableGrid.propTypes = {
  name: PropTypes.string,
  wrapperRef: PropTypes.object.isRequired,
  minCellWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  initialColumnSizes: PropTypes.arrayOf(PropTypes.string),
};

export default ResizableGrid;
