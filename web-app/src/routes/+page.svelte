<script>
  import Artyom from "artyom.js";
  import { browser } from "$app/environment";
  import {
    getReleaseDevice,
    connectToReleaseDevice,
    sendReleaseMessage,
  } from "$lib/sendReleaseMessage.js";
  import TreatRelease from "./TreatRelease.svelte";

  const triggerPhrase = "good job";
  const message = "We will give your dog a treat!!!";

  let listener,
    releaseDevice,
    bluetoothServer,
    active = false,
    showMessage = false,
    error,
    showNotes = false,
    notesDialog;

  // Setup listener for trigger phrase
  // and when heard: send message to release a dog treat
  if (browser) {
    listener = new Artyom();

    listener.on([triggerPhrase]).then(async () => {
      showMessage = true;
      listener.say(message);

      try {
        await sendReleaseMessage(bluetoothServer);
      } catch (e) {
        error = `Couldn't send message to treat release device via bluetooth because: ${e}`;
        console.error(e, e.message, e.stackTrace);
      }

      setTimeout(() => (showMessage = false), 3000);
    });
  }

  // Reactive statements
  // https://learn.svelte.dev/tutorial/reactive-statements
  $: if (notesDialog) showNotes ? notesDialog.showModal() : notesDialog.close();
  $: active ? startListening() : stopListening();

  async function startListening() {
    try {
      await listener.initialize({
        lang: "en-GB", // Great Britain english
        continuous: true, // Listen forever
        soundex: true, // Use the soundex algorithm to increase accuracy
        debug: true, // Show messages in the console
        // executionKeyword: "and do it now",
        listen: true, // Start to listen commands !
      });
    } catch (e) {
      error = "Voice listener couldn't be initialized: " + e;
      return;
    }

    try {
      releaseDevice = await getReleaseDevice();
    } catch (e) {
      error = "Couldn't find treat release device via bluetooth";
      return;
    }

    try {
      bluetoothServer = await connectToReleaseDevice(releaseDevice);
    } catch (e) {
      error = "Couldn't connect to treat release device via bluetooth";
    }
  }

  function stopListening() {
    listener?.fatality();
    bluetoothServer?.disconnect();
    error = null;
  }
</script>

{#if showMessage}
  <TreatRelease />
{:else}
  <div
    style="display: flex; justify-content: space-between; align-items: center;"
  >
    <h1>Hi,</h1>

    <button on:click={() => (showNotes = true)} class="icon">
      <img width="40" src="/resources/info_icon.png" alt="info icon" />
    </button>
  </div>

  <h2>Welcome to <span style="font-weight: 700;">Voice Feeder</span></h2>
  {#if error}
    <p class="error-message">{error}</p>
  {/if}

  <button class="icon" style="width: 100%;" on:click={() => (active = !active)}>
    {#if active}
      <img
        width="260"
        src="/resources/mic_on_icon.png"
        alt="microphone is on right now"
      />
    {:else}
      <img
        width="260"
        src="/resources/mic_off_icon.png"
        alt="microphone is off right now"
      />
    {/if}
  </button>

  <section>
    <div class="speechbox-container">
      <p style="font-weight: 700;">
        Device is <span style="text-transform: uppercase;"
          >{active ? "on" : "off"}</span
        >
      </p>
      <p>
        {#if active}
          Say “{triggerPhrase}” as
          <span style="font-weight: 700;">clearly</span>
          as possible to give your dog a
          <span style="font-weight: 700;">treat!!!</span>
        {:else}
          Turn on the <span style="font-weight: 700;">bluetooth</span> & tap the
          button to turn on the device.
        {/if}
      </p>
      <img
        width="300"
        class="speechbox"
        src="/resources/speechbox.png"
        alt=""
      />
    </div>
    <div class="dog-container">
      <img src="/resources/dog.png" class="dog" alt="dog" />
    </div>
  </section>

  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <dialog
    bind:this={notesDialog}
    aria-modal
    on:click={(e) => {
      const { left, right, top, bottom } = e.target.getBoundingClientRect();

      if (
        e.clientX < left ||
        e.clientX > right ||
        e.clientY < top ||
        e.clientY > bottom
      )
        showNotes = false;
    }}
    on:keypress
  >
    <div
      style="display: flex; width: 100%; justify-content: space-between; align-items: center;"
    >
      <h2>Notes</h2>
      <button on:click={() => (showNotes = false)} class="icon">
        <img width="40" src="/resources/close_icon.png" alt="close icon" />
      </button>
    </div>
    <ul>
      <li>Turn on the phone's bluetooth.</li>
      <li>Works on Google Chrome or Microsoft Edge.</li>
      <li>Doesn't need wifi or internet connection for use.</li>
      <li>
        On phone, install this website as an app & it will be on your home page.
      </li>
      <li>
        Only one phone/computer can connect to the treat release device via
        bluetooth.
      </li>
      <li>
        Feel free to take a look at, reuse or modify the <a
          href="https://github.com/arnard76/voice-activated-dog-feeder"
          >source code</a
        >
      </li>
    </ul>
  </dialog>
{/if}

<style>
  h1,
  h2 {
    color: var(--theme-colour);
    font-weight: 500;
    margin: 0;
    margin-left: 10px;
  }

  p,
  li,
  dialog h2 {
    color: #046a39;
    margin: 0;
  }

  dialog {
    border-radius: 25px;
    border: none;
    background-color: #f8eff9;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }

  button.icon {
    background: none;
    border: none;
    cursor: pointer;
  }

  .speechbox-container {
    position: relative;
    padding: 25px;
    width: 280px;
  }

  .speechbox {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
  }

  .error-message {
    color: black;
    font-weight: 900;
    padding: 20px;
    background-color: #f3b3ad;
    border-radius: 25px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }

  .dog-container {
    position: relative;
    overflow: hidden;
    width: 100vw;
    height: 200px;
  }

  .dog {
    position: absolute;
    left: 240px;
    top: -40px;
  }
</style>
