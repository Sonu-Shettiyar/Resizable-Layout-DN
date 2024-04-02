import React, { useState, useRef, useEffect } from 'react';
import { Resizable } from 're-resizable';
import { debounce } from 'lodash';

const Layout = () => {
  // State to manage the sizes of resizable components
  const [sizes, setSizes] = useState([
    { width: 0, height: 200 },
    { width: 0, height: 200 },
    { width: 0, height: 200 }
  ]);

  // Refs to access the resizable components
  const resizableRefs = [useRef(null), useRef(null), useRef(null)];

  // Function to handle resizing of components
  const handleResize = debounce((index, event, direction, ref, delta) => {
    const newSizes = [...sizes];

    // If resizing the third component
    if (index === 2) {
      // Calculate the new width and height of the third component
      const updatedHeight = sizes[index].height + delta.height;
      const newWidth = sizes[index].width + delta.width;

      const parentWidth = window.innerWidth * 0.8; // Parent container width (80% of window width)

      const updatedWidth = Math.min(newWidth, parentWidth); // Limit width to parent container width

      newSizes[index] = { ...newSizes[index], height: updatedHeight, width: updatedWidth };
    } else {
      // If resizing the first or second component
      // Update the height of both resizable components
      const updatedHeight = sizes[index].height + delta.height;
      newSizes[0] = { ...newSizes[0], height: updatedHeight };
      newSizes[1] = { ...newSizes[1], height: updatedHeight };
    }

    // Update state with new sizes
    setSizes(newSizes);

    // Update size using instance API for resizable components
    resizableRefs[index].current.updateSize({ width: newSizes[index].width, height: newSizes[index].height });

    // Adjust the width of the parent container
    const parentContainer = document.getElementById('parent-container');
    if (parentContainer) {
      parentContainer.style.width = `${newSizes[2].width}px`; // Set width of parent container
    }
    
  }, 100); // Debounce delay for resize handling

  // Function to handle screen resize
  const handleScreenResize = () => {
    const initialWidth = window.innerWidth * 0.3; // Initial width for resizable components (30% of window width)
    const newSizes = sizes.map((size, index) => ({
      ...size,
      width: index === 2 ? window.innerWidth * 0.8 : initialWidth // Double the width for the third component
    }));
    setSizes(newSizes);
  };

  // Effect to set initial sizes based on screen width and listen for screen resize
  useEffect(() => {
    // Set initial sizes based on screen width
    handleScreenResize();

    // Listen for screen resize events
    window.addEventListener('resize', handleScreenResize);

    // Cleanup function to remove event listener
    return () => window.removeEventListener('resize', handleScreenResize);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '80%', margin: 'auto', marginTop: '40px', textAlign: 'center', border: '0px solid red' }} id="parent-container">
      {/* First row with two resizable components */}
      <div style={{ display: 'flex', flex: 1, gap: '1%' }} id="sos">
        <Resizable
          size={{ ...sizes[0], width: sizes[0].width }}
          style={{ flex: 1, backgroundColor: 'lightblue' }}
          onResize={(event, direction, ref, delta) => handleResize(0, event, direction, ref, delta)}
          ref={resizableRefs[0]}
        >
          <div style={{ padding: 10 }}>1</div>
        </Resizable>

        <Resizable
          size={{ ...sizes[0], width: sizes[1].width }}
          onResize={(event, direction, ref, delta) => handleResize(0, event, direction, ref, delta)}
          style={{ flex: 1, backgroundColor: 'lightgreen' }}
          ref={resizableRefs[0]}
        >
          <div style={{ padding: 10 }}>2</div>
        </Resizable>
      </div>
      {/* Second row with one resizable component */}
      <div>
        <Resizable
          size={sizes[2]}
          onResize={(event, direction, ref, delta) => handleResize(2, event, direction, ref, delta)}
          style={{ flex: 1, marginTop: 10, backgroundColor: 'lightcoral' }}
          ref={resizableRefs[2]}
        >
          <div style={{ padding: 10 }}>3</div>
        </Resizable>
      </div>
    </div>
  );
};

export default Layout;

