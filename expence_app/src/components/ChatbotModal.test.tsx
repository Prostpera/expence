import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatbotModal from './ChatbotModal';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('ChatbotModal', () => {
  // Test Case AICA-001: Initial welcome message Test Case
  test('should display the initial welcome message when opened', () => {
    render(<ChatbotModal isOpen={true} onClose={() => {}} />);
    const welcomeMessage = screen.getByText(
      /Hello! I'm Sage, your EXPence Assistant/i
    );
    expect(welcomeMessage).toBeInTheDocument();
  });

  // Test Case AICA-008: Preventing blank messages
  test('should not send a message if the input is empty', () => {
    render(<ChatbotModal isOpen={true} onClose={() => {}} />);
    const sendButton = screen.getByRole('button', { name: /send/i });

    // Check that the button is initially disabled
    const sendIcon = screen.getByRole('img', { name: /send/i });
    expect(sendButton).toBeDisabled();
    expect(sendIcon).toBeInTheDocument();
  });

  // Test Case AICA-014: Loading indicator and button disable
  test('should display a loading indicator and disable the send button when sending a message', async () => {
    // Mock a successful but delayed fetch response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ response: 'Test AI response' }),
    });

    render(<ChatbotModal isOpen={true} onClose={() => {}} />);
    const input = screen.getByPlaceholderText(/Type a message.../i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    // Simulate user typing and sending a message
    fireEvent.change(input, { target: { value: 'What is a budget?' } });
    fireEvent.click(sendButton);

    // Expect the loading state to be active
    const loadingIcon = screen.getByRole('img', { name: /loading/i }); // Assuming you added an alt text for the loader
    expect(loadingIcon).toBeInTheDocument();
    expect(sendButton).toBeDisabled();

    // Wait for the response and expect the loading state to disappear
    await waitFor(() => {
      expect(loadingIcon).not.toBeInTheDocument();
    });
    
    // Check that the button is no longer disabled
    expect(sendButton).not.toBeDisabled();
  });

  // Test Case TC-002: Providing relevant advice
  test('should display the AI response after the user sends a message', async () => {
    // Mock a successful fetch response
    const mockResponseText = 'A budget is a plan for your money.';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ response: mockResponseText }),
    });

    render(<ChatbotModal isOpen={true} onClose={() => {}} />);
    const input = screen.getByPlaceholderText(/Type a message.../i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'What is a budget?' } });
    fireEvent.click(sendButton);

    // Wait for the AI's response to appear in the chat history
    await waitFor(() => {
      expect(screen.getByText(mockResponseText)).toBeInTheDocument();
    });
  });

  // Test Case AICA-010: API failure
  test('should display a fallback error message on API failure', async () => {
    // Mock a failed fetch response
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<ChatbotModal isOpen={true} onClose={() => {}} />);
    const input = screen.getByPlaceholderText(/Type a message.../i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Why is the API down?' } });
    fireEvent.click(sendButton);

    // Wait for the fallback error message to appear
    await waitFor(() => {
      expect(
        screen.getByText(/AI service is unavailable. Please try again later./i)
      ).toBeInTheDocument();
    });
  });
});