import { useState, useEffect } from "react"
import TextField from "@mui/material/TextField"
import { useCreateTodo } from "../../hooks";
import { priorityTaskEnum }  from '../../types';

export const Notion = () => {
  const [inputValue, setInputValue] = useState("")
  const [isFocus, setIsFocus] = useState(false)

  const { data } = useCreateTodo({
    title: inputValue,
    id: "",
    description: "",
    createdAt: 0,
    updatedAt: "",
    deadlineDate: 0,
    status: priorityTaskEnum.IN_PROGRES,
    priority: 0,
    color: "",
    userId: 0
  }, isFocus)

  useEffect(() => {
    if (data) setInputValue("")
    
  }, [data])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  const handleFocus = () => setIsFocus(true)
  const handleBlur = () => setIsFocus(false)

  return (
    <TextField
      id="outlined-basic"
      label="Outlined"
      variant="outlined"
      value={inputValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  )
}
