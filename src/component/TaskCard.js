import React, { useEffect, useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import styled from "@emotion/styled"
import { MdDeleteOutline } from "react-icons/md"
import { FiEdit3 } from "react-icons/fi"
import { MdFileDownloadDone } from "react-icons/md"
import { AiOutlineClose } from "react-icons/ai"
import { toast } from "react-toastify"
import axios from "axios"

const TaskInformation = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
  margin-bottom: 5px;
  border-radius: 5px;
  min-width: 35vw;
  background: white;
  padding: 0 2%;
  background-image: ${({ done }) =>
    done
      ? "linear-gradient(to right, #11998E  , #38EF7D)"
      : "linear-gradient(to right, #FF5F6D  , #FFC371)"};

  .secondary-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 12px;
    font-weight: 400px;
    color: #7d7d7d;
  }
`

const TaskCard = ({ item, index, getDatas }) => {
  const [edit, setEdit] = useState(false)
  const [done, setDone] = useState(item.done)
  const [editedList, setEditedList] = useState(item.list)

  useEffect(() => {
    setDone(item.done)
  }, [item])

  const notify = () =>
    toast.success("Success", {
      position: "top-right",
      autoClose: 2000,
      pauseOnHover: false,
    })

  function handleDone(checked, id) {
    setDone(!done)
    if (checked) {
      axios
        .put(`https://todo-back-q1ut.onrender.com/list/${id}`, {
          done: checked,
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
    }
  }

  function handleEdit(id) {
    axios
      .put(`https://todo-back-q1ut.onrender.com/list/${id}`, {
        list: editedList,
      })
      .then(function (response) {
        if (response.status === 200) {
          notify()
          setEdit(false)
          getDatas()
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const handleKey = (event, id) => {
    if (event.key === "Enter") {
      handleEdit(id)
    }
  }

  function handleDelete(id) {
    axios
      .delete(`https://todo-back-q1ut.onrender.com/list/${id}`)
      .then(function (response) {
        if (response.status === 200) {
          notify()
          getDatas()
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  return (
    <Draggable key={item._id} draggableId={item._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <TaskInformation done={item.done}>
            {!item.done && (
              <input
                type="checkbox"
                checked={done}
                onChange={(e) => handleDone(e.target.checked, item._id)}
              ></input>
            )}

            {edit ? (
              <>
                <input
                  value={editedList}
                  onChange={(e) => setEditedList(e.target.value)}
                  placeholder={`${item.list}`}
                  onKeyDown={(event) => handleKey(event, item._id)}
                ></input>
                <button onClick={() => handleEdit(item._id)}>
                  <MdFileDownloadDone />
                </button>
                <button
                  onClick={() => {
                    setEdit(false)
                    setEditedList(item.list)
                  }}
                >
                  <AiOutlineClose />
                </button>
              </>
            ) : (
              <>
                <p className="w-[50%] text-white">{item.list}</p>

                {!item.done && (
                  <button
                    onClick={() => {
                      setEdit(true)
                    }}
                  >
                    <FiEdit3 style={{ color: "white" }} />
                  </button>
                )}

                <button onClick={() => handleDelete(item._id)}>
                  <MdDeleteOutline style={{ color: "white" }} />
                </button>
              </>
            )}
          </TaskInformation>
        </div>
      )}
    </Draggable>
  )
}

export default TaskCard
