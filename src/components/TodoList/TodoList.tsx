/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC } from 'react';
import { Todo } from '../../types/Todo';

import { TodoInfo } from '../TodoInfo';
import { ErrorMessages } from '../../types/ErrorMessages';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  todosForUpdate: Todo[];
  idsForDelete: number[];
  setError: React.Dispatch<React.SetStateAction<ErrorMessages>>;
  onTodosChange: (newTodos: Todo[]) => void;
  onDeleteTodo: (ids: number[]) => void;
}

export const ToodoList: FC<Props> = ({
  todos,
  tempTodo,
  todosForUpdate,
  idsForDelete,
  onTodosChange,
  setError,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoInfo
            todo={todo}
            key={todo.id}
            setError={setError}
            todosForUpdate={todosForUpdate}
            onTodosChange={onTodosChange}
            idsForDelete={idsForDelete}
            onDeleteTodo={onDeleteTodo}
          />
        );
      })}
      {tempTodo && <TodoInfo todo={tempTodo} />}
    </section>
  );
};
