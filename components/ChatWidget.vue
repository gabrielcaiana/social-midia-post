<script setup lang="ts">
import { Message, User } from '~~/types'

const me = ref<User>({
  id: 'user',
  avatar: '/avatar.jpg',
  name: 'You',
})
const bot = ref<User>({
  id: 'assistant',
  avatar: '/bot.jpg',
  name: 'Botman',
})

const users = computed(() => [me.value, bot.value])

const messages = ref<Message[]>([])

const messagesForApi = computed(() => {
  const messageHistory = messages.value
    .map((m) => ({
      content: m.text,
      role: m.userId,
    }))
    .slice(-2)

  return messageHistory
})

const usersTyping = ref<User[]>([])

// send messages to Chat API here
// and in the empty function below

const handleNewMessage = async (message: Message) => {
  if (!message.text) return

  messages.value.push(message)
  usersTyping.value.push(bot.value)
  const res = await $fetch('/api/ai', {
    method: 'POST',
    body: {
      messages: messagesForApi.value,
    },
  })

  if (!res.choices[0].message?.content) return

  const msg = {
    id: res.id,
    userId: bot.value.id,
    createdAt: new Date(),
    text: res.choices[0].message?.content,
  }

  messages.value.push(msg)
  usersTyping.value = []
}
</script>
<template>
  <ChatBox
    :me="me"
    :users="users"
    :messages="messages"
    @new-message="handleNewMessage"
    :usersTyping="usersTyping"
  />
</template>
