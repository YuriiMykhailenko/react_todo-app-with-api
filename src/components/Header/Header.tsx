import {
  FC,
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
} from 'react';
import { Todo } from '../../types/Todo';
import { ErrorMessages } from '../../types/ErrorMessages';
import { postTodo, USER_ID } from '../../api/todos';
import { handleError } from '../../utils/utils';
import cn from 'classnames';

interface Props {
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<ErrorMessages>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTodosChange: any;
  tempTodo: Todo | null;
  todos: Todo[];
}

export const Header: FC<Props> = ({
  setError,
  setTempTodo,
  setTodos,
  onTodosChange,
  tempTodo,
  todos,
}) => {
  const isAllTodosCompleted = todos.every(todo => todo.completed);

  const HandleToglleAllButton = () => {
    if (isAllTodosCompleted) {
      const uncompletedTodos = todos.map(todo => ({
        ...todo,
        completed: false,
      }));

      onTodosChange(uncompletedTodos);
    } else {
      const completedTodos = todos
        .filter(todo => !todo.completed)
        .map(todo => {
          return {
            ...todo,
            completed: true,
          };
        });

      onTodosChange(completedTodos);
    }
  };

  const [text, setText] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [tempTodo, todos]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inputValue = text.trim();

    if (!inputValue) {
      handleError(setError, ErrorMessages.EmptyTitle);

      return;
    }

    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: inputValue,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    postTodo(temporaryTodo)
      .then(res => {
        setTodos(current => [...current, res]);
        setText('');
        setTempTodo(null);
      })
      .catch(() => {
        setTempTodo(null);
        handleError(setError, ErrorMessages.AddFail);
      });
  }

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllTodosCompleted })}
          data-cy="ToggleAllButton"
          onClick={HandleToglleAllButton}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={!!tempTodo}
          value={text}
          onChange={event => setText(event.target.value)}
          autoFocus
        />
      </form>
    </header>
  );
};
