const LEFT_CLICK = 'LEFT_CLICK';
const RIGHT_CLICK = 'RIGHT_CLICK';



const pasteFct = async (e) => {
  const path = e.path;

  // if (el.localName === 'img') {
  //   if (click === LEFT_CLICK) {
  //     sendText(el.alt);
  //   }
  //   if (click === RIGHT_CLICK) {
  //     e.preventDefault();
  //     appendText(el.alt);
  //   }
  // }

  if (path[0].classList.contains('chat-author__display-name')) {
    document.querySelector('[data-test-selector="close-viewer-card"]').click();
    inputText(`@${path[0].innerText} `);
    setTimeout(() => document.querySelector('[data-a-target="chat-input"]').blur(), 100);
    return;
  }

  /* get the chat-line */
  let chatline;
  for (const el of path) {
    if (el.classList && el.classList.contains('chat-line__message')) {
      chatline = el;
    }
  }

  if (!chatline) {
    return;
  }
  //console.log('chatline', chatline);

  const messageNodes = Array.prototype.slice.call(chatline.childNodes, 3);
  // console.log(messageNodes);

  let message = ' ';
  for (let node of messageNodes) {
    if (node.classList.contains('chat-line__message--emote-button')) {
      node = node.firstElementChild;
    }

    if (node.classList.contains('mention-fragment')) {
      message += ` ${node.innerText} `;
    }
    else if (node.hasAttribute('data-a-target') && node.getAttribute('data-a-target') === 'emote-name') {
      message += ` ${node.firstElementChild.alt} `;
    }
    else if (node.classList.contains('text-fragment')) {
      if (node.childNodes[0].localName !== 'span') {
        message += ` ${node.innerText} `;
      }
      else if (node.childNodes[0].localName === 'span') {
        for (const subnode of node.childNodes[0].childNodes) {
          message += ` ${subnode.nodeType === 3 ? subnode.textContent : subnode.childNodes[1].alt} `;
        }
      }
    }
  }
  // console.log(message);

  sendText(message);

  setTimeout(() => {
    if (document.body.querySelector('[class^=chat-list__more-messages]').firstElementChild) {
      document.body.querySelector('[class^=chat-list__more-messages]').firstElementChild.firstElementChild.click();
    }
  }, 200);

  // if ([].includes.call(el.classList, 'chat-line__message') && click === RIGHT_CLICK) {
  //   e.preventDefault();

  //   let input = '';
  //   for (let i = 3; i < el.childElementCount; ++i) {
  //     let img;
  //     if (img = el.childNodes[i].getElementsByTagName('img')[0]) {
  //       input += ` ${img.alt} `;
  //     }
  //     else {
  //       input += ` ${el.childNodes[i].innerText.trim()} `;
  //     }
  //   }
  //   sendText(input);
  // }
};

/**
 * Returns the chatinput textarea element of the page.
 */
const getChatInput = () => document.querySelector('[data-a-target=chat-input]');

/**
 * Notifies the app that the textarea value has changed.
 */
const notifyChatInput = (input) => {
  const changevent = document.createEvent('Events');
  changevent.initEvent('change', true, true)
  input.dispatchEvent(changevent);
};

const appendText = (text) => {
  let input = getChatInput().value;
  if (input) { input += ' ' }
  input += text;
  inputText(input);
};

const inputText = (text) => {
  const chatinput = getChatInput();

  chatinput.innerText = text;
  chatinput.value = text;

  notifyChatInput(chatinput);
};

const getInputText = () => getChatInput().value;

const clickSend = () => document.querySelector('[data-a-target=chat-send-button]').click();

/**
 * This function will send the text provided and keep the text of the chat input intact.
 */
const sendText = (text) => {
  const tempinput = getInputText();
  inputText(text);
  clickSend();
  inputText(tempinput);
};


/* bind events */
window.addEventListener('click', pasteFct);
// window.addEventListener('contextmenu', (e) => pasteFct(e, RIGHT_CLICK));
window.addEventListener('keydown', (e) => {
  if (e.keyCode === 116) {
    e.preventDefault();
    document.body.querySelector('[class^=top-nav__nav-link]').click(); document.body.querySelector('[class^=persistent-player__control]').click();
  }
});

// let mouseMoveEvent;
// window.addEventListener('mousemove', (e) => {
//   if (!mouseMoveEvent) {
//     mouseMoveEvent = setTimeout(() => {
//       for (const el of e.path) {
//         if 
//       }
//       mouseMoveEvent = undefined;
//     }, 1000);
//   }
// });

const chatlineStyle = document.createElement('style');
chatlineStyle.innerText = '[class^=chat-line__message] { cursor: pointer } [class^=chat-line__message]:hover { opacity: .7 }';
document.body.appendChild(chatlineStyle);