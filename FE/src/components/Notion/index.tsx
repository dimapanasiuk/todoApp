import { useState } from "react";
import { 
  TextField, 
  Box, 
  Button, 
  Alert,
  CircularProgress 
} from "@mui/material";
import { useTodoStore } from "@/store/todoStore";
import { priorityTaskEnum } from '@/types';

export const Notion = () => {
  const [inputValue, setInputValue] = useState("");
  const [description, setDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const { createTodo, isCreating, error, clearError } = useTodoStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    clearError();
    
    const todoData = {
      title: inputValue.trim(),
      description: description.trim(),
      createdAt: Date.now(),
      updatedAt: new Date().toISOString(),
      deadlineDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 дней от текущего времени
      status: priorityTaskEnum.TODO,
      priority: 3,
      color: "#2196F3"
    };

    const result = await createTodo(todoData);
    
    if (result) {
      setInputValue("");
      setDescription("");
      setIsExpanded(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Название задачи"
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyPress={handleKeyPress}
            disabled={isCreating}
            placeholder="Введите название задачи..."
          />
          
          {isExpanded && (
            <>
              <TextField
                fullWidth
                label="Описание (необязательно)"
                variant="outlined"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isCreating}
                placeholder="Добавьте описание к задаче..."
              />
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsExpanded(false);
                    setInputValue("");
                    setDescription("");
                  }}
                  disabled={isCreating}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!inputValue.trim() || isCreating}
                  startIcon={isCreating ? <CircularProgress size={20} /> : null}
                >
                  {isCreating ? 'Создание...' : 'Создать задачу'}
                </Button>
              </Box>
            </>
          )}
          
          {error && (
            <Alert severity="error" onClose={clearError}>
              {error}
            </Alert>
          )}
        </Box>
      </form>
    </Box>
  );
};
