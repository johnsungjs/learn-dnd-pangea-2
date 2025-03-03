import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const items = [
  { id: "item-1", content: "Item 1" },
  { id: "item-2", content: "Item 2" },
  { id: "item-3", content: "Item 3" },
];

function MyList() {
  const [dragStartIndex, setDragStartIndex] = useState(null);
  const [listItems, setListItems] = useState(items);

  const onDragStart = (result) => {
    setDragStartIndex(result.source.index);
  };

  const onDragUpdate = (result) => {
    // Optional: add logic here if you need to update during the drag.
  };

  const onDragEnd = (result) => {
    setDragStartIndex(null);
    if (!result.destination) {
      return;
    }

    const reorderedItems = reorder(
      listItems,
      result.source.index,
      result.destination.index
    );

    setListItems(reorderedItems);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
      <Droppable droppableId="droppable" isDropDisabled>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {listItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <Draggable draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        width: 300,
                        height: 100,
                        border: "5px solid red",
                        translate: "none"
                      }}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
                
              </React.Fragment>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default MyList;
