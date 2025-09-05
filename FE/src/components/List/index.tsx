import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Chip,
  LinearProgress,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTodoStore } from '@/store/todoStore';
import { DialogWindow } from '@/components/DialogWindow';
import type { Task } from '@/types'; 

type ListType = {
  data: Task[];
  deleteData: (id: string) => Promise<boolean>;
} 

export const List = ({ data, deleteData }: ListType) => {
  const { isDeleting, error, clearError } = useTodoStore();

  const onDelete = async (id: string) => {
    await deleteData(id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'default';
      case 'in progress': return 'warning';
      case 'done': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'error';
    if (priority >= 3) return 'warning';
    return 'success';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU');
  };

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
      {isDeleting && (
        <LinearProgress sx={{ mb: 2 }} />
      )}
      
      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Array.isArray(data) && data.map(item => 
          <DialogWindow key={item?.id} data={item}>
            <Card 
              variant="outlined" 
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: 2,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1, mr: 2 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      color: 'text.primary',
                      fontWeight: 'medium'
                    }}
                  >
                    {item.title}
                  </Typography>
                  
                  {item.description && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {item.description}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    <Chip 
                      label={item.status} 
                      size="small" 
                      color={getStatusColor(item.status) as any}
                    />
                    <Chip 
                      label={`Приоритет: ${item.priority}`} 
                      size="small" 
                      color={getPriorityColor(item.priority) as any}
                    />
                    {item.deadlineDate && (
                      <Chip 
                        label={`До: ${formatDate(item.deadlineDate)}`} 
                        size="small" 
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
                
                <IconButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  disabled={isDeleting}
                  sx={{ 
                    "&:hover": { 
                      backgroundColor: 'error.light',
                      color: 'white'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </DialogWindow>
        )} 
      </Box>
    </Box>
  );
};
