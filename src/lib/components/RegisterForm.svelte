<script lang="ts">
  import type { SubmitFunction } from "@sveltejs/kit";
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { alerts, modals } from "$lib/stores";

  let submitting = false;

  const formEnhancment: SubmitFunction = async () => {
    submitting = true;
    return async ({ update, result }) => {
      await update();
      if (result.type === "success") {
        alerts.set(`Logged in as ${$page.data.currentUser?.username}`, "info");
        modals.clear();
      }
      submitting = false;
    }
  }
</script>

<div id="registerModal" tabindex="-1" role="dialog"
  class="fixed top-0 z-50 w-full h-full overflow-x-hidden overflow-y-auto {$modals === 2 ? "flex" : "hidden"}">
  <div class="flex justify-center items-center w-full h-full bg-black bg-opacity-50">
    <form action="/auth?/register" method="post" use:enhance={formEnhancment}
      class="relative bg-white rounded-lg mx-4 p-8 flex-grow max-w-[425px]">
      <div class="grid grid-cols-8 pt-2 pb-4">
        <h1 class="col-span-6 col-start-2 text-4xl text-center font-semibold">
          Register
        </h1>
        <div class="flex items-center justify-center mt-1">
          <button type="button" class="btn-close" on:click={modals.clear}></button>          
        </div>
      </div>
      <div class="mb-4">
        <label for="username" class="block mb-2">Username</label>
        <input type="text" name="username" placeholder="Enter Username" 
          class="form-input" minlength=4 maxlength=20>
        <small class="text-gray-500">Must be 4-20 characters</small>
      </div>
      <div class="mb-4">
        <label for="password" class="block mb-2">Password</label>
        <input type="password" name="password" placeholder="Enter Password" 
          class="form-input" minlength=4>
        <small class="text-gray-500">Must be 4-20 characters</small>
      </div>
      <button type="submit" class="btn-white-lg w-full mb-2" disabled={submitting}>
        Register
      </button>
    </form>
  </div>
</div>