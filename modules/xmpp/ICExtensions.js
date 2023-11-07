import ChatRoom from './ChatRoom';
import * as JitsiConferenceEvents from '/JitsiConferenceEvents';

class ICExtensions {
    /**
     *
     */
    constructor() {        
    }


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
        for (let child of msg.children) {
            if (child.tagName === 'ic') {
                icElement = child;
                break;
            }
        }
        
        if (icElement != null) {
            // Process the payload inside <ic>
            //console.log(`IC Payload for room:`, icElement);            
            
            for (let child of icElement.children) {
                if (child.tagName === 'roles') {
                    this.handleICRoles(room, child, msg);
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
        //console.log("Incoming roles:" , roleMsg);

        // Iterate over each <user> element
        Array.from(roleMsg.getElementsByTagName('user')).forEach(userElement => {
            const userJid = userElement.getAttribute('jid');
            const roles = [];

            // Iterate over each <role> element within the user
            Array.from(userElement.getElementsByTagName('role')).forEach(roleElement => {
                const roleName = roleElement.getElementsByTagName('name')[0]?.textContent || '';
                const partner = roleElement.getElementsByTagName('partner')[0]?.textContent || null;

                roles.push({'name': roleName, 'partner': partner});
            });

            // Emit the event for this user's roles
            if (room.eventEmitter && userJid) {
                room.eventEmitter.emit(JitsiConferenceEvents.USER_IC_ROLES_CHANGED, userJid, roles);
            }
        });        
    }
}
  
export default ICExtensions;