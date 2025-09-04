import { List } from '../../components/List';
import { Notion } from '../../components/Notion';
import { useTodoStore } from '../../store/todoStore';
import { Header } from '../../components/Header';
import Loader from '../../components/Loader';
import { Box, Alert } from '@mui/material';
import { useEffect } from 'react';

const Board = () => {
	const { 
		todos, 
		isFetching, 
		error, 
		deleteTodo,
		fetchTodos
	} = useTodoStore();

	// Загружаем задачи при монтировании компонента
	useEffect(() => {
		fetchTodos();
	}, [fetchTodos]);

	if (isFetching) {
		return (
			<Loader 
				type="backdrop" 
				loading={true} 
				message="Загружаем ваши задачи..." 
			/>
		);
	}

	if (error) {
		return (
			<Box sx={{ p: 2 }}>
				<Alert severity="error">{error}</Alert>
			</Box>
		);
	}

	if (todos.length === 0) {
		return (
			<>
				<Header/>
				<Box sx={{ p: 2, textAlign: 'center' }}>
					<Alert severity="info">У вас пока нет задач. Создайте первую!</Alert>
				</Box>
				<Notion/>
			</>
		);
	}

	return (
		<>
			<Header/>
			<Notion/>
			<List data={todos} deleteData={deleteTodo}/>
		</>
	);
};

export default Board;
