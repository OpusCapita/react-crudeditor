import PropTypes from 'prop-types';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import './ResizableGrid.less';

const getAbsoluteLeftOffset = (elem) => { // crossbrowser version
  const box = elem.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const left = box.left + scrollLeft - clientLeft;
  return Math.round(left);
}

const findFirstTableDOM = (rootElement) => {
  const filter = (node) => {
    if (node.tagName === 'TABLE') {
      return NodeFilter.FILTER_ACCEPT;
    }
    return NodeFilter.FILTER_SKIP;
  }
  const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_ELEMENT, filter);

  return walker.firstChild();
};

const ResizableGrid = ({
  store,
  children,
}) => {
  const tableWrapperRef = useRef(null);
  const [tableElement, setTableElement] = useState(null);
  const [tableHeaderElements, setTableHeaderElements] = useState([]);
  const [resizerElements, setResizerElements] = useState([]);
  const [gridTemplateColumnsValues, setGridTemplateColumnsValues] = useState([]);
  const [tableHeight, setTableHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);

  const calculateColumnWidthPercentage = (widthInPx) => {
    const totalWidth = tableHeaderElements.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.offsetWidth;
    }, 0);

    return widthInPx / totalWidth * 100;
  };

  useEffect(() => {
    const tableElementFound = findFirstTableDOM(tableWrapperRef.current);
    if (tableElementFound) {
      setTableElement(tableElementFound);
    }

    const observerCallback = (_) => {
      const tableElementFound = findFirstTableDOM(tableWrapperRef.current);
      if (tableElementFound && tableElementFound !== tableElement) {
        setTableElement(tableElementFound);
      }
    };

    const tableElementObserver = new MutationObserver(observerCallback);

    tableElementObserver.observe(tableWrapperRef.current, {
      childList: true,
      subtree: true
    });
  });

  useEffect(() => {
    if (tableElement) {
      const observerCallback = (_) => {
        const newOffsetHeight = tableElement.clientHeight;
        if (newOffsetHeight !== tableHeight) {
          setTableHeight(newOffsetHeight);
        }
      };

      const observer = new MutationObserver(observerCallback);

      observer.observe(tableElement, {
        attributes: true,
        attributeFilter: ['style']
      });
    }
  }, [tableElement]);

  useEffect(() => {
    if (!tableElement) {
      return;
    }
    let tableHeadersContainer = tableElement;
    const theadElement = Array.from(tableElement.children).find((element) => element.tagName === 'THEAD');
    if (theadElement) {
      tableHeadersContainer = theadElement;
    }
    const tableHeaderRowElement = Array.from(tableHeadersContainer.children).filter(
      (element) => element.tagName === 'TR'
    )[0];
    const localTableHeaderElements = Array.from(tableHeaderRowElement.children).filter(
      (element) => element.tagName === 'TH' || element.tagName === 'TD'
    );
    setTableHeaderElements(localTableHeaderElements);

    let gridTemplateColumnValues = store.getValue().map(columnSizeInPercentage => columnSizeInPercentage * 100)

    setGridTemplateColumnsValues(gridTemplateColumnValues);
  }, [tableElement]);

  const mouseDown = (index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    if (!tableHeaderElements) {
      return;
    }

    tableHeaderElements.forEach((element) => {
      // wrap table header cell
      const wrapperElement = document.createElement('span');
      const childElements = [...element.children];
      childElements.forEach((child) => {
        wrapperElement.appendChild(child);
      });
      element.appendChild(wrapperElement);
    });

    const resizerDivs = tableHeaderElements.slice(0, -1).map((element, i) => {
      // create div for resizer
      const resizerElement = document.createElement('div');
      resizerElement.onmousedown = () => mouseDown(i);
      element.appendChild(resizerElement);

      resizerElement.style.height = `${tableHeight}px`;
      resizerElement.classList.add('resize-handle');

      return resizerElement;
    });

    setResizerElements(resizerDivs);
  }, [tableElement, tableHeaderElements]);

  useEffect(() => {
    resizerElements.forEach((element, i) => {
      if (i === activeIndex) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
  }, [resizerElements, activeIndex]);

  useEffect(() => {
    resizerElements.forEach((element) => {
      element.style.height = `${tableHeight}px`; // eslint-disable-line no-param-reassign
    });
  }, [tableElement, resizerElements, tableHeight]);

  useEffect(() => {
    if (!tableElement || !gridTemplateColumnsValues) {
      return;
    }
    tableElement.style.gridTemplateColumns = gridTemplateColumnsValues.map(it => `minmax(min-content, ${it}%)`).join(" ");
    store.setValue(gridTemplateColumnsValues.map(columnValue => columnValue/100))
  }, [tableElement, gridTemplateColumnsValues]);

  const mouseMove = useCallback((e) => {
    if (!tableElement || activeIndex === null || activeIndex === undefined) {
      return;
    }

    let widthDeltaInPx = 0;
    // Return an array of percentage values
    const gridColumns = tableHeaderElements.map((col, i) => {
      if (i === activeIndex) {
        // Calculate the column widthInPx
        const widthInPx = e.clientX - getAbsoluteLeftOffset(col);
        const widthInPercentage = calculateColumnWidthPercentage(widthInPx);
        if (widthInPercentage >= 0) {
          widthDeltaInPx = widthInPx - col.offsetWidth;
          // do not change the width if it requires next column to be changed more than it is allowed
          const nextColumnWidthInPx = tableHeaderElements[i + 1].offsetWidth - widthDeltaInPx;
          const nextColumnWidthInPercentage = calculateColumnWidthPercentage(nextColumnWidthInPx);
          if (nextColumnWidthInPercentage >= 0) {
            return widthInPercentage;
          }
        }
      }
      if (i === activeIndex + 1) {
        const nextColumnWidthInPercentage = calculateColumnWidthPercentage(col.offsetWidth - widthDeltaInPx);
        if (nextColumnWidthInPercentage >= 0) {
          return nextColumnWidthInPercentage;
        }
      }

      // Otherwise, return the previous width (no changes)
      return calculateColumnWidthPercentage(col.offsetWidth);
    });

    // Assign the px values to the table
    setGridTemplateColumnsValues(gridColumns);
    setTableHeight(tableElement.clientHeight);
  }, [tableElement, activeIndex]);

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

  return (
    <div className="resizable-table-wrapper" ref={tableWrapperRef}>
      {children}
    </div>
  );
}

ResizableGrid.propTypes = {
  children: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

export default ResizableGrid;
