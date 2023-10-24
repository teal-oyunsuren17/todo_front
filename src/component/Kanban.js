import React, { useEffect, useState } from "react"
import styled from "@emotion/styled"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import TaskCard from "./TaskCard"
import axios from "axios"
import { CreateTasks } from "./createTasks"
import { toast } from "react-toastify"

const Container = styled.div`
  display: flex;
`

const TaskList = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f3f3f3;
  min-width: 40%;
  border-radius: 5px;
  padding: 3% 3%;
`

const TaskColumnStyles = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5%;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
`

const Title = styled.span`
  color: #4e65ff;
  background: rgba(147, 197, 253, 0.3);
  border-radius: 5px;
  text-align: center;
  margin-bottom: 10px;
  width: 100%;
`

const Kanban = () => {
  const [datas, setDatas] = useState([])
  const [Todos, setTodos] = useState([])
  const [Dones, setDones] = useState([])
  const [columns, setColumns] = useState({})

  const notify = () =>
    toast.success("Success", {
      position: "top-right",
      autoClose: 2000,
      pauseOnHover: false,
    })

  function getDatas() {
    axios.get("http://localhost:8000/list").then((res) => {
      if (res.status === 200) {
        setDatas(res.data)
      } else {
        alert(`data fetch error ${res.status}`)
      }
    })
  }

  useEffect(() => {
    getDatas()
  }, [])

  useEffect(() => {
    const fTodos = datas.filter((data) => data.done === false)
    const fDones = datas.filter((data) => data.done === true)

    setTodos(fTodos)
    setDones(fDones)
  }, [datas])

  const columnsFromBackend = {
    123: {
      title: "To-Do",
      items: Todos,
    },
    456: {
      title: "Done",
      items: Dones,
    },
  }

  useEffect(() => {
    setColumns(columnsFromBackend)
  }, [Todos, Dones])

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return
    const { source, destination } = result
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      })
      axios
        .put(`http://localhost:8000/list/${result.draggableId}`, {
          done: destination.droppableId === "123" ? false : true,
        })
        .then(function (response) {
          if (response.status === 200) {
            notify()
            getDatas()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    } else {
      const column = columns[source.droppableId]
      const copiedItems = [...column.items]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      })
    }
  }

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(100deg, #575656, #062e3f)",
        height: "100vh",
        padding: "10px 1%",
      }}
    >
      <CreateTasks getDatas={getDatas} />
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        <Container>
          <TaskColumnStyles>
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <Droppable key={columnId} droppableId={columnId}>
                  {(provided, snapshot) => (
                    <TaskList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <Title>{column.title}</Title>
                      {column.items.map((item, index) => (
                        <TaskCard
                          key={item._id}
                          item={item}
                          index={index}
                          getDatas={getDatas}
                        />
                      ))}
                      {provided.placeholder}
                    </TaskList>
                  )}
                </Droppable>
              )
            })}
          </TaskColumnStyles>
        </Container>
      </DragDropContext>
    </div>
  )
}

export default Kanban
