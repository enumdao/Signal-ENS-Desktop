// Copyright 2021-2022 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import type { TimelineItemType } from '../../components/conversation/TimelineItem';
import { proxyMemoize } from '../../util/proxyMemoize';

import type { StateType } from '../reducer';
import type { MessageWithUIFieldsType } from '../ducks/conversations';
import {
  getContactNameColorSelector,
  getConversationSelector,
  getSelectedMessage,
  getMessages,
} from './conversations';
import { getAccountSelector } from './accounts';
import {
  getRegionCode,
  getUserConversationId,
  getUserNumber,
  getUserACI,
  getUserPNI,
} from './user';
import { getActiveCall, getCallSelector } from './calling';
import { getPropsForBubble } from './message';

const getTimelineItemInner = proxyMemoize(
  (message: MessageWithUIFieldsType, state: StateType): TimelineItemType => {
    const selectedMessage = getSelectedMessage(state);
    const conversationSelector = getConversationSelector(state);
    const regionCode = getRegionCode(state);
    const ourNumber = getUserNumber(state);
    const ourACI = getUserACI(state);
    const ourPNI = getUserPNI(state);
    const ourConversationId = getUserConversationId(state);
    const callSelector = getCallSelector(state);
    const activeCall = getActiveCall(state);
    const accountSelector = getAccountSelector(state);
    const contactNameColorSelector = getContactNameColorSelector(state);

    return getPropsForBubble(message, {
      conversationSelector,
      ourConversationId,
      ourNumber,
      ourACI,
      ourPNI,
      regionCode,
      selectedMessageId: selectedMessage?.id,
      selectedMessageCounter: selectedMessage?.counter,
      contactNameColorSelector,
      callSelector,
      activeCall,
      accountSelector,
    });
  },
  {
    name: 'getTimelineItemInner',
  }
);

export const getTimelineItem = (
  state: StateType,
  id: string
): TimelineItemType | undefined => {
  const messageLookup = getMessages(state);

  const message = messageLookup[id];
  if (!message) {
    return undefined;
  }

  return getTimelineItemInner(message, state);
};
