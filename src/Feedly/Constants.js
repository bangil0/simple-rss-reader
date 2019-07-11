import {getUserId} from './UserDetails'

const isDev = window.require("electron-is-dev");
const Store = window.require('electron-store');
const store = new Store();

function getProfile() {
    if(isDev)
        return `https://cors-anywhere.herokuapp.com/https://cloud.feedly.com/v3/profile`
    else
        return `https://cloud.feedly.com/v3/profile`
}

function getStream() {
    let userId = getUserId()
    let isUnreadOnly = store.get('isUnreadOnly', false)

    if(isDev)
        return `https://cors-anywhere.herokuapp.com/https://cloud.feedly.com/v3/streams/contents?streamId=user/${userId}/category/global.all&unreadOnly=${isUnreadOnly}`
    else
        return `https://cloud.feedly.com/v3/streams/contents?streamId=user/${userId}/category/global.all&unreadOnly=${isUnreadOnly}`
}

function getEntry(entryId) {
    let url = encodeURIComponent(entryId)
    
    if(isDev)
        return `https://cors-anywhere.herokuapp.com/https://cloud.feedly.com/v3/entries/entriesId=${url}`
    else
        return `https://cloud.feedly.com/v3/entries/entriesId=${url}`
}

function markAsRead() {
    if(isDev)
        return `https://cors-anywhere.herokuapp.com/https://cloud.feedly.com/v3/markers`
    else
        return `https://cloud.feedly.com/v3/markers`
}

function getUnreadCount() {
    if(isDev)
        return `https://cors-anywhere.herokuapp.com/https://cloud.feedly.com/v3/markers/counts`
    else
        return `https://cloud.feedly.com/v3/markers/counts`
}

export { getProfile, getStream, getEntry, markAsRead, getUnreadCount }