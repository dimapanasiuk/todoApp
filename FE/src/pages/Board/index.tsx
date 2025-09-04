import { List } from '../../components/List';
import { Notion } from '../../components//Notion'
import { useGetTodos, useDeleteTodo } from "../../hooks"
import { Header } from '../../components/Header';

const Board = () => {
	const [todos, isLoading, error] = useGetTodos();
	const { deleteData } = useDeleteTodo();

	if (isLoading ) return 'Loading'
	if(todos === null) return 'content is empty'
	if(error) return error

	return (
		<>
		  <Header/>
			<Notion/>
			<List data={todos} deleteData={deleteData}/>
		</>
	)
}

export default Board;
