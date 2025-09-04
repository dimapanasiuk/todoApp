import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";

import { DialogWindow } from '../DialogWindow';
import type { Task } from '../../types'; 

type ListType = {
  data: Task[];
  deleteData: (id: string) => void
} 

export const List = ({data, deleteData}: ListType) => {
  const onDelete = (id: string) => {
    deleteData(id)
  }

  return (
    <ul>
      {data.map(item => 
        <DialogWindow key={item?.id} data={item}>
          <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">
              <CardContent  sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Box>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2">
                  {item.description}
                </Typography>
                </Box>
                <IconButton onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id)
                  }}
                 sx={{ "&:hover": { opacity: "0.5" } }}>
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Box>
        </DialogWindow>
      )} 
    </ul>
  )

}
