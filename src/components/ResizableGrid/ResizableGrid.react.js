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

const setStoredChanges = (name, value) => {
  const stringValue = JSON.stringify(value);
  window.localStorage.setItem(`${window.location.host}/${name}`, stringValue);
}

const getStoredChanges = (name) => {
  const stringValue = window.localStorage.getItem(`${window.location.host}/${name}`);
  return JSON.parse(stringValue);
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
  name,
  persistChanges = false,
  minCellWidth = 100,
  initialColumnSizes,
  children,
}) => {
  const getMinCellWidth = (i) => {
    if (Array.isArray(minCellWidth)) {
      return minCellWidth[i];
    }
    return minCellWidth;
  };

  const tableWrapperRef = useRef(null);
  const [tableElement, setTableElement] = useState(null);
  const [tableHeaderElements, setTableHeaderElements] = useState([]);
  const [resizerElements, setResizerElements] = useState([]);
  const [gridTemplateColumnsValues, setGridTemplateColumnsValues] = useState([]);
  const [tableHeight, setTableHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (!tableElement) { // check if table element is already present is child nodes
      const tableElementFound = findFirstTableDOM(tableWrapperRef.current);
      if (tableElementFound) {
        setTableElement(tableElementFound);
      } else { // wait for probable async loading
        let tableElementObserver;
        const observerCallback = (_) => {
          const tableElementFound = findFirstTableDOM(tableWrapperRef.current);
          if (tableElementFound) {
            setTableElement(tableElementFound);
            tableElementObserver.disconnect();
          }
        };

        tableElementObserver = new MutationObserver(observerCallback);

        tableElementObserver.observe(tableWrapperRef.current, {
          childList: true,
          subtree: true
        });
      }
    }
  });

  useEffect(() => {
    if (tableElement) {
      const observerCallback = (_) => {
        const newOffsetHeight = tableElement.offsetHeight;
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

    let initialGridTemplateColumnsValues;
    const savedColumnSizes = persistChanges ? getStoredChanges(name) : undefined;
    if (savedColumnSizes) {
      initialGridTemplateColumnsValues = savedColumnSizes;
    } else if (initialColumnSizes) {
      initialGridTemplateColumnsValues = initialColumnSizes;
    } else {
      const columnCount = localTableHeaderElements.length;
      initialGridTemplateColumnsValues = localTableHeaderElements.map(
        (_) => `${100.0 / columnCount}%`
      );
    }
    setGridTemplateColumnsValues(initialGridTemplateColumnsValues);
  }, [tableElement]);

  const mouseDown = (index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    if (!tableHeaderElements || !tableHeight || resizerElements.length) {
      return;
    }

    const resizerDivs = tableHeaderElements.map((element, i) => {
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
      resizerElement.classList.add('resize-handle');

      return resizerElement;
    });

    setResizerElements(resizerDivs);
  }, [tableHeaderElements, tableHeight]);

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
  }, [resizerElements, tableHeight]);

  useEffect(() => {
    if (!tableElement || !gridTemplateColumnsValues) {
      return;
    }
    tableElement.style.gridTemplateColumns = gridTemplateColumnsValues.join(' ');
    if (persistChanges) {
      setStoredChanges(name, gridTemplateColumnsValues);
    }
  }, [tableElement, gridTemplateColumnsValues]);

  const mouseMove = useCallback((e) => {
    if (!tableElement || activeIndex === null || activeIndex === undefined) {
      return;
    }
    // Return an array of px values
    const gridColumns = tableHeaderElements.map((col, i) => {
      if (i === activeIndex) {
        // Calculate the column width
        const width = e.clientX - getAbsoluteLeftOffset(col);
        if (width >= getMinCellWidth(i)) {
          return `${width}px`;
        }
      }

      // Otherwise, return the previous width (no changes)
      return `${col.offsetWidth}px`;
    });

    // Assign the px values to the table
    setGridTemplateColumnsValues(gridColumns);
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
  name: PropTypes.string,
  persistChanges: PropTypes.bool,
  minCellWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  initialColumnSizes: PropTypes.arrayOf(PropTypes.string),
};

export default ResizableGrid;
