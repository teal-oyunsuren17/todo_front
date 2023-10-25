import axios from "axios"
import { useState } from "react"
import { GrAdd } from "react-icons/gr"
import { toast } from "react-toastify"

export function CreateTasks(props) {
  const { getDatas } = props
  const [list, setList] = useState("")

  const notify = () =>
    toast.success("Success", {
      position: "top-right",
      autoClose: 2000,
      pauseOnHover: false,
    })

  function handleSave() {
    axios
      .post(`https://todo-back-q1ut.onrender.com/list`, {
        list: list,
      })
      .then(function (response) {
        if (response.status === 201) {
          getDatas()
          setList("")
          notify()
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  function handleKey(event) {
    if (event.key === "Enter") {
      handleSave()
    }
  }

  return (
    <div className="w-100 text-center m-6">
      <h1 className="text-2xl font-mono mb-3" style={{ color: "#ffdfdb" }}>
        Just Do It
      </h1>
      <div className="flex flex-row justify-center h-[50px]">
        <input
          value={list}
          onChange={(e) => setList(e.target.value)}
          className="border-solid border-2 rounded-l-lg border-rose-100 bg-slate-800 text-white pl-3"
          placeholder="       add task here"
          onKeyDown={handleKey}
        ></input>
        <button
          className="rounded-r-lg bg-rose-100 w-10 flex justify-center items-center"
          onClick={handleSave}
        >
          <GrAdd />
        </button>
      </div>
    </div>
  )
}
