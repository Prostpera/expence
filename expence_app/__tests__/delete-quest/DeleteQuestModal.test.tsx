import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteQuestModal from '../../src/components/DeleteQuestModal';

describe('DeleteQuestModal', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const defaultProps = {
    questTitle: 'Complete Budget Report',
    isOpen: true,
    isLoading: false,
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Case DQ-FE-001: Modal renders when isOpen is true
  test('should render the modal when isOpen is true', () => {
    render(<DeleteQuestModal {...defaultProps} />);
    
    expect(screen.getAllByText('Delete Quest')).toHaveLength(2);
    expect(screen.getByText(/Are you sure you want to delete this quest?/i)).toBeInTheDocument();
  });

  // Test Case DQ-FE-002: Modal does not render when isOpen is false
  test('should not render the modal when isOpen is false', () => {
    const props = { ...defaultProps, isOpen: false };
    render(<DeleteQuestModal {...props} />);
    
    expect(screen.queryByText('Delete Quest')).not.toBeInTheDocument();
  });

  // Test Case DQ-FE-003: Quest title is displayed correctly
  test('should display the quest title in the modal', () => {
    render(<DeleteQuestModal {...defaultProps} />);
    
    expect(screen.getByText(`"${defaultProps.questTitle}"`)).toBeInTheDocument();
  });

  // Test Case DQ-FE-004: Cancel button closes the modal
  test('should call onCancel when cancel button is clicked', () => {
    render(<DeleteQuestModal {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  // Test Case DQ-FE-005: Confirm button triggers deletion
  test('should call onConfirm when delete button is clicked', () => {
    render(<DeleteQuestModal {...defaultProps} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete quest/i });
    fireEvent.click(deleteButton);
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  // Test Case DQ-FE-006: Loading state disables buttons
  test('should disable buttons when isLoading is true', () => {
    const props = { ...defaultProps, isLoading: true };
    render(<DeleteQuestModal {...props} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    const deleteButton = screen.getByRole('button', { name: /deleting/i });
    
    expect(cancelButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  // Test Case DQ-FE-007: Loading state shows "Deleting..." text
  test('should show "Deleting..." text when isLoading is true', () => {
    const props = { ...defaultProps, isLoading: true };
    render(<DeleteQuestModal {...props} />);
    
    expect(screen.getByText('Deleting...')).toBeInTheDocument();
  });

  // Test Case DQ-FE-008: Close button (X) calls onCancel
  test('should call onCancel when close (X) button is clicked', () => {
    render(<DeleteQuestModal {...defaultProps} />);
    
    const closeButton = screen.getAllByRole('button')[0]; // X button is the first button
    fireEvent.click(closeButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  // Test Case DQ-FE-009: Warning message is visible
  test('should display warning message about permanent deletion', () => {
    render(<DeleteQuestModal {...defaultProps} />);
    
    expect(
      screen.getByText(/This action cannot be undone. All progress will be lost permanently./i)
    ).toBeInTheDocument();
  });

  // Test Case DQ-FE-010: Modal has proper styling classes
  test('should have red styling for danger action', () => {
    const { container } = render(<DeleteQuestModal {...defaultProps} />);
    
    const modalHeader = container.querySelector('.bg-gradient-to-r');
    expect(modalHeader).toHaveClass('from-red-900');
    expect(modalHeader).toHaveClass('to-red-700');
  });
});
