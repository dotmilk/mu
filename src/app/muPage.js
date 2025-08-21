import { MuPageManager } from './muPageManager'
/**
 * Abstract class for page controllers
 */
export class MuPage {
    /**
     * This is always called by super in extending class don't worry about it...
     * @param {Object} options - Just two options
     * @param {String} options.pageName - Name of the page
     * @param {MuPageManager} options.pageManager - Reference to the {@link MuPageManager} managing this page
     */
    constructor({pageName, pageManager}) {
        this.pageName = pageName
        this.pageManager = pageManager
    }
    /**
     * Handler for load:pageName, subclass may implement
     */
    onLoad() {}
    /**
     * Handler for show:pageName, subclass may implement
     */
    onShow() {}
    /**
     * Handler for hide:pageName, subclass may implement
     */
    onHide() {}
}
