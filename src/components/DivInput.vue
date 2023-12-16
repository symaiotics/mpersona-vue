<template>
    <div ref="editableDiv"
         contenteditable="true"
         @input="handleInput"
         @keydown="handleKeyDown"
         @keyup.enter="handleEnter"
         @paste="handlePaste"
         :class="['editable', 'form-input', 'w-full', 'pl-4', 'overflow-auto']"
         :placeholder="props.placeholder"
         aria-label="Search anything"
         :style="{ minHeight: '20px', maxHeight: '600px' }"></div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted , nextTick} from 'vue';
  
  const emit = defineEmits(['update:modelValue']);
  const modelValue = ref('');
  const editableDiv = ref(null);
  

  const props = defineProps({
  asPlainText: {
    type: Boolean,
    default: true
  }, placeholder:{type:String, default:""}
});

  watch(modelValue, (newValue) => {
    if (editableDiv.value && editableDiv.value.innerText !== newValue) {
      editableDiv.value.innerText = newValue;
    }
  });
  
//   function handleInput(event) {
//     emit('update:modelValue', event.target.innerText);
//   }
  



function handleInput(event) {
  // Calculate cursor position before updating the model
  const cursorPosition = calculateCursorPosition(event.target);
  
  // Update model value
  emit('update:modelValue', event.target.textContent);

  // After Vue has updated the DOM, restore the cursor position
  nextTick(() => {
    restoreCursorPosition(event.target, cursorPosition);
  });
}


  function handleKeyDown(event) {
    // if (event.key === 'Enter' && !event.shiftKey) {
    //   event.preventDefault();
    //   trigger();
    // }
  }
  
  function handleEnter(event) {
    if (!event.shiftKey) {
      event.preventDefault();
      trigger();
    }
  }

  
  
  
function handlePaste(event) {
  event.preventDefault();
  const clipboardData = event.clipboardData || window.clipboardData;
  const selection = window.getSelection();

  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();

  let insertedNode;

  if (props.asPlainText) {
    let pastedData = clipboardData.getData('text/plain');
    // Remove excessive line breaks
    pastedData = pastedData.replace(/(\r\n|\r|\n){3,}/g, '\n\n');
    const textNode = document.createTextNode(pastedData);
    range.insertNode(textNode);
    insertedNode = textNode;
  } else {
    let pastedData = clipboardData.getData('text/html');
    // Remove excessive <br> tags
    pastedData = pastedData.replace(/(<br\s*\/?>){3,}/gi, '<br><br>');
    const div = document.createElement('div');
    div.innerHTML = pastedData;
    range.insertNode(div);
    insertedNode = div;
  }

  // Move the selection to the end of the inserted content
  range.setStartAfter(insertedNode);
  range.collapse(true);

  selection.removeAllRanges();
  selection.addRange(range);

  // Update the model value to reflect the changes
  emit('update:modelValue', editableDiv.value.textContent);
}
  function trigger() {
    // Implement your trigger logic here
  }
  
  onMounted(() => {
  if (editableDiv.value) {
    editableDiv.value.textContent = modelValue.value;
    ensureCursorTarget(); // Call this to ensure initial content is correctly formatted
  }
});
function ensureCursorTarget() {
  const div = editableDiv.value;
  if (div) {
    // Replace completely empty divs (or those with only whitespace) with divs containing a non-breaking space
    div.innerHTML = div.innerHTML.replace(/<div>\s*<\/div>/g, '<div>&nbsp;</div>');
  }
}


function calculateCursorPosition(editableDiv) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null; // No selection, return null
  
  const range = selection.getRangeAt(0);
  const preCaretRange = range.cloneRange(); // Clone the current range
  preCaretRange.selectNodeContents(editableDiv); // Select all text
  preCaretRange.setEnd(range.endContainer, range.endOffset); // Set the end of the range to the cursor position
  const cursorPosition = preCaretRange.toString().length; // The cursor position is the length of the range
  return cursorPosition;
}

function restoreCursorPosition(editableDiv, cursorPosition) {
  const selection = window.getSelection();
  const range = document.createRange();
  range.setStart(editableDiv, 0);
  range.collapse(true);

  const childNodes = Array.from(editableDiv.childNodes);
  let currentPos = 0;

  for (const node of childNodes) {
    if (node.nodeType === 3) { // Node is a text node
      const nextPos = currentPos + node.length;
      if (cursorPosition <= nextPos) {
        // Found the node where the cursor should be
        range.setStart(node, cursorPosition - currentPos);
        range.collapse(true);
        break;
      }
      currentPos = nextPos;
    } else {
      // Handle other node types if necessary
    }
  }

  selection.removeAllRanges();
  selection.addRange(range);
}



</script>
  
  <style>
  /* Add custom styles for the editable div */
  .editable {
    overflow-y: auto;
    word-break: break-word;
    white-space: pre-wrap;
  }
  
  /* Placeholder effect for the contenteditable div */
  [contenteditable]:empty:before {
    content: attr(placeholder);
    display: block;
    color: grey;
  }
  
  /* Tailwind classes can be applied directly in the template or here */
  .form-input {
    /* Custom styles or overrides for the form-input class */
  }
  </style>