import type { Agent } from "@/agents";
/**
 * This composables is a base composable
 * meant to be extended by specific soical platform composables
 */
import type { AsyncState } from "@/types";
import openai from "openai";

export const useChatAi = ({ agent }: { agent: Agent }) => {
  const state = ref<AsyncState>(null);
  const error = ref();
  const res = ref<openai.Chat.ChatCompletion>();

  const usage = computed(() => res.value?.usage);
  const choices = computed(() => res.value?.choices || []);
  const hasChoices = computed(() => choices.value.length);
  const firstChoice = computed(() => choices.value.at(0));
  const firstMessage = computed(() => firstChoice.value?.message);

  async function chat(options: Record<string, any>) {
    try {
      state.value = "loading";

      const result = await fetchWithTimeout<openai.Chat.ChatCompletion>(
        `/api/ai`,
        {
          method: "POST",
          body: {
            ...options,
            agent: `${agent}Agent`,
          },
        }
      );
      if (!result.choices || !result.usage) {
        throw new Error("Invalid AI response");
      }

      res.value = result;
      state.value = "complete";
      return res.value;
    } catch (err) {
      state.value = "error";
      error.value = err;
    }
  }

  return {
    state,
    chat,
    choices,
    usage,
    firstChoice,
    hasChoices,
    firstMessage,
    res,
  };
};
