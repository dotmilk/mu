/**
 * Class for 'paginating' an array
 */
export class MuPaginator {
    /**
     * Set a pagesize and pass in some  data, if you reset or change data from outside
     * you should probably go ahead and set instance.paginate to undefined before
     * getting next page or change current page...or really do whatever to get
     * your desired result
     * @param {Object} options - Options for paginator
     * @param {Integer} options.pageSize - Items to return per page
     * @param {Array} options.data - An array to paginate, yay!
     * @example
     * let p = new MuPaginator({pageSize: 2, data: [1,2,3,4,5,6,7,8,9,10]})
     * console.log(p.nextPage())
     * // [3,4]
     */
    constructor({pageSize, data}) {
        if (!Array.isArray(data)) {
            throw "Data must be array"
        }
        this.data = data
        this.pageSize = pageSize
        this.currentPage = 1
    }
    /**
     * Internal generator function, for the actual paginating, cause why the hell not
     * @yields {(Value | PageDone)} Very fancy
     */
    * paginator(start) {
        let newIndex
        let doIt
        for (let i = start || 0; true; i++) {
            if (i - start == this.pageSize || doIt) {
                doIt = false
                newIndex = yield 'PaGeDoNe'
                if (newIndex || newIndex == 0) {
                    start = newIndex
                    i = newIndex - 1
                }
            }
            if (this.data[i] || this.data[i] == 0 || this.data[i] == false) {
                yield this.data[i]
            } else {
                doIt = true
            }
        }
    }
    /**
     * Does pretty much all of the work, returns a page by pagenumber.
     * @param {Integer?} pageNumber - defaults to this.currentPage if not provided
     */
    getPage(pageNumber = this.currentPage) {
        this.currentPage = pageNumber
        let page = []
        let startingIndex = (pageNumber - 1) * this.pageSize
        if (!this.paginate) {
            this.paginate = this.paginator(startingIndex)
        } else {
            this.paginate.next(startingIndex)
        }
        let val
        while (true) {
            val = this.paginate.next().value
            if (val == 'PaGeDoNe') { break }
            page.push(val)
        }
        return page
    }
    /**
     * Returns the max possible page number
     */
    maxPage() {
        return Math.ceil(this.data.length/this.pageSize)
    }
    /**
     * Are we on the last page?
     */
    isLastPage() {
        return !(this.maxPage() > this.currentPage)
    }
    /**
     * If we weren't, we are now, on the last page that is.
     */
    lastPage() {
        this.currentPage = Math.ceil(this.data.length/this.pageSize)
        return this.getPage()
    }
    /**
     * Similar to {@link MuPaginator#lastPage} except by some miracle, gets you the first page
     */
    firstPage() {
        this.currentPage = 1
        return this.getPage()
    }
    /**
     * Now this one is unique, it gets you the next page
     */
    nextPage() {
        if (!this.isLastPage()) {
            this.currentPage++
        }
        return this.getPage()
    }
    /**
     * Ok I lied {@link MuPaginator#nextPage} wasn't that unique, this gets a page too
     * but the previous one this time.
     */
    previousPage() {
        this.currentPage--
        if (this.currentPage < 1) {
            this.currentPage = 1
        }
        return this.getPage()
    }

}
