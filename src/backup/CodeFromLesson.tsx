import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { initialWebComponents } from "./util/initialData";
import "@atlaskit/css-reset";
import styled from "styled-components";
import initialData from "./initial-data";
import { useState } from "react";

const Container = styled.div`
  display: flex;
`;

const ContainerColumn = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 220px;

  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  padding: 8px;
`;

const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  flex-grow: 1;
  min-height: 100px;
`;

const ContainerTask = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
`;

function App() {
  const [state, setState] = useState<any>(initialData);
  const handleOnDragEnd = (result: any) => {
    {
      const { destination, source, draggableId } = result;

      if (!destination) {
        return;
      }

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const start = state.columns[source.droppableId];
      const finish = state.columns[destination.droppableId];

      if (start === finish) {
        const newTaskIds = Array.from(start.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        const newColumn = {
          ...start,
          taskIds: newTaskIds,
        };

        const newState = {
          ...state,
          columns: {
            ...state.columns,
            [newColumn.id]: newColumn,
          },
        };

        setState(newState);
        return;
      }

      // Moving from one list to another
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };
      setState(newState);
    }
  };
  return (
    <>
      <div>
        <div>halo dibawah ini coba ya kita buat dnd</div>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Container>
            {initialData.columnOrder.map((columnId) => {
              const column: any = state.columns[columnId];
              const tasks = column.taskIds.map(
                (taskId: any) => state.tasks[taskId]
              );
              return (
                <ContainerColumn key={column.id}>
                  <Title>{column.title}</Title>
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <TaskList
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        // isDraggingOver={snapshot.isDraggingOver}
                      >
                        {tasks.map((task: any, index: any) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided2, snapshot2) => (
                              <ContainerTask
                                {...provided2.draggableProps}
                                {...provided2.dragHandleProps}
                                ref={provided2.innerRef}
                              >
                                {task.content}
                              </ContainerTask>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </TaskList>
                    )}
                  </Droppable>
                </ContainerColumn>
              );
            })}
          </Container>
        </DragDropContext>
      </div>
    </>
  );
}

export default App;
