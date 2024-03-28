// Vanilla JS debounce function, by Josh W. Comeau:
// https://www.joshwcomeau.com/snippets/javascript/debounce/
function debounce(callback, wait) {
	let timeoutId = null;
	return (...args) => {
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			callback.apply(null, args);
		}, wait);
	};
}

// Define variables for search field
let searchFormFilledClassName = "search-has-value";
let searchFormSelector = "form[role='search']";

// Clear the search input, and then return focus to it
function clearSearchInput(event) {
	event.target.closest(searchFormSelector).classList.remove(searchFormFilledClassName);

	let input;
	if (event.target.tagName === "INPUT") {
		input = event.target;
	} else if (event.target.tagName === "BUTTON") {
		input = event.target.previousElementSibling;
	} else {
		input = event.target.closest("button").previousElementSibling;
	}
	input.value = "";
	input.focus();
}

// Have the search input and clear button respond
// when someone presses the escape key, per:
// https://twitter.com/adambsilver/status/1152452833234554880
function clearSearchInputOnKeypress(event) {
	const searchInputDeleteKeys = ["Delete", "Escape"];
	if (searchInputDeleteKeys.includes(event.key)) {
		clearSearchInput(event);
	}
}

// Create an HTML button that all users -- especially keyboard users --
// can interact with, to clear the search input.
// To learn more about this, see:
// https://adrianroselli.com/2019/07/ignore-typesearch.html#Delete
// https://www.scottohara.me/blog/2022/02/19/custom-clear-buttons.html
function buildClearSearchButton(inputId) {
	const button = document.createElement("button");
	button.setAttribute("type", "button");
	button.setAttribute("aria-controls", inputId);
	button.classList.add("clear-button");
	const buttonLabel = window.searchClearButtonLabelLocalized;
	const icon = `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' focusable='false' role='img' viewBox='0 0 12 12' aria-label='${buttonLabel}'><path stroke='currentColor' stroke-linecap='round' stroke-width='2' d='M3 9l6-6m0 6L3 3'/></svg>`;
	button.innerHTML = icon;
	button.addEventListener("click", clearSearchInput);
	button.addEventListener("keyup", clearSearchInputOnKeypress);
	return button;
}

// Append the clear button to the search form
function appendClearSearchButton(input, form) {
	searchClearButton = buildClearSearchButton(input.id);
	form.append(searchClearButton);
	if (input.value.length > 0) {
		form.classList.add(searchFormFilledClassName);
	}
}

// Add a class to the search form when the input has a value;
// Remove that class from the search form when the input doesn't have a value.
// Do this on a delay, rather than on every keystroke.
const toggleClearSearchButtonAvailability = debounce(function (event) {
	const form = event.target.closest(searchFormSelector);
	form.classList.toggle(searchFormFilledClassName, event.target.value.length > 0);
}, 200);

