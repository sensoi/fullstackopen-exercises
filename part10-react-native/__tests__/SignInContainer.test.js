import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignInContainer from '../components/SignInContainer';

describe('SignIn', () => {
  describe('SignInContainer', () => {
    it('calls onSubmit with correct arguments when form is submitted', async () => {
      const onSubmit = jest.fn();

      const { getByPlaceholderText, getByText } = render(
        <SignInContainer onSubmit={onSubmit} />
      );

      fireEvent.changeText(
        getByPlaceholderText('Username'),
        'kalle'
      );
      fireEvent.changeText(
        getByPlaceholderText('Password'),
        'password'
      );

      fireEvent.press(getByText('Sign in'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith({
          username: 'kalle',
          password: 'password',
        });
      });
    });
  });
});
