import * as JitsiConferenceEvents from '/JitsiConferenceEvents';

/**
 *
 */
class ICExtensions {

    /**
     * Handles incoming messages and processes <ic> tags.
     *
     * @param {Element} msg - The message XML element.
     * @param {ChatRoom} room - The chat room associated with the message.
     * @returns {boolean}
     */
    handleICPayload(room, msg) {
        // Extract the <ic> element from the message
        let icElement = null;

        for (const child of msg.children) {
            if (child.tagName === 'ic') {
                icElement = child;
                break;
            }
        }

        if (icElement !== null) {

            for (const child of icElement.children) {
                if (child.tagName === 'roles') {
                    this.handleICRoles(room, child, msg);
                }

                if (child.tagName === 'transcript_links') {
                    this.handleICTranscriptLinks(room, child, msg);
                }

                if (child.tagName === 'reject-recording') {
                    this.handleICRejectRecording(room);
                }
            }

            // Return true to indicate successful handling
            return true;
        }

        // No <ic> tag found, nothing to handle
        return false;
    }

    /**
     * Handles use role settings.
     *
     * @param {ChatRoom} room - The chat room associated with the message.
     * @param {Element} roleMsg - The roles stanza from Prosody.
     * @param {Element} roomMsg - The message XML element.
     */
    handleICRoles(room, roleMsg, roomMsg) {

        // Iterate over each <user> element
        Array.from(roleMsg.getElementsByTagName('user')).forEach(
            userElement => {
                const userJid = userElement.getAttribute('jid');
                const roles = [];

                // Iterate over each <role> element within the user
                Array.from(userElement.getElementsByTagName('role')).forEach(roleElement => {
                    const roleName = roleElement.getElementsByTagName('name')[0]
                        ?.textContent || '';
                    const partner = roleElement.getElementsByTagName('partner')[0]
                        ?.textContent || null;

                    if (roleName !== '') {
                        roles.push({
                            name: roleName,
                            partner
                        });
                    }
                });

                // Emit the event for this user's roles
                if (room.eventEmitter && userJid) {
                    room.eventEmitter.emit(
                        JitsiConferenceEvents.USER_IC_ROLES_CHANGED,
                        userJid,
                        roles
                    );
                }
            }
        );
    }

    /**
     * Handles the setting of new transcript Links.
     *
     * @param {ChatRoom} room - The chat room associated with the message.
     * @param {Element} transcriptLinksMsg - The transcript links stanza from Prosody.
     * @param {Element} roomMsg - The message XML element.
     */
    handleICTranscriptLinks(room, transcriptLinksMsg, roomMsg) {
        const newLink = transcriptLinksMsg.getElementsByTagName('link');

        if (newLink !== undefined && newLink.length > 0) {
            const newLinkText = newLink[0].textContent;

            // Emit the event for this rooms transcript links
            if (room.eventEmitter) {
                room.eventEmitter.emit(JitsiConferenceEvents.ROOM_IC_TRANSCRIPT_LINKS_CHANGED, newLinkText);
            }
        }
    }

    /**
     * Handles a recording rejection.
     *
     * @param {ChatRoom} room - The chat room associated with the message.
     */
    handleICRejectRecording(room) {
        // Emit the event for this rooms
        if (room.eventEmitter) {
            room.eventEmitter.emit(JitsiConferenceEvents.ROOM_IC_REJECT_RECORDING);
        }
    }
}

export default ICExtensions;