document.addEventListener("DOMContentLoaded", function () {
	// Key map
	var ENTER = 13;
	var ESCAPE = 27;
	var SPACE = 32;
	var UP = 38;
	var DOWN = 40;
	var TAB = 9;

	function closest(element, selector) {
		if (Element.prototype.closest) {
			return element.closest(selector);
		}
		do {
			if (
				(Element.prototype.matches && element.matches(selector)) ||
				(Element.prototype.msMatchesSelector && element.msMatchesSelector(selector)) ||
				(Element.prototype.webkitMatchesSelector && element.webkitMatchesSelector(selector))
			) {
				return element;
			}
			element = element.parentElement || element.parentNode;
		} while (element !== null && element.nodeType === 1);
		return null;
	}

	// Set up clear functionality for the search field
	const searchForms = [...document.querySelectorAll(searchFormSelector)];
	const searchInputs = searchForms.map((form) => form.querySelector("input[type='search']"));
	searchInputs.forEach((input) => {
		appendClearSearchButton(input, input.closest(searchFormSelector));
		input.addEventListener("keyup", clearSearchInputOnKeypress);
		input.addEventListener("keyup", toggleClearSearchButtonAvailability);
	});

	// social share popups
	Array.prototype.forEach.call(document.querySelectorAll(".share a"), function (anchor) {
		anchor.addEventListener("click", function (e) {
			e.preventDefault();
			window.open(this.href, "", "height = 500, width = 500");
		});
	});

	// In some cases we should preserve focus after page reload
	function saveFocus() {
		var activeElementId = document.activeElement.getAttribute("id");
		sessionStorage.setItem("returnFocusTo", "#" + activeElementId);
	}
	var returnFocusTo = sessionStorage.getItem("returnFocusTo");
	if (returnFocusTo) {
		sessionStorage.removeItem("returnFocusTo");
		var returnFocusToEl = document.querySelector(returnFocusTo);
		returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
	}

	// show form controls when the textarea receives focus or backbutton is used and value exists
	var commentContainerTextarea = document.querySelector(".comment-container textarea"),
		commentContainerFormControls = document.querySelector(".comment-form-controls, .comment-ccs");

	if (commentContainerTextarea) {
		commentContainerTextarea.addEventListener("focus", function focusCommentContainerTextarea() {
			commentContainerFormControls.style.display = "block";
			commentContainerTextarea.removeEventListener("focus", focusCommentContainerTextarea);
		});

		if (commentContainerTextarea.value !== "") {
			commentContainerFormControls.style.display = "block";
		}
	}

	// Expand Request comment form when Add to conversation is clicked
	var showRequestCommentContainerTrigger = document.querySelector(".request-container .comment-container .comment-show-container"),
		requestCommentFields = document.querySelectorAll(".request-container .comment-container .comment-fields"),
		requestCommentSubmit = document.querySelector(".request-container .comment-container .request-submit-comment");

	if (showRequestCommentContainerTrigger) {
		showRequestCommentContainerTrigger.addEventListener("click", function () {
			showRequestCommentContainerTrigger.style.display = "none";
			Array.prototype.forEach.call(requestCommentFields, function (e) {
				e.style.display = "block";
			});
			requestCommentSubmit.style.display = "inline-block";

			if (commentContainerTextarea) {
				commentContainerTextarea.focus();
			}
		});
	}

	// Mark as solved button
	var requestMarkAsSolvedButton = document.querySelector(".request-container .mark-as-solved:not([data-disabled])"),
		requestMarkAsSolvedCheckbox = document.querySelector(".request-container .comment-container input[type=checkbox]"),
		requestCommentSubmitButton = document.querySelector(".request-container .comment-container input[type=submit]");

	if (requestMarkAsSolvedButton) {
		requestMarkAsSolvedButton.addEventListener("click", function () {
			requestMarkAsSolvedCheckbox.setAttribute("checked", true);
			requestCommentSubmitButton.disabled = true;
			this.setAttribute("data-disabled", true);
			// Element.closest is not supported in IE11
			closest(this, "form").submit();
		});
	}

	// Change Mark as solved text according to whether comment is filled
	var requestCommentTextarea = document.querySelector(".request-container .comment-container textarea");

	var usesWysiwyg = requestCommentTextarea && requestCommentTextarea.dataset.helper === "wysiwyg";

	function isEmptyPlaintext(s) {
		return s.trim() === "";
	}

	function isEmptyHtml(xml) {
		var doc = new DOMParser().parseFromString(`<_>${xml}</_>`, "text/xml");
		var img = doc.querySelector("img");
		return img === null && isEmptyPlaintext(doc.children[0].textContent);
	}

	var isEmpty = usesWysiwyg ? isEmptyHtml : isEmptyPlaintext;

	if (requestCommentTextarea) {
		requestCommentTextarea.addEventListener("input", function () {
			if (isEmpty(requestCommentTextarea.value)) {
				if (requestMarkAsSolvedButton) {
					requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute("data-solve-translation");
				}
				requestCommentSubmitButton.disabled = true;
			} else {
				if (requestMarkAsSolvedButton) {
					requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute("data-solve-and-submit-translation");
				}
				requestCommentSubmitButton.disabled = false;
			}
		});
	}

	// Disable submit button if textarea is empty
	if (requestCommentTextarea && isEmpty(requestCommentTextarea.value)) {
		requestCommentSubmitButton.disabled = true;
	}

	// Submit requests filter form on status or organization change in the request list page
	Array.prototype.forEach.call(document.querySelectorAll("#request-status-select, #request-organization-select"), function (el) {
		el.addEventListener("change", function (e) {
			e.stopPropagation();
			saveFocus();
			closest(this, "form").submit();
		});
	});

	// Submit requests filter form on search in the request list page
	var quickSearch = document.querySelector("#quick-search");
	quickSearch &&
		quickSearch.addEventListener("keyup", function (e) {
			if (e.keyCode === ENTER) {
				e.stopPropagation();
				saveFocus();
				closest(this, "form").submit();
			}
		});

	function toggleNavigation(toggle, menu) {
		var isExpanded = menu.getAttribute("aria-expanded") === "true";
		menu.setAttribute("aria-expanded", !isExpanded);
		toggle.setAttribute("aria-expanded", !isExpanded);
	}

	function closeNavigation(toggle, menu) {
		menu.setAttribute("aria-expanded", false);
		toggle.setAttribute("aria-expanded", false);
		toggle.focus();
	}

	var menuButton = document.querySelector(".header .menu-button-mobile");
	var menuList = document.querySelector("#user-nav-mobile");

	menuButton.addEventListener("click", function (e) {
		e.stopPropagation();
		toggleNavigation(this, menuList);
	});

	menuList.addEventListener("keyup", function (e) {
		if (e.keyCode === ESCAPE) {
			e.stopPropagation();
			closeNavigation(menuButton, this);
		}
	});

	// Toggles expanded aria to collapsible elements
	var collapsible = document.querySelectorAll(".collapsible-nav, .collapsible-sidebar");

	Array.prototype.forEach.call(collapsible, function (el) {
		var toggle = el.querySelector(".collapsible-nav-toggle, .collapsible-sidebar-toggle");

		el.addEventListener("click", function (e) {
			toggleNavigation(toggle, this);
		});

		el.addEventListener("keyup", function (e) {
			if (e.keyCode === ESCAPE) {
				closeNavigation(toggle, this);
			}
		});
	});

	// Submit organization form in the request page
	var requestOrganisationSelect = document.querySelector("#request-organization select");

	if (requestOrganisationSelect) {
		requestOrganisationSelect.addEventListener("change", function () {
			closest(this, "form").submit();
		});
	}

	// If multibrand search has more than 5 help centers or categories collapse the list
	var multibrandFilterLists = document.querySelectorAll(".multibrand-filter-list");
	Array.prototype.forEach.call(multibrandFilterLists, function (filter) {
		if (filter.children.length > 6) {
			// Display the show more button
			var trigger = filter.querySelector(".see-all-filters");
			trigger.setAttribute("aria-hidden", false);

			// Add event handler for click
			trigger.addEventListener("click", function (e) {
				e.stopPropagation();
				trigger.parentNode.removeChild(trigger);
				filter.classList.remove("multibrand-filter-list--collapsed");
			});
		}
	});

	// If there are any error notifications below an input field, focus that field
	var notificationElm = document.querySelector(".notification-error");
	if (notificationElm && notificationElm.previousElementSibling && typeof notificationElm.previousElementSibling.focus === "function") {
		notificationElm.previousElementSibling.focus();
	}

	// Dropdowns

	function Dropdown(toggle, menu) {
		this.toggle = toggle;
		this.menu = menu;

		this.menuPlacement = {
			top: menu.classList.contains("dropdown-menu-top"),
			end: menu.classList.contains("dropdown-menu-end"),
		};

		this.toggle.addEventListener("click", this.clickHandler.bind(this));
		this.toggle.addEventListener("keydown", this.toggleKeyHandler.bind(this));
		this.menu.addEventListener("keydown", this.menuKeyHandler.bind(this));
	}

	Dropdown.prototype = {
		get isExpanded() {
			return this.menu.getAttribute("aria-expanded") === "true";
		},

		get menuItems() {
			return Array.prototype.slice.call(this.menu.querySelectorAll("[role='menuitem']"));
		},

		dismiss: function () {
			if (!this.isExpanded) return;

			this.menu.setAttribute("aria-expanded", false);
			this.menu.classList.remove("dropdown-menu-end", "dropdown-menu-top");
		},

		open: function () {
			if (this.isExpanded) return;

			this.menu.setAttribute("aria-expanded", true);
			this.handleOverflow();
		},

		handleOverflow: function () {
			var rect = this.menu.getBoundingClientRect();

			var overflow = {
				right: rect.left < 0 || rect.left + rect.width > window.innerWidth,
				bottom: rect.top < 0 || rect.top + rect.height > window.innerHeight,
			};

			if (overflow.right || this.menuPlacement.end) {
				this.menu.classList.add("dropdown-menu-end");
			}

			if (overflow.bottom || this.menuPlacement.top) {
				this.menu.classList.add("dropdown-menu-top");
			}

			if (this.menu.getBoundingClientRect().top < 0) {
				this.menu.classList.remove("dropdown-menu-top");
			}
		},

		focusNextMenuItem: function (currentItem) {
			if (!this.menuItems.length) return;

			var currentIndex = this.menuItems.indexOf(currentItem);
			var nextIndex = currentIndex === this.menuItems.length - 1 || currentIndex < 0 ? 0 : currentIndex + 1;

			this.menuItems[nextIndex].focus();
		},

		focusPreviousMenuItem: function (currentItem) {
			if (!this.menuItems.length) return;

			var currentIndex = this.menuItems.indexOf(currentItem);
			var previousIndex = currentIndex <= 0 ? this.menuItems.length - 1 : currentIndex - 1;

			this.menuItems[previousIndex].focus();
		},

		clickHandler: function () {
			if (this.isExpanded) {
				this.dismiss();
			} else {
				this.open();
			}
		},

		toggleKeyHandler: function (e) {
			switch (e.keyCode) {
				case ENTER:
				case SPACE:
				case DOWN:
					e.preventDefault();
					this.open();
					this.focusNextMenuItem();
					break;
				case UP:
					e.preventDefault();
					this.open();
					this.focusPreviousMenuItem();
					break;
				case ESCAPE:
					this.dismiss();
					this.toggle.focus();
					break;
			}
		},

		menuKeyHandler: function (e) {
			var firstItem = this.menuItems[0];
			var lastItem = this.menuItems[this.menuItems.length - 1];
			var currentElement = e.target;

			switch (e.keyCode) {
				case ESCAPE:
					this.dismiss();
					this.toggle.focus();
					break;
				case DOWN:
					e.preventDefault();
					this.focusNextMenuItem(currentElement);
					break;
				case UP:
					e.preventDefault();
					this.focusPreviousMenuItem(currentElement);
					break;
				case TAB:
					if (e.shiftKey) {
						if (currentElement === firstItem) {
							this.dismiss();
						} else {
							e.preventDefault();
							this.focusPreviousMenuItem(currentElement);
						}
					} else if (currentElement === lastItem) {
						this.dismiss();
					} else {
						e.preventDefault();
						this.focusNextMenuItem(currentElement);
					}
					break;
				case ENTER:
				case SPACE:
					e.preventDefault();
					currentElement.click();
					break;
			}
		},
	};

	var dropdowns = [];
	var dropdownToggles = Array.prototype.slice.call(document.querySelectorAll(".dropdown-toggle"));

	dropdownToggles.forEach(function (toggle) {
		var menu = toggle.nextElementSibling;
		if (menu && menu.classList.contains("dropdown-menu")) {
			dropdowns.push(new Dropdown(toggle, menu));
		}
	});

	document.addEventListener("click", function (evt) {
		dropdowns.forEach(function (dropdown) {
			if (!dropdown.toggle.contains(evt.target)) {
				dropdown.dismiss();
			}
		});
	});
});
{
	/* <script>
		var skPromise = Smooch.init({
			integrationId: '63e1a774e30b38011a2a5e22'
			,
			displayName: '이지봇',
			customColors: {
				brandColor: '65758e',
				conversationColor: '65758e',
				actionColor: '65758e',
			},

			menuItems: {
				imageUpload: true,
				fileUpload: true,
				shareLocation: true,
			},
			prechatCapture: {
				avatarUrl: 'https://static.zdassets.com/web_widget/latest/default_avatar.png',
				enabled: true,
				enableEmailLinking: true,
				fields: [
					{
						type: 'select',
						name: '작업 유형',
						label: '작업 유형',
						placeholder: '선택해주세요',
						options: [
							{
								name: '질문하기',
								label: '질문하기',
							},
							{
								name: '문제 신고',
								label: '문제 신고',
							},
							{
								name: '가입 플랜 관리',
								label: '가입 플랜 관리',
							},
						],
					},
					{
						type: 'text',
						name: '내용',
						label: '내용',
						placeholder: '구체적인 내용을 입력해주세요',
					},
					{
						type: 'email',
						name: '이메일',
						label: '이메일',
						placeholder: 'your@email.com',
					},
				],
			},

			customText: {
				connectNotificationText: 'Sync your conversation and continue messaging us through your favorite app.',
				connectNotificationSingleText: 'Be notified when you get a reply.',
				conversationListHeaderText: 'My conversations',
				conversationListPreviewAnonymousText: 'Someone',
				conversationListPreviewCarouselText: '{user} sent a message',
				conversationListPreviewFileText: '{user} sent a file',
				conversationListPreviewFormText: '{user} sent a form',
				conversationListPreviewFormResponseText: '{user} filled a form',
				conversationListPreviewImageText: '{user} sent an image',
				conversationListPreviewLocationRequestText: '{user} sent a location request',
				conversationListPreviewUserText: 'You',
				conversationListRelativeTimeJustNow: 'Just now',
				conversationListRelativeTimeMinute: '1 minute ago',
				conversationListRelativeTimeMinutes: '{value} minutes ago',
				conversationListRelativeTimeHour: '1 hour ago',
				conversationListRelativeTimeHours: '{value} hours ago',
				conversationListRelativeTimeYesterday: 'Yesterday',
				conversationListTimestampFormat: 'MM/DD/YY',
				conversationTimestampHeaderFormat: 'MMMM D YYYY, h:mm A',
				couldNotConnect: 'Offline. You will not receive messages.',
				couldNotConnectRetry: 'Reconnecting...',
				couldNotConnectRetrySuccess: "You're back online!",
				couldNotLoadConversations: 'Couldn’t load conversations.',
				emailChangeAddress: 'Change my email',
				emailDescription: 'To be notified by email when you get a reply, enter your email address.',
				emailFieldLabel: 'Email',
				emailFieldPlaceholder: 'Your email address',
				emailFormButton: 'Submit',
				emailLinkingErrorMessage: 'Please submit a valid email address.',
				fetchHistory: 'Load more',
				fetchingHistory: 'Retrieving history...',
				fileTooLargeError: 'Max file size limit exceeded ({size})',
				fileTypeError: 'Unsupported file type.',
				formErrorEntryRequired: 'This entry is required',
				formErrorInvalidEmail: 'Email is invalid',
				formErrorNoLongerThan: 'Must contain no more than ({characters}) characters',
				formErrorNoShorterThan: 'Must contain at least ({characters}) characters',
				formErrorUnknown: "This doesn't look quite right",
				formFieldSelectPlaceholderFallback: 'Choose one...',
				frontendEmailChannelDescription:
					"To talk to us using email just send a message to our email address and we'll reply shortly:",
				headerText: 'How can we help?',
				imageClickToReload: 'Click to reload image.',
				imageClickToView: 'Click to view {size} image.',
				imagePreviewNotAvailable: 'Preview not available.',
				inputPlaceholder: '메시지를 입력해주세요',
				inputPlaceholderBlocked: 'Complete the form above...',
				introAppText: 'Message us below or from your favorite app.',
				lineChannelDescription: 'To talk to us using LINE, scan this QR code using the LINE app and send us a message.',
				linkError: 'An error occurred when attempting to generate a link for this channel. Please try again.',
				linkChannelPageHeader: 'Sync your conversation',
				locationNotSupported:
					'Your browser does not support location services or it’s been disabled. Please type your location instead.',
				locationSecurityRestriction: 'This website cannot access your location. Please type your location instead.',
				locationSendingFailed: 'Could not send location',
				locationServicesDenied:
					'This website cannot access your location. Allow access in your settings or type your location instead.',
				messageIndicatorTitlePlural: '({count}) New messages',
				messageIndicatorTitleSingular: '({count}) New message',
				messageRelativeTimeDay: '{value}d ago',
				messageRelativeTimeHour: '{value}h ago',
				messageRelativeTimeJustNow: 'Just now',
				messageRelativeTimeMinute: '{value}m ago',
				messageTimestampFormat: 'h:mm A',
				messageDelivered: 'Delivered',
				messageSeen: 'Seen',
				messageSending: 'Sending...',
				messengerChannelDescription:
					'Connect your Facebook Messenger account to be notified when you get a reply and continue the conversation on Facebook Messenger.',
				newConversationButtonText: '새로운 대화',
				notificationSettingsChannelsDescription:
					'Sync this conversation by connecting to your favorite messaging app to continue the conversation your way.',
				notificationSettingsChannelsTitle: 'Other Channels',
				notificationSettingsConnected: 'Connected',
				notificationSettingsConnectedAs: 'Connected as {username}',
				prechatCaptureGreetingText: "안녕하세요. 저는 이지컴아이앤씨 챗봇입니다.성심껏 도와 드리겠습니다😀️",
				prechatCaptureNameLabel: 'Your name',
				prechatCaptureNamePlaceholder: 'Type your name...',
				prechatCaptureEmailLabel: 'Email',
				prechatCaptureEmailPlaceholder: 'name@company.com',
				prechatCaptureConfirmationText: 'Thanks for that! What can we help you with?',
				prechatCaptureMailgunLinkingConfirmation: "You'll be notified here and by email at {email} once we reply.",
				sendButtonText: '전송',
			},
		}).then(function () {
			Smooch.getConversationById().then((currentConversation) => {
				console.log(currentConversation);
			});
		});
		Smooch.on('ready', function () {
			console.log('the init has completed!');
		});

	</script> */
}

{
	/* <script>
		var skPromise = Smooch.init({
			integrationId: '63e1a774e30b38011a2a5e22'
			,
			displayName: '이지봇',
			customColors: {
				brandColor: '65758e',
				conversationColor: '65758e',
				actionColor: '65758e',
			},

			menuItems: {
				imageUpload: true,
				fileUpload: true,
				shareLocation: true,
			},
		})
		Smooch.on('ready', () => {
			var conversations = Smooch.getConversations();

			Smooch.createConversation({

			}).then((conversation) => {
				console.log(conversation)
			});

		})
		Smooch.on('connected', function (data) {
			console.log('Connected with conversation', data.id);
		});

const open = Smooch.isOpened();
			console.log('open', open)

			const iframe = document.getElementById("web-messenger-container");

			const button = iframe.contentWindow.document.querySelector('.conversation-group .conversation-group-footer button')

			button.addEventListener('click', (e) => {
				e.preventDefault();
				Smooch.createConversation({

				}).then((conversation) => {
					console.log(conversation)
				});
			})
	</script> */
}
