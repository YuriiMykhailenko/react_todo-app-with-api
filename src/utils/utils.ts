import { ErrorMessages } from '../types/ErrorMessages';
import { Dispatch, SetStateAction } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from 'lodash.debounce';

export const handleError = (
  setError: Dispatch<SetStateAction<ErrorMessages>>,
  error: ErrorMessages,
) => {
  const hideError = debounce(setError, 3000);

  setError(error);

  hideError(ErrorMessages.None);
  // setTimeout(() => {
  //   setError(ErrorMessages.None);
  // }, 3000);
};
