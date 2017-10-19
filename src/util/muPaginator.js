/**
 * Class for 'paginating' an array
 */
class MuPaginator {
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

    maxPage() {
        return Math.ceil(this.data.length/this.pageSize)
    }

    isLastPage() {
        return !(this.maxPage() > this.currentPage)
    }

    lastPage() {
        this.currentPage = Math.ceil(this.data.length/this.pageSize)
        return this.getPage()
    }

    firstPage() {
        this.currentPage = 1
        return this.getPage()
    }

    nextPage() {
        if (!this.isLastPage()) {
            this.currentPage++
        }
        return this.getPage()
    }

    previousPage() {
        this.currentPage--
        if (this.currentPage < 1) {
            this.currentPage = 1
        }
        return this.getPage()
    }

}
