import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DragStart, DragUpdate, DraggableStyle } from '@hello-pangea/dnd';

interface Item {
  id: string;
  content: string;
}

const items: Item[] = [
  { id: 'item-1', content: 'Item 1' },
  { id: 'item-2', content: 'Item 2' },
  { id: 'item-3', content: 'Item 3' },
];

function MultiDragList() {
  const [listItems, setListItems] = useState<Item[]>(items);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [draggedItemsStyle, setDraggedItemsStyle] = useState<{ [key: string]: React.CSSProperties }>({});
  const itemRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({});

  useEffect(() => {
    listItems.forEach((item) => {
      itemRefs.current[item.id] = itemRefs.current[item.id] || React.createRef<HTMLDivElement>();
    });
  }, [listItems]);

  const onDragStart = (result: DragStart): void => {
    if (selectedItems.length === 0) return;

    const firstItem = itemRefs.current[selectedItems[0]]?.current;
    if (!firstItem) return;
    const firstRect = firstItem.getBoundingClientRect();
    const styles: { [key: string]: React.CSSProperties } = {};
    selectedItems.forEach((id) => {
      const item = itemRefs.current[id]?.current;
      if (item) {
        const rect = item.getBoundingClientRect();
        styles[id] = {
          position: 'absolute',
          top: rect.top - firstRect.top,
          left: rect.left - firstRect.left,
          width: rect.width,
          height: rect.height,
          zIndex: 1000,
        };
      }
    });

    setDraggedItemsStyle(styles);
  };

    const onDragUpdate = (result: DragUpdate): void => {
        // You can add logic for updating the dragged items' position here if needed.
    }

  const onDragEnd = (result: DropResult): void => {
    setDraggedItemsStyle({});
    if (!result.destination) return;

    const reorderedItems = reorder(
      listItems,
      result.source.index,
      result.destination.index,
      selectedItems
    );
    setListItems(reorderedItems);
  };

  const reorder = (list: Item[], startIndex: number, endIndex: number, selected: string[]): Item[] => {
    const result = Array.from(list);
    const selectedItemsToReorder = result.filter(item => selected.includes(item.id));
    const notSelectedItems = result.filter(item => !selected.includes(item.id));

    selectedItemsToReorder.forEach(item => {
      const index = result.findIndex(i => i.id === item.id);
      result.splice(index, 1);
    });

    notSelectedItems.splice(endIndex, 0, ...selectedItemsToReorder);
    return notSelectedItems;
  };

  const getItemStyle = (id: string, providedStyle: DraggableStyle | undefined): React.CSSProperties => {
    return {
      ...providedStyle,
      ...draggedItemsStyle[id],
    };
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {listItems.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(item.id, provided.draggableProps.style)}
                  >
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default MultiDragList;