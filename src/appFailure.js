import { ref } from 'vue';

// Shared with the root view so a failed child can be replaced with a recovery screen.
export const appFailure = ref(false);
