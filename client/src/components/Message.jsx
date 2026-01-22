import React from 'react';

/**
 * Reusable component for displaying alert messages.
 *
 * @param {object} props - The component props.
 * @param {'success' | 'danger' | 'info' | 'warning'} [props.type='info'] - The type of message, which maps to a CSS class.
 * @param {React.ReactNode} props.children - The content of the message.
 */
const Message = ({ type = 'info', children }) => {
  const className = `alert alert-${type}`;
  return <div className={className}>{children}</div>;
};

export default Message;