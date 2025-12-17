import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

interface InputPromptProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export const InputPrompt: React.FC<InputPromptProps> = ({ onSubmit, disabled = false }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (text: string) => {
    if (text.trim()) {
      onSubmit(text.trim());
      setValue('');
    }
  };

  if (disabled) {
    return null;
  }

  return (
    <Box>
      <Text color="green" bold>{'> '}</Text>
      <TextInput
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        placeholder="Enter your message..."
      />
    </Box>
  );
};
