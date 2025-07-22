const item = $input.item.json;
const headers = item.headers || {};
const body = item.body || {};

const result = {
  interactionId: body?.id || null,
  token: body?.token || null,
  ip: headers["x-real-ip"] || null,
  timestamp: headers["x-signature-timestamp"] || null,
  action: null,
  threadId: null,
  messageId: null,
  subjectLine: null,
  content: body?.message?.content || null,
  userId: body?.member?.user?.id || body?.user?.id || null,
  username: body?.member?.user?.username || body?.user?.username || null,
  globalName: body?.member?.user?.global_name || body?.user?.global_name || null,
};

const customId = body?.data?.custom_id;
if (customId) {
  const [action, threadId, messageId, subjectLine] = customId.split(" | ");
  result.action = action?.trim();
  result.threadId = threadId?.trim();
  result.messageId = messageId?.trim();
  result.subjectLine = subjectLine?.trim();
}

return [{ json: result }];
