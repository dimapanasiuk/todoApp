import { useState } from "react"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import EditIcon from "@mui/icons-material/Edit"

type EditableTextProps = {
  name: string;
  initialValue: string;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  setData: React.Dispatch<React.SetStateAction<object>>;
}

export const EditableText = ({ name, initialValue, setData, isEditing, setIsEditing }: EditableTextProps) => {
  const [value, setValue] = useState(initialValue)

  const handleEditClick = () => setIsEditing(true)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setValue(value)
    setData(prev => ({...prev, [name]: value}));
  }
  

  const handleBlur = () => setIsEditing(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false)
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {isEditing ? (
        <TextField
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          size="small"
          autoFocus
        />
      ) : (
        <>
          <span>{value}</span>
          <IconButton size="small" onClick={handleEditClick}>
            <EditIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </div>
  )
}
