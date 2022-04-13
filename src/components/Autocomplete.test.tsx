import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Autocomplete from './Autocomplete';

const testData = [
  {id: '1', label: 'first option'},
  {id: '2', label: 'second Option'}
]

const loadOptionsTestData = (query: string) => Promise.resolve(
  testData.filter(item => item.label.toUpperCase().includes(query.toUpperCase()))
)

test('options should not be shown without interaction with component', () => {
  render(<Autocomplete loadOptions={loadOptionsTestData} />);

  expect(screen.getByRole('textbox')).toBeInTheDocument();
  expect(screen.queryByText(/FIRST/i)).toBeNull();
  expect(screen.queryByText(/No items/i)).toBeNull();
});

test('options should be filtered', async () => {
  render(<Autocomplete loadOptions={loadOptionsTestData} />);

  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'first' }
  })

  expect(await screen.findByText(/FIRST/i)).toBeInTheDocument();
  expect(screen.queryByText(/SECOND/i)).toBeNull();
});

test('both options should be shown', async () => {
  render(<Autocomplete loadOptions={loadOptionsTestData} />);

  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'option' }
  })

  expect(await screen.findByText(/FIRST/i)).toBeInTheDocument();
  expect(screen.getByText(/SECOND/i)).toBeInTheDocument();
});

test('No items text should be shown', async () => {
  render(<Autocomplete loadOptions={loadOptionsTestData} />);

  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'third' }
  })

  expect(await screen.findByText(/No items/i)).toBeInTheDocument();
});