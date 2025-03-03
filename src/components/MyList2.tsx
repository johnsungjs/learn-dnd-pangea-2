import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { initialWebComponents } from "../util/initialData";
import '@atlaskit/css-reset';

function App() {
  return (
    <div>
      <div>halo dibawah ini coba ya kita buat dnd</div>
      <DragDropContext onDragEnd={(e) => console.log("end: ", e)}>
        <div style={{ display: "flex", gap: 20 }}>
          {/* WEB COMPONENT SECTION */}
          <div
            style={{
              border: "5px solid pink",
              padding: 12,
              flexGrow: 1,
              minHeight: 100,
            }}
          >
            <div>Web Component</div>
            <Droppable droppableId="droppable-1" isDropDisabled={true} ignoreContainerClipping={false}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    backgroundColor: snapshot.isDraggingOver ? "blue" : "red",
                  }}
                >
                  {initialWebComponents.map((compo, index) => (
                    <Draggable key={compo.id} draggableId={compo.id} index={index}>
                      {(provided2, snapshot2) => (
                        <div
                          {...provided2.draggableProps}
                          {...provided2.dragHandleProps}
                          ref={provided2.innerRef}
                          style={{
                            ...provided2.draggableProps.style,
                            border: "2px solid black",
                            borderRadius: 8,
                            height: '50px',
                            width: '300px',
                            display: 'flex',
                            backgroundColor: snapshot2.isDragging ? "green" : "white",
                            flexShrink: 0,
                          }}
                        >
                          <div>{compo.title}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {/* Styled placeholder to prevent shrinking */}
                  <div style={{ height: '50px', width: '300px', margin: '6px 0' }}>
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>

          {/* CANVAS SECTION */}
          <div>Canvas</div>
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
