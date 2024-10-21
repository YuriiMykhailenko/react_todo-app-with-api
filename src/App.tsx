import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { FilterOptions } from './utils/FilterOptions';
import { getFilteredTodos } from './utils/GetFilteredTodos';
import { handleError } from './utils/utils';

import { deleteTodo, getTodos, patchTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';

import { ErrorMessages } from './types/ErrorMessages';
import { Todo } from './types/Todo';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<ErrorMessages>(ErrorMessages.None);
  const [idsForDelete, setIdsForDelete] = useState<number[]>([]);
  const [todosForUpdate, setTodosForUpdate] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState<FilterOptions>(
    FilterOptions.All,
  );

  const handleDeleteTodos = useCallback((ids: number[]) => {
    Promise.all(
      ids.map(id => {
        setIdsForDelete(current => [...current, id]);

        deleteTodo(id)
          .then(() => {
            setTodos(current => current.filter(todo => todo.id !== id));
          })
          .catch(() => {
            handleError(setError, ErrorMessages.DeleteFail);
          })
          .finally(() =>
            setIdsForDelete(currIds => currIds.filter(currId => currId !== id)),
          );
      }),
    );
  }, []);

  const handleChangeTodos = useCallback(
    (newTodos: Todo[]) => {
      return Promise.all(
        newTodos.map(todo => {
          setTodosForUpdate(current => [...current, todo]);

          const { id, ...todoBody } = todo;

          return patchTodo(todoBody, id)
            .then(() => {
              setTodos(current =>
                current.map(currentTodo => {
                  return currentTodo.id !== todo.id ? currentTodo : todo;
                }),
              );
            })
            .catch(() => {
              handleError(setError, ErrorMessages.UpdateFail);
              throw new Error(error);
            })
            .finally(() => setTodosForUpdate([]));
        }),
      );
    },
    [error],
  );

  const hideError = useCallback(() => {
    return setError(ErrorMessages.None);
  }, []);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => handleError(setError, ErrorMessages.LoadFail));
  }, []);

  const completedTodosId = useMemo(() => {
    return todos.filter(todo => todo.completed).map(todo => todo.id);
  }, [todos]);

  const numberOfActiveTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, filterOption);
  }, [todos, filterOption]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          tempTodo={tempTodo}
          setError={setError}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          onTodosChange={handleChangeTodos}
        />

        {(!!todos.length || tempTodo) && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              todosForUpdate={todosForUpdate}
              setError={setError}
              onTodosChange={handleChangeTodos}
              idsForDelete={idsForDelete}
              onDeleteTodo={handleDeleteTodos}
            />
            <Footer
              filterOption={filterOption}
              numberOfActiveTodos={numberOfActiveTodos}
              completedTodosId={completedTodosId}
              setFilterOption={setFilterOption}
              onDeleteTodos={handleDeleteTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} hideError={hideError} />
    </div>
  );
};
