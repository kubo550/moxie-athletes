import { apiClient } from '@/utils/api/apiClient';
import type { Message } from '@/types/QuoteType';

const CHAT_ENDPOINT = import.meta.env.VITE_APP_CHAT_ENDPOINT || '/daily/chat';

export const askByApiCall = async (
  conversation: Message[],
  coachType?: string
) => {
  const response = await apiClient.post(
    CHAT_ENDPOINT,
    {
      conversation,
      coachType,
    },
    { withCredentials: true }
  );
  return response.data as { reply: string };
};
