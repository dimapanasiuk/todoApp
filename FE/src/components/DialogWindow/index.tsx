import {useEffect, useState, type ReactNode} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { EditableText } from '../EditableText';
import type { Task } from '../../types';
import { useUpdateTodo } from '../../hooks'

type DialogWindowType = {
  children: ReactNode,
  data: Task
}

export const DialogWindow = ({data, children}: DialogWindowType) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({});
  const { updateTodo } =  useUpdateTodo()

  useEffect(() => {
    if(Object.keys(formData).length) {
      updateTodo(data.id, formData)
    }
  }, [isEditing])


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  

  if(!data.title) return null;

  return (
    <>
      <li onClick={handleClickOpen} style={{cursor: 'pointer', margin: '10px 0'}}>
        {children}
      </li>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {data?.title}
        </DialogTitle>
        <DialogContent>
          <EditableText 
            name={'title'}
            initialValue={data?.title} 
            isEditing={isEditing} 
            setIsEditing={setIsEditing}
            setData={setFormData}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}