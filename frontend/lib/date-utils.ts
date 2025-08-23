export function formatChatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (messageDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else if (messageDate > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

export function getDateGroupLabel(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (messageDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else if (messageDate > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
    return 'Previous 7 days';
  } else if (messageDate > new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)) {
    return 'Previous 30 days';
  } else {
    return 'Older';
  }
}

export function groupConversationsByDate(conversations: any[]) {
  const groups: { [key: string]: any[] } = {};
  
  conversations.forEach(conversation => {
    const groupLabel = getDateGroupLabel(conversation.createdAt);
    if (!groups[groupLabel]) {
      groups[groupLabel] = [];
    }
    groups[groupLabel].push(conversation);
  });
  
  const orderedGroups = ['Today', 'Yesterday', 'Previous 7 days', 'Previous 30 days', 'Older'];
  const result: { label: string; conversations: any[] }[] = [];
  
  orderedGroups.forEach(label => {
    if (groups[label] && groups[label].length > 0) {
      result.push({
        label,
        conversations: groups[label].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      });
    }
  });
  
  return result;
}
